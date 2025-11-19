use serde::{Deserialize, Serialize};
use std::{fs, path::Path};

use crate::hashing::sha512_file;

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

pub fn get_mods(dir: &Path) -> Vec<Mod> {
    if !dir.is_dir() {
        return vec![];
    }

    fs::read_dir(dir)
        .unwrap()
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(|e| e.is_file())
        .map(|path| {
            let hash = sha512_file(&path);
            println!("Hash for {} : {}", path.display(), hash);
            let name = path.file_stem().unwrap().to_string_lossy().to_string();
            let version = path.file_name().unwrap().to_string_lossy().to_string();
            let mod_type = ModType::Client; // Default to Client type

            Mod {
                name,
                version,
                mod_type,
            }
        })
        .collect()
}
