#[tauri::command]
pub fn install_package(package: String) {
  println!("installing: {}", package);
  
}