primitive("a") . 
description("a", "Attack engine crew turn-out") .
delegate("a", 1, "ae_crew") :- deploy("a") . 
mandatory("a") .

primitive("b") . 
description("b", "Second attack engine crew turn-out") .
delegate("b", 1, "se_crew") :- deploy("b") . 
mandatory("b") .

primitive("c") . 
description("c", "Ladder department turn-out") .
delegate("c", 2, "lt_crew") :- deploy("c") . 
mandatory("c") .

primitive("d") . 
description("d", "Travel of attack engine crew to 911 address") .
delegate("d", 2, "ae_crew") :- deploy("d") . 
mandatory("d") .

primitive("e") . 
description("e", "Travel of second engine crew to 911 address") .
delegate("e", 2, "se_crew") :- deploy("e") . 
mandatory("e") .

primitive("f") . 
description("f", "Travel of ladder tower crew to 911 address") .
responsible("f", Ag) :- deploy("f"), property(Ag, "driver"). 
mandatory("f") .

primitive("g") . 
description("g", "Attack engine crew advance 1.75 inch hose to seat of fire") .
delegate("g", 2, "ae_crew") :- deploy("g") . 
mandatory("g") .

primitive("h") . 
description("h", "Attack engine driver prepare to pump water") .
delegate("h", 2, "ae_crew") :- deploy("h") . 
mandatory("h") .

primitive("i") . 
description("i", "Attack fire with tank water aboard attack engine") .
delegate("i", 2, "ae_crew") :- deploy("i") . 
mandatory("i") .

primitive("j") . 
description("j", "Second engine crew member prepare nearest hydrant for hook-up") .
delegate("j", 2, "se_crew") :- deploy("j") . 
mandatory("j") .

primitive("k") . 
description("k", "Second engine drop 5 inch hose between attack engine and nearest hydrant") .
delegate("k", 2, "se_crew") :- deploy("k") . 
mandatory("k") .

primitive("l") . 
description("l", "Second engine hook to hydrant and attack engine and prepare to pump water") .
delegate("l", 2, "se_crew") :- deploy("l") . 
mandatory("l") .

primitive("m") . 
description("m", "Attack fire with hydrant water") .
delegate("m", 2, "se_crew") :- deploy("m") . 
mandatory("m") .

primitive("n") . 
description("n", "Set up ladder tower") .
delegate("n", 2, "lt_crew") :- deploy("n") . 
mandatory("n") .

pred(d, a) .
pred(e, b) .
pred(f, c) .
pred(g, d) .
pred(h, g) .
pred(i, h) .
pred(j, e) .
pred(k, e) .
pred(l, k) .
pred(m, l) .
pred(n, f) .


is_subclass("1st Attack Engine Crew", "agent").
is_subclass("Fire Officer", "1st Attack Engine Crew").
property("Ingolf", "Fire Officer").
is_a("Ingolf", "Fire Officer").
is_subclass("Firetruck Driver", "1st Attack Engine Crew").
property("Lukas", "Firetruck Driver").
is_a("Lukas", "Firetruck Driver").
is_subclass("Firefighter", "1st Attack Engine Crew").
property("Tormod", "Firefighter").
is_a("Tormod", "Firefighter").
is_subclass("Firefighter", "1st Attack Engine Crew").
property("Theodor", "Firefighter").
is_a("Theodor", "Firefighter").
is_subclass("Firefighter", "1st Attack Engine Crew").
property("Mikael", "Firefighter").
is_a("Mikael", "Firefighter").
is_subclass("2nd Attack Engine Crew", "agent").
is_subclass("Fire Officer", "2nd Attack Engine Crew").
property("Morten", "Fire Officer").
is_a("Morten", "Fire Officer").
is_subclass("Firetruck Driver", "2nd Attack Engine Crew").
property("Peter", "Firetruck Driver").
is_a("Peter", "Firetruck Driver").
is_subclass("Firefighter", "2nd Attack Engine Crew").
property("Jørgen", "Firefighter").
is_a("Jørgen", "Firefighter").
is_subclass("Firefighter", "2nd Attack Engine Crew").
property("Roar", "Firefighter").
is_a("Roar", "Firefighter").
is_subclass("Firefighter", "2nd Attack Engine Crew").
property("Halvard", "Firefighter").
is_a("Halvard", "Firefighter").
is_subclass("Patrol Vehicle", "agent").
is_subclass("Patrol Vehicle Driver", "Patrol Vehicle").
property("Herman", "Patrol Vehicle Driver").
is_a("Herman", "Patrol Vehicle Driver").
is_subclass("Police Officer", "Patrol Vehicle").
property("Yngve", "Police Officer").
is_a("Yngve", "Police Officer").
is_subclass("1st Ambulance", "agent").
is_subclass("Ambulance Driver", "1st Ambulance").
property("Rikard", "Ambulance Driver").
is_a("Rikard", "Ambulance Driver").
is_subclass("Ambulance Assistant", "1st Ambulance").
property("Sven", "Ambulance Assistant").
is_a("Sven", "Ambulance Assistant").
is_subclass("2nd Ambulance", "agent").
is_subclass("Ambulance Assistant", "2nd Ambulance").
property("Miriam", "Ambulance Assistant").
is_a("Miriam", "Ambulance Assistant").
is_subclass("Ambulance Driver", "2nd Ambulance").
property("Kari", "Ambulance Driver").
is_a("Kari", "Ambulance Driver").


