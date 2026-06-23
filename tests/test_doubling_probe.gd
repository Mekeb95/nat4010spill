## Regresjonsvakt: beviser at GUT test-dobler/stubbing virker under Godot 4.6.3
## (etter de lokale patchene i addons/gut/LOCAL_PATCHES.md). Hvis denne ryker
## etter en GUT-oppdatering, må patchene reapplikeres.
extends GutTest


func test_double_and_stub_overrides_return_value() -> void:
	var probe_script: GDScript = load("res://tests/_helpers/probe_target.gd")
	var dbl: Object = double(probe_script).new()
	stub(dbl, "compute").to_return(99)
	assert_eq(dbl.compute(), 99, "stub() skal overstyre returverdien fra doblingen")
