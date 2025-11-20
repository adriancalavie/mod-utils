use reqwest::Url;
use serde::{Deserialize, Serialize};
use serde_json::to_string;

use crate::http::http_client;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SupportValue {
    Required,
    Optional,
    Unsupported,
    Unknown,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub title: String,
    pub client_side: SupportValue,
    pub server_side: SupportValue,
    pub icon_url: Option<String>,
}

pub type GetProjectsResponse = Vec<Project>;

const BULK_PROJECTS_URL: &str = "https://api.modrinth.com/v2/projects";

pub fn get_projects(ids: Vec<String>) -> Result<GetProjectsResponse, reqwest::Error> {
    let client = http_client();

    let ids_json = to_string(&ids).expect("Failed to serialize ids");
    let url = Url::parse_with_params(BULK_PROJECTS_URL, &[("ids", &ids_json)])
        .expect("Failed to build URL");

    let response = client.get(url).send()?;
    let projects = response.json::<GetProjectsResponse>()?;
    Ok(projects)
}
