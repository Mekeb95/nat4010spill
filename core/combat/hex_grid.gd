## HexGrid — kampbrettets geometri. REN logikk (RefCounted). Odd-r offset,
## pointy-top (docs/combat-spec.md). Avstand via cube-koordinater. Brukes kun i
## kampscenen; oververdenen er firkant-rutenett (§4).
class_name HexGrid
extends RefCounted

## De seks naboretningene i cube-rom, med klokka.
const CUBE_DIRS: Array[Vector3i] = [
	Vector3i(1, 0, -1), Vector3i(1, -1, 0), Vector3i(0, -1, 1),
	Vector3i(-1, 0, 1), Vector3i(-1, 1, 0), Vector3i(0, 1, -1),
]

var cols: int
var rows: int


func _init(c: int, r: int) -> void:
	cols = c
	rows = r


## odd-r offset (col, row) → cube. Pointy-top, oddetallsrader skjøvet høyre.
static func offset_to_cube(o: Vector2i) -> Vector3i:
	var x: int = o.x - (o.y - (o.y & 1)) / 2
	var z: int = o.y
	var y: int = -x - z
	return Vector3i(x, y, z)


static func cube_to_offset(c: Vector3i) -> Vector2i:
	var col: int = c.x + (c.z - (c.z & 1)) / 2
	var row: int = c.z
	return Vector2i(col, row)


## Hex-avstand (antall steg) mellom to offset-celler.
static func distance(a: Vector2i, b: Vector2i) -> int:
	var ac: Vector3i = offset_to_cube(a)
	var bc: Vector3i = offset_to_cube(b)
	return (absi(ac.x - bc.x) + absi(ac.y - bc.y) + absi(ac.z - bc.z)) / 2


func in_bounds(o: Vector2i) -> bool:
	return o.x >= 0 and o.x < cols and o.y >= 0 and o.y < rows


## Gyldige naboceller (innenfor brettet).
func neighbors(o: Vector2i) -> Array[Vector2i]:
	var cube: Vector3i = offset_to_cube(o)
	var out: Array[Vector2i] = []
	for d: Vector3i in CUBE_DIRS:
		var n: Vector2i = cube_to_offset(cube + d)
		if in_bounds(n):
			out.append(n)
	return out
