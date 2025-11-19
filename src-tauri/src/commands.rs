use crate::mods::{get_mods, Mod};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Clone, Serialize, Deserialize)]
pub struct ModsPayload {
    mods: Vec<Mod>,
}

#[tauri::command]
pub fn load_mods(directory: String) -> Result<ModsPayload, String> {
    let mods = get_mods(&PathBuf::from(directory));
    Ok(ModsPayload { mods })
}
