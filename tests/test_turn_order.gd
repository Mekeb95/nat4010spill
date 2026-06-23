## Tester turrekkefølgen: fart synkende, uavgjort → spiller først, så uid.
extends GutTest

const F = preload("res://tests/_helpers/combat_factory.gd")


func test_speed_then_player_then_uid() -> void:
	var s1 := F.stack(F.creature(0, 0, 1, 10, 5), 1, StackState.Side.PLAYER)
	var s2 := F.stack(F.creature(0, 0, 1, 10, 7), 1, StackState.Side.ENEMY)
	var s3 := F.stack(F.creature(0, 0, 1, 10, 5), 1, StackState.Side.ENEMY)
	var s4 := F.stack(F.creature(0, 0, 1, 10, 5), 1, StackState.Side.PLAYER)
	s1.uid = 0
	s2.uid = 1
	s3.uid = 2
	s4.uid = 3
	var arr: Array[StackState] = [s1, s2, s3, s4]
	var order := TurnOrder.initial_order(arr)
	assert_eq(order[0], s2, "raskest (fart 7)")
	assert_eq(order[1], s1, "fart 5, spiller, uid 0")
	assert_eq(order[2], s4, "fart 5, spiller, uid 3")
	assert_eq(order[3], s3, "fart 5, fiende")


func test_dead_stacks_excluded() -> void:
	var a := F.stack(F.creature(0, 0, 1, 10, 5), 1)
	var b := F.stack(F.creature(0, 0, 1, 10, 5), 0)   # count 0 = død
	var arr: Array[StackState] = [a, b]
	var order := TurnOrder.initial_order(arr)
	assert_eq(order.size(), 1)
	assert_eq(order[0], a)
