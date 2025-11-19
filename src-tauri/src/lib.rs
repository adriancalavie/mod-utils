use tauri::Manager;
use window_vibrancy::apply_mica;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_liquid_glass, NSGlassEffectViewStyle};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_liquid_glass(&window, NSGlassEffectViewStyle::Clear, None, Some(26.0)).expect(
                "Unsupported platform! 'apply_liquid_glass' is only supported on macOS 26+",
            );

            #[cfg(target_os = "windows")]
            apply_mica(&window, None).expect("Mica is only supported on Windows 11+");

            Ok(())
        })
        // .invoke_handler(tauri::generate_handler![set_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
