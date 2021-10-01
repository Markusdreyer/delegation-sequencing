primitive(a) . 
responsible(a, Ag) :- deploy(a), property(Ag, firetruckDriver), member(Ag, firstAttackEngineCrew) .
description(a, "1st attack engine crew turn-out") .
mandatory(a) .

primitive(b) . 
responsible(b, Ag) :- deploy(b), property(Ag, firetruckDriver), member(Ag, secondAttackEngineCrew) .
description(b, "2nd attack engine crew turn-out") .
mandatory(b) .

primitive(c) . 
responsible(c, Ag) :- deploy(c), property(Ag, patrolVehicleDriver), member(Ag, patrolVehicle) .
description(c, "Patrol vehicle turn-out") .
mandatory(c) .

primitive(d) . 
responsible(d, Ag) :- deploy(d), property(Ag, ambulanceDriver), member(Ag, firstAmbulance) .
description(d, "1st Ambulance turn-out") .
mandatory(d) .

primitive(e) . 
responsible(e, Ag) :- deploy(e), property(Ag, ambulanceDriver), member(Ag, secondAmbulance) .
description(e, "2nd Ambulance turn-out") .
mandatory(e) .

primitive(f) . 
responsible(f, Ag) :- deploy(f), property(Ag, fireOfficer), member(Ag, firstAttackEngineCrew) .
description(f, "First arriving fire department scene size up and establish command ") .
mandatory(f) .

primitive(g) . 
responsible(g, Ag) :- deploy(g), property(Ag, fireOfficer), member(Ag, firstAttackEngineCrew) .
description(g, "Isolate the area and establish Hot Zone") .
mandatory(g) .

collaborative(h) . 
delegate(h, 2, firstAmbulance) :- deploy(h),  member(Ag, firstAmbulance). 
delegate(h, 2, secondAmbulance) :- deploy(h),  member(Ag, secondAmbulance). 
description(h, "Evacuate wounded") .
mandatory(h) .

collaborative(i) . 
delegate(i, 2, firstAttackEngineCrew) :- deploy(i),  member(Ag, firstAttackEngineCrew). 
delegate(i, 2, secondAttackEngineCrew) :- deploy(i),  member(Ag, secondAttackEngineCrew). 
description(i, "Locate and establish permanent water supply") .
mandatory(i) .

collaborative(j) . 
delegate(j, 2, firstAttackEngineCrew) :- deploy(j),  member(Ag, firstAttackEngineCrew). 
delegate(j, 2, secondAttackEngineCrew) :- deploy(j),  member(Ag, secondAttackEngineCrew). 
description(j, "Charge water hoses and stand by") .
mandatory(j) .

collaborative(k) . 
delegate(k, 1, patrolVehicle) :- deploy(k),  member(Ag, patrolVehicle). 
delegate(k, 1, secondAttackEngineCrew) :- deploy(k),  member(Ag, secondAttackEngineCrew). 
delegate(k, 1, firstAttackEngineCrew) :- deploy(k),  member(Ag, firstAttackEngineCrew). 
description(k, "Remove possible ignition sources") .
mandatory(k) .

pred(f, a) .
pred(g, f) .
pred(h, f) .
pred(i, f) .
pred(j, i) .
pred(k, f) .


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


