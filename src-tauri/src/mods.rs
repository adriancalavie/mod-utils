use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
};

use crate::{
    hashing::file_tosha512,
    modrinth::{
        project::{get_projects, Project, SupportValue},
        version::{get_versions, Version},
    },
    utils::combine,
};

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ModType {
    Client,
    Server,
    Both,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Mod {
    name: String,
    version: String,
    #[serde(rename = "type")]
    mod_type: ModType,
}

fn to_mod_type(version: Version, project: Project) -> Mod {
    use SupportValue::*;

    let client_active = matches!(project.client_side, Required | Optional);
    let server_active = matches!(project.server_side, Required | Optional);

    let mod_type = match (client_active, server_active) {
        (true, true) => ModType::Both,
        (true, false) => ModType::Client,
        (false, true) => ModType::Server,
        (false, false) => ModType::Client, // maybe should log a warning?
    };

    Mod {
        name: project.title,
        version: version.version_number,
        mod_type,
    }
}

fn is_jar_file(path: &PathBuf) -> bool {
    path.is_file() && path.extension().map_or(false, |ext| ext == "jar")
}

pub fn get_mods(dir: &Path) -> Vec<Mod> {
    if !dir.is_dir() {
        return vec![];
    }

    let hash_to_name: HashMap<String, String> = fs::read_dir(dir)
        .unwrap()
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(is_jar_file)
        .map(|path| {
            let hash = file_tosha512(&path);
            let name = path.file_stem().unwrap().to_string_lossy().to_string();
            (hash, name)
        })
        .collect();

    let hashes = hash_to_name.keys().cloned().collect();
    let versions_response = get_versions(hashes);

    let ids: Vec<String> = versions_response
        .as_ref()
        .unwrap()
        .values()
        .map(|v| v.project_id.clone())
        .collect();

    let projects_response = get_projects(ids);

    let versions = versions_response
        .unwrap()
        .values()
        .map(|v| v.clone())
        .collect();

    let projects = projects_response
        .unwrap()
        .into_iter()
        .map(|p| p.clone())
        .collect();

    combine(versions, projects, to_mod_type)
}
