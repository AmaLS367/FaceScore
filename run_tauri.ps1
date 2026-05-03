$cargoPath = "$HOME\.cargo\bin"
if ($env:PATH -notlike "*$cargoPath*") {
    $env:PATH = "$env:PATH;$cargoPath"
}
npm run tauri dev
