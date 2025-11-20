use once_cell::sync::Lazy;
use reqwest::blocking::Client;

static HTTP_CLIENT: Lazy<Client> = Lazy::new(|| {
    Client::builder()
        .user_agent("AlkazerothsModUtils/1.0")
        .build()
        .expect("Failed to build client")
});

pub fn http_client() -> &'static Client {
    &HTTP_CLIENT
}
