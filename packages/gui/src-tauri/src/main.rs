#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod handlers;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      handlers::packages::install_package,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
