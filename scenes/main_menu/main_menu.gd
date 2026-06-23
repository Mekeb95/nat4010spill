## MainMenu — Fase 0 boot-skjerm. Bygger en minimal portrett-meny i kode slik at
## spillet booter til en hovedmeny (Fase 0-mål). Ingen spill-logikk her (§7.2);
## knappene er stubber som kobles på etter hvert som sløyfa bygges.
extends Control


func _ready() -> void:
	var bg: ColorRect = ColorRect.new()
	bg.color = Color("1b1714")
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	var center: CenterContainer = CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(center)

	var col: VBoxContainer = VBoxContainer.new()
	col.alignment = BoxContainer.ALIGNMENT_CENTER
	col.add_theme_constant_override("separation", 24)
	center.add_child(col)

	var title: Label = Label.new()
	title.text = "Aske og Malm"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 56)
	title.add_theme_color_override("font_color", Color("e8b06a"))
	col.add_child(title)

	var subtitle: Label = Label.new()
	subtitle.text = "Fase 0 — fundamentet står"
	subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	subtitle.add_theme_color_override("font_color", Color("8a7e72"))
	col.add_child(subtitle)

	col.add_child(_make_button("Ny run", _on_new_run_pressed))
	col.add_child(_make_button("Avslutt", _on_quit_pressed))


func _make_button(label: String, handler: Callable) -> Button:
	var button: Button = Button.new()
	button.text = label
	button.custom_minimum_size = Vector2(280, 72)
	button.pressed.connect(handler)
	return button


func _on_new_run_pressed() -> void:
	# Stubb til Fase 1+: starter en run når den taktiske sløyfa finnes.
	print("[MainMenu] Ny run kommer i Fase 1+. Innhold lastet: %d kreaturer, %d metaller." % [
		ContentRegistry.creature_count(), ContentRegistry.metal_count()])


func _on_quit_pressed() -> void:
	get_tree().quit()
