primitive(a) . 
description(a, "Attack engine crew turn-out") .
delegate(a, 1, ae_crew) :- deploy(a) . 
mandatory(a) .

primitive(b) . 
description(b, "Second attack engine crew turn-out") .
delegate(b, 1, se_crew) :- deploy(b) . 
mandatory(b) .

primitive(c) . 
description(c, "Ladder department turn-out") .
delegate(c, 1, lt_crew) :- deploy(c) . 
mandatory(c) .

primitive(d) . 
description(d, "Travel of attack engine crew to 911 address") .
delegate(d, 1, ae_crew) :- deploy(d) . 
mandatory(d) .

primitive(e) . 
description(e, "Travel of second engine crew to 911 address") .
delegate(e, 1, se_crew) :- deploy(e) . 
mandatory(e) .

primitive(f) . 
description(f, "Travel of ladder tower crew to 911 address") .
responsible(f, Ag) :- deploy(f), property(Ag, driver). 
mandatory(f) .

primitive(g) . 
description(g, "Attack engine crew advance 1.75 inch hose to seat of fire") .
delegate(g, 1, ae_crew) :- deploy(g) . 
mandatory(g) .

primitive(h) . 
description(h, "Attack engine driver prepare to pump water") .
delegate(h, 1, ae_crew) :- deploy(h) . 
mandatory(h) .

primitive(i) . 
description(i, "Attack fire with tank water aboard attack engine") .
delegate(i, 1, ae_crew) :- deploy(i) . 
mandatory(i) .

primitive(j) . 
description(j, "Second engine crew member prepare nearest hydrant for hook-up") .
delegate(j, 1, se_crew) :- deploy(j) . 
mandatory(j) .

primitive(k) . 
description(k, "Second engine drop 5 inch hose between attack engine and nearest hydrant") .
delegate(k, 1, se_crew) :- deploy(k) . 
mandatory(k) .

primitive(l) . 
description(l, "Second engine hook to hydrant and attack engine and prepare to pump water") .
delegate(l, 1, se_crew) :- deploy(l) . 
mandatory(l) .

primitive(m) . 
description(m, "Attack fire with hydrant water") .
delegate(m, 1, se_crew) :- deploy(m) . 
mandatory(m) .

primitive(n) . 
description(n, "Set up ladder tower") .
delegate(n, 1, lt_crew) :- deploy(n) . 
mandatory(n) .

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


is_subclass(ae_crew, agent).
is_subclass(driver, ae_crew).
property(barry, driver).
is_a(barry, driver).
is_a(john, ae_crew).
is_a(frank, ae_crew).
is_subclass(se_crew, agent).
is_a(jan, se_crew).
is_a(liz, se_crew).
is_a(kathrin, se_crew).
is_subclass(lt_crew, agent).
is_a(xi, lt_crew).
is_a(lin, lt_crew).
is_a(dahn, lt_crew).


