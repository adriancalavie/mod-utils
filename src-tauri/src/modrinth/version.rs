use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::http::http_client;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Algorithm {
    Sha1,
    Sha512,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BulkVersionFromHash {
    hashes: Vec<String>,
    algorithm: Algorithm,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ModrinthFile {
    pub url: String,
    pub filename: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Version {
    pub project_id: String,
    pub version_number: String,
    pub files: Vec<ModrinthFile>,
}

pub type VersionsResponse = HashMap<String, Version>;

const BULK_VERSIONS_URL: &str = "https://api.modrinth.com/v2/version_files";

pub async fn get_versions(hashes: Vec<String>) -> Result<VersionsResponse, reqwest::Error> {
    let client = http_client();
    let body = BulkVersionFromHash {
        hashes,
        algorithm: Algorithm::Sha512,
    };
    let response = client.post(BULK_VERSIONS_URL).json(&body).send().await?;
    let response_json = response.json::<VersionsResponse>().await?;
    Ok(response_json)
}
