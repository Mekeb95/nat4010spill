## Røyktest for Fase 0 — beviser at fundamentet står og kjører grønt headless:
## frøsatt RNG er deterministisk, schemas instansierbare, og ContentRegistry har
## lastet og validert sample-innholdet. Kampmatten med gulltester kommer i Fase 1.
extends GutTest


func test_seeded_rng_is_deterministic() -> void:
	var a: SeededRng = SeededRng.new(12345)
	var b: SeededRng = SeededRng.new(12345)
	for i: int in range(20):
		assert_eq(a.randi_range(1, 1000), b.randi_range(1, 1000),
			"Samme frø skal gi samme sekvens (steg %d)" % i)


func test_seeded_rng_differs_by_seed() -> void:
	var a: SeededRng = SeededRng.new(1)
	var b: SeededRng = SeededRng.new(2)
	var differs: bool = false
	for i: int in range(20):
		if a.randi_range(1, 1_000_000) != b.randi_range(1, 1_000_000):
			differs = true
			break
	assert_true(differs, "Ulike frø skal (nær sikkert) gi ulik sekvens")


func test_derive_is_independent_but_deterministic() -> void:
	var base_a: SeededRng = SeededRng.new(7)
	var base_b: SeededRng = SeededRng.new(7)
	assert_eq(base_a.derive(3).randi_range(0, 9999), base_b.derive(3).randi_range(0, 9999),
		"derive(salt) skal være deterministisk fra frøet")


func test_creature_data_defaults() -> void:
	var cd: CreatureData = CreatureData.new()
	assert_eq(cd.tier, 1)
	assert_true(cd.max_hp > 0)
	assert_eq(cd.retaliations, 1)


func test_content_registry_loaded_sample_creature() -> void:
	var cd: CreatureData = ContentRegistry.get_creature(&"asketrell")
	assert_not_null(cd, "Sample-kreatur 'asketrell' skal være lastet fra .tres")
	if cd != null:
		assert_eq(cd.tier, 1)
		assert_eq(cd.display_name, "Asketrell-milits")


func test_content_registry_loaded_sample_metal() -> void:
	var md: MetalData = ContentRegistry.get_metal(&"staal")
	assert_not_null(md, "Sample-metall 'staal' skal være lastet fra .tres")
	if md != null:
		assert_eq(md.display_name, "Stål")
		assert_eq(md.effect, MetalData.Effect.DIRECT_DAMAGE)


func test_content_registry_validation_passed() -> void:
	# Alle lastede kreaturer skal ha gyldige basisfelt (validert ved oppstart).
	for c: CreatureData in ContentRegistry.all_creatures():
		assert_true(c.id != &"", "kreatur uten id")
		assert_true(c.max_hp > 0, "kreatur %s har max_hp <= 0" % c.id)
		assert_true(c.dmg_min <= c.dmg_max, "kreatur %s har dmg_min > dmg_max" % c.id)
