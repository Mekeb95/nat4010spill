## SaveManager — autoload. To filer (§6.5): persistent meta-save + gjenopptakbar
## run-save. Versjonsfelt fra dag én for trygg migrering senere. Stubb i Fase 0;
## ekte serialisering (Resource/ResourceSaver eller JSON) kommer i Fase 4–5.
extends Node

const SAVE_VERSION: int = 1
const META_PATH: String = "user://meta.save"
const RUN_PATH: String = "user://run.save"


func has_run_save() -> bool:
	return FileAccess.file_exists(RUN_PATH)


func has_meta_save() -> bool:
	return FileAccess.file_exists(META_PATH)
