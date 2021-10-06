primitive(a) . 
delegate(a, 1, firstAttackEngineCrew) :- deploy(a), member(Ag, firstAttackEngineCrew).
description(a, "1st attack engine crew turn-out") .
mandatory(a) .

primitive(b) . 
delegate(b, 1, secondAttackEngineCrew) :- deploy(b), member(Ag, secondAttackEngineCrew).
description(b, "2nd attack engine crew turn-out") .
mandatory(b) .

primitive(c) . 
delegate(c, 1, patrolVehicle) :- deploy(c), member(Ag, patrolVehicle).
description(c, "Patrol vehicle turn-out") .
mandatory(c) .

primitive(d) . 
delegate(d, 1, firstAmbulance) :- deploy(d), member(Ag, firstAmbulance).
description(d, "1st Ambulance turn-out") .
mandatory(d) .

primitive(e) . 
delegate(e, 1, secondAmbulance) :- deploy(e), member(Ag, secondAmbulance).
description(e, "2nd Ambulance turn-out") .
mandatory(e) .

primitive(f) . 
delegate(f, 1, firstAttackEngineCrew) :- deploy(f), member(Ag, firstAttackEngineCrew).
description(f, "First arriving fire department scene size up and establish command ") .
mandatory(f) .

pred(f, a) .


is_subclass(firstAttackEngineCrew, agent).
is_subclass(fireOfficer, firstAttackEngineCrew).
property(ingolf, fireOfficer).
is_a(ingolf, fireOfficer).
is_subclass(firetruckDriver, firstAttackEngineCrew).
property(lukas, firetruckDriver).
is_a(lukas, firetruckDriver).
is_subclass(firefighter, firstAttackEngineCrew).
property(tormod, firefighter).
is_a(tormod, firefighter).
is_subclass(firefighter, firstAttackEngineCrew).
property(theodor, firefighter).
is_a(theodor, firefighter).
is_subclass(firefighter, firstAttackEngineCrew).
property(mikael, firefighter).
is_a(mikael, firefighter).
is_subclass(secondAttackEngineCrew, agent).
is_subclass(fireOfficer, secondAttackEngineCrew).
property(morten, fireOfficer).
is_a(morten, fireOfficer).
is_subclass(firetruckDriver, secondAttackEngineCrew).
property(peter, firetruckDriver).
is_a(peter, firetruckDriver).
is_subclass(firefighter, secondAttackEngineCrew).
property(jrgen, firefighter).
is_a(jrgen, firefighter).
is_subclass(firefighter, secondAttackEngineCrew).
property(roar, firefighter).
is_a(roar, firefighter).
is_subclass(firefighter, secondAttackEngineCrew).
property(halvard, firefighter).
is_a(halvard, firefighter).
is_subclass(patrolVehicle, agent).
is_subclass(patrolVehicleDriver, patrolVehicle).
property(herman, patrolVehicleDriver).
is_a(herman, patrolVehicleDriver).
is_subclass(policeOfficer, patrolVehicle).
property(yngve, policeOfficer).
is_a(yngve, policeOfficer).
is_subclass(firstAmbulance, agent).
is_subclass(ambulanceDriver, firstAmbulance).
property(rikard, ambulanceDriver).
is_a(rikard, ambulanceDriver).
is_subclass(ambulanceAssistant, firstAmbulance).
property(sven, ambulanceAssistant).
is_a(sven, ambulanceAssistant).
is_subclass(secondAmbulance, agent).
is_subclass(ambulanceAssistant, secondAmbulance).
property(miriam, ambulanceAssistant).
is_a(miriam, ambulanceAssistant).
is_subclass(ambulanceDriver, secondAmbulance).
property(kari, ambulanceDriver).
is_a(kari, ambulanceDriver).


