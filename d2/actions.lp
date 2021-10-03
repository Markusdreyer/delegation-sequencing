%#include "trace.lp".
#include "agents.lp".


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                Action declarations 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


primitive(a) . 
delegate(a, 1, "ae_crew") :- deploy(a) .
description(a, "Attack engine crew turn-out") .
mandatory(a) .

primitive(b) . 
delegate(b, 1, "se_crew") :- deploy(b) .
description(b, "Second attack engine crew turn-out") .
mandatory(b) .

primitive(c) . 
delegate(c, 1, "lt_crew") :- deploy(c) .
description(c, "Ladder department turn-out") .
mandatory(c) .

primitive(d) . 
delegate(d, 1, "ae_crew") :- deploy(d) .
description(d, "Travel of attack engine crew to 911 address") .
mandatory(d) .

primitive(e) . 
delegate(e, 1, "se_crew") :- deploy(e) .
description(e, "Travel of second engine crew to 911 address") .
mandatory(e) .

primitive(f) . 
responsible(f, Ag) :- deploy(f), property(Ag, "driver") .
description(f, "Travel of ladder tower crew to 911 address") .
mandatory(f) .

primitive(g) . 
delegate(g, 1, "ae_crew") :- deploy(g) .
description(g, "Attack engine crew advance 1.75 inch hose to seat of fire") .
mandatory(g) .

primitive(h) . 
delegate(h, 1, "ae_crew") :- deploy(h) .
description(h, "Attack engine driver prepare to pump water") .
mandatory(h) .

primitive(i) . 
delegate(i, 1, "ae_crew") :- deploy(i) .
description(i, "Attack fire with tank water aboard attack engine") .
mandatory(i) .

primitive(j) . 
delegate(j, 1, "se_crew") :- deploy(j) .
description(j, "Second engine crew member prepare nearest hydrant for hook-up") .
mandatory(j) .

primitive(k) . 
delegate(k, 1, "se_crew") :- deploy(k) .
description(k, "Second engine drop 5 inch hose between attack engine and nearest hydrant") .
mandatory(k) .

primitive(l) . 
delegate(l, 1, "se_crew") :- deploy(l) .
description(l, "Second engine hook to hydrant and attack engine and prepare to pump water") .
mandatory(l) .

primitive(m) . 
delegate(m, 1, "se_crew") :- deploy(m) .
description(m, "Attack fire with hydrant water") .
mandatory(m) .

primitive(n) . 
delegate(n, 1, "lt_crew") :- deploy(n) .
description(n, "Set up ladder tower") .
mandatory(n) .


objective(Ac):- collaborative(Ac).
objective(Ac):- primitive(Ac).
objective(Ac):- abstract(Ac).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%               Ordering constraints
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%             Supress warnings
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
abstract(-1):- #false.
primitive(-1):- #false.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%             Membership ascriptions
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
is_subclass("ae_crew", "agent").
is_subclass("driver", "ae_crew").
property("barry", "driver").
is_a("barry", "driver").
is_a("john", "ae_crew").
is_a("frank", "ae_crew").
is_subclass("se_crew", "agent").
is_a("jan", "se_crew").
is_a("liz", "se_crew").
is_a("kathrin", "se_crew").
is_subclass("lt_crew", "agent").
is_a("xi", "lt_crew").
is_a("lin", "lt_crew").
is_a("dahn", "lt_crew").
