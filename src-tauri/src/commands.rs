use crate::{
    hashing::file_tosha512,
    modrinth::{project::get_projects, version::get_versions},
    mods::{is_jar_file, to_mod_type, Mod},
    utils::{combine, proportional_clamp_f32},
};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs, path::PathBuf};
use tauri::{AppHandle, Emitter};
use tokio::sync::mpsc;

#[derive(Clone, Serialize, Deserialize)]
pub struct ModsPayload {
    mods: Vec<Mod>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct LoadModsProgress {
    status: String,
    progress: f32,
}

fn spawn_progress_emitter(app: AppHandle, mut rx: mpsc::UnboundedReceiver<LoadModsProgress>) {
    tokio::spawn(async move {
        while let Some(progress) = rx.recv().await {
            let _ = app.emit("loading-progress", progress);
        }
    });
}

fn hash_jar_files(
    dir: PathBuf,
    tx: mpsc::UnboundedSender<LoadModsProgress>,
) -> HashMap<String, String> {
    let compute_progress = |value: f32| proportional_clamp_f32(value, 0.0, 1.0, 0.15, 0.83);

    let mut map = HashMap::new();
    let entries: Vec<_> = fs::read_dir(&dir)
        .unwrap()
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(|p| is_jar_file(p))
        .collect();
    let _ = tx.send(LoadModsProgress {
        status: "Finished reading .jar files".to_string(),
        progress: 0.15,
    });

    for (idx, path) in entries.iter().enumerate() {
        let hash = file_tosha512(path);
        let name = path.file_stem().unwrap().to_string_lossy().to_string();
        map.insert(hash, name);

        let _ = tx.send(LoadModsProgress {
            status: format!("Hashing .jar files ({}/{})", idx + 1, entries.len()),
            progress: compute_progress((idx + 1) as f32 / entries.len() as f32),
        });
    }

    map
}

#[tauri::command]
pub async fn load_mods(app: tauri::AppHandle, directory: String) -> Result<ModsPayload, String> {
    let dir = PathBuf::from(&directory);
    if !dir.is_dir() {
        return Ok(ModsPayload { mods: vec![] });
    }

    // Channel for progress updates
    let (tx, rx) = mpsc::unbounded_channel::<LoadModsProgress>();
    spawn_progress_emitter(app.clone(), rx);

    let _ = tx.send(LoadModsProgress {
        status: "Starting loading mods".into(),
        progress: 0.01, // 1%
    });

    let tx_blocking = tx.clone();
    let dir_clone = dir.clone();
    let hash_to_name: HashMap<String, String> =
        tokio::task::spawn_blocking(move || hash_jar_files(dir_clone, tx_blocking))
            .await
            .map_err(|e| format!("spawn_blocking failed: {e}"))?;

    let _ = tx.send(LoadModsProgress {
        status: "Hashing complete".into(),
        progress: 0.84,
    });

    let _ = tx.send(LoadModsProgress {
        status: "Fetching versions".into(),
        progress: 0.85,
    });

    let hashes = hash_to_name.keys().cloned().collect();
    let versions = get_versions(hashes).await.map_err(|e| e.to_string())?;

    let _ = tx.send(LoadModsProgress {
        status: "Fetching projects".into(),
        progress: 0.95,
    });
    let ids = versions.values().map(|v| v.project_id.clone()).collect();
    let projects = get_projects(ids).await.map_err(|e| e.to_string())?;

    let _ = tx.send(LoadModsProgress {
        status: "Finished".into(),
        progress: 1.0,
    });

    Ok(ModsPayload {
        mods: combine(
            versions.values().cloned().collect(),
            projects.into_iter().collect(),
            to_mod_type,
        ),
    })
}
