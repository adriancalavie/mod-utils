use hex;
use sha2::{Digest, Sha512};
use std::fs;

pub fn file_tosha512(path: &std::path::Path) -> String {
    let data = fs::read(path).unwrap();
    let mut hasher = Sha512::new();
    hasher.update(data);
    let result = hasher.finalize();
    hex::encode(result)
}
