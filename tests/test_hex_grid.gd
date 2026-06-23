## Tester hex-geometrien (odd-r, pointy-top, cube-avstand).
extends GutTest


func test_offset_cube_roundtrip() -> void:
	for c: int in range(6):
		for r: int in range(7):
			var o := Vector2i(c, r)
			assert_eq(HexGrid.cube_to_offset(HexGrid.offset_to_cube(o)), o)


func test_known_distances() -> void:
	assert_eq(HexGrid.distance(Vector2i(0, 0), Vector2i(0, 0)), 0)
	assert_eq(HexGrid.distance(Vector2i(0, 0), Vector2i(1, 0)), 1)
	assert_eq(HexGrid.distance(Vector2i(0, 0), Vector2i(2, 0)), 2)
	assert_eq(HexGrid.distance(Vector2i(0, 0), Vector2i(0, 1)), 1)
	assert_eq(HexGrid.distance(Vector2i(0, 0), Vector2i(1, 1)), 2)


func test_distance_symmetric() -> void:
	assert_eq(
		HexGrid.distance(Vector2i(1, 2), Vector2i(4, 5)),
		HexGrid.distance(Vector2i(4, 5), Vector2i(1, 2)))


func test_neighbors_are_distance_one_and_in_bounds() -> void:
	var g := HexGrid.new(6, 7)
	for n: Vector2i in g.neighbors(Vector2i(3, 3)):
		assert_eq(HexGrid.distance(Vector2i(3, 3), n), 1)
		assert_true(g.in_bounds(n))


func test_interior_has_six_neighbors_corner_fewer() -> void:
	var g := HexGrid.new(6, 7)
	assert_eq(g.neighbors(Vector2i(3, 3)).size(), 6)
	assert_lt(g.neighbors(Vector2i(0, 0)).size(), 6)
