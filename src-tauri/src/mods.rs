use serde::{Deserialize, Serialize};
use std::path::PathBuf;

use crate::modrinth::{
    project::{Project, SupportValue},
    version::Version,
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

pub fn to_mod_type(version: Version, project: Project) -> Mod {
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

pub fn is_jar_file(path: &PathBuf) -> bool {
    path.is_file() && path.extension().map_or(false, |ext| ext == "jar")
}
