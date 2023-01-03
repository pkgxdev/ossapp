#[tauri::command]
pub fn auth(package: String) {
  println!("installing: {}", package);
  
}