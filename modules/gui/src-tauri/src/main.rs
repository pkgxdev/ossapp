#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod handlers;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::{Manager, WindowEvent};
use window_ext::WindowExt;
mod window_ext;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      handlers::packages::install_package,
    ])
    .setup(|app| {
        let win = app.get_window("main").unwrap();
        // win.set_transparent_titlebar(true);
        // win.position_traffic_lights(30.0, 30.0);
        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
