## Hjelpeklasse — eneste formål er å verifisere at GUT-dobling/stubbing virker
## (se tests/test_doubling_probe.gd). Ikke en testfil; har ingen test_-metoder.
extends RefCounted


func compute() -> int:
	return 1
