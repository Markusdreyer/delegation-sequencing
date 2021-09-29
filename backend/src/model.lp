primitive(a) . 
responsible(a, Ag) :- deploy(a), property(Ag, "Firetruck Driver") .
description(a, "1st attack engine crew turn-out") .
mandatory(a) .

primitive(b) . 
responsible(b, Ag) :- deploy(b), property(Ag, "Firetruck Driver") .
description(b, "2nd attack engine crew turn-out") .
mandatory(b) .

primitive(c) . 
responsible(c, Ag) :- deploy(c), property(Ag, "Patrol Vehicle Driver") .
description(c, "Patrol vehicle turn-out") .
mandatory(c) .

primitive(d) . 
responsible(d, Ag) :- deploy(d), property(Ag, "Ambulance Driver") .
description(d, "1st Ambulance turn-out") .
mandatory(d) .

primitive(e) . 
responsible(e, Ag) :- deploy(e), property(Ag, "Ambulance Driver") .
description(e, "2nd Ambulance turn-out") .
mandatory(e) .

primitive(f) . 
delegate(f, 1, "1st Attack Engine Crew") :- deploy(f) .
description(f, "First arriving fire department scene size up and establish command ") .
mandatory(f) .

pred(f, a) .


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


