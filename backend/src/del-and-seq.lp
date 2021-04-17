%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                     Program base
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#program base.

%%%%%%%%%%%%%%%%% Agent taxonomy  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Taxonomy of companies
class(agent).
is_subclass(ae_crew, agent).
is_subclass(se_crew, agent).
is_subclass(lt_crew, agent).

% Subclass reasoning
subclass(A, B):- is_subclass(A, B).
subclass(A, C):- is_subclass(A, D), subclass(D, C).

member(A, C):- is_a(A, C).
member(A, C):- is_a(A, D), subclass(D, C).

% Property ascription
property(barry, driver).

% Member agents
is_a(john, ae_crew).
is_a(barry, ae_crew).
is_a(frank, ae_crew).

is_a(jan, se_crew).
is_a(liz, se_crew).
is_a(kathrin, se_crew).

is_a(xi, lt_crew).
is_a(lin, lt_crew).
is_a(dahn, lt_crew).

agent(X):- member(X, agent).

%%%%%%%%%%%%%%%%% Action declarations  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

collaborative(a).
description(a, "Department turn-out").
mandatory(a).

collaborative(b).
description(b, "Travel of attack engine to 911 address").
mandatory(b).

collaborative(c).
description(c, "Travel of second engine to 911 address").
mandatory(c).

collaborative(d).
description(d, "Travel of ladder tower to 911 address").
mandatory(d).
 
collaborative(e).
description(e, "Attack engine crew advance 1.75 inch hose to seat of fire").
mandatory(e).

primitive(f).
description(f, "Attack engine driver prepare to pump water").
mandatory(f).

collaborative(g).
description(g, "Attack fire with tank water aboard attack engine").
mandatory(g).

collaborative(h).
description(h, "Second engine crew member prepare nearest hydrant for hook-up").
mandatory(h).

collaborative(i).
description(i, "Second engine drop 5 inch hose between attack engine and nearest hydrant").
mandatory(i).

collaborative(j).
description(j, "Second engine hook to hydrant and to attack engine and prepare to pump water").
mandatory(j).

collaborative(k).
description(k, "Attack fire with hydrant water").
mandatory(k).
  
collaborative(l).
description(l, "Set up ladder tower").
mandatory(l).

% Abstract task 
abstract(vent).
sub(vent, vent_shaft).
sub(vent, rem_win).
mandatory(vent).

primitive(vent_shaft).
description(vent_shaft, "cut vent shaft").

collaborative(rem_win).
description(rem_win, "remove windows").

objective(Ac):- collaborative(Ac).
objective(Ac):- primitive(Ac).
objective(Ac):- abstract(Ac).

%%%%%%%%%%%%%%%% Ordering constraints  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

pred(b, a).
pred(c, a).
pred(d, b).
pred(e, b).
pred(f, b).
pred(g, e).
pred(g, f).
pred(h, c).
pred(i, c).
pred(j, h).
pred(j, i).
pred(k, j).
pred(k, g).
pred(l, d).
pred(m, e).
pred(m, f).
pred(n, e).
pred(n, f).
pred(n, l).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                     Program step
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

#program step(n).
#external c(n).
#external add(Ac, Ag, n): objective(Ac), agent(Ag).
#external remove(Ac, Ag, n): objective(Ac), agent(Ag).

%%%%%%%%%%%%%%%%%%%% Delegation stage  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Delegation rules
delegate(a, 3, se_crew, n) :- deploy(a, n).
delegate(a, 3, ae_crew, n) :- deploy(a, n).
delegate(b, 3, ae_crew, n):- deploy(b, n).
delegate(c, 3, se_crew, n):- deploy(c, n).
delegate(d, 3, lt_crew, n):- deploy(d, n).
delegate(e, 2, ae_crew, n):- deploy(e, n).
responsible(f, Ag, n) :- deploy(f, n), property(Ag, driver).
delegate(g, 2, ae_crew, n):- deploy(g, n).
delegate(h, 1, se_crew, n):- deploy(h, n). 
delegate(i, 2, se_crew, n):- deploy(i, n).
delegate(j, 2, se_crew, n):- deploy(j, n).
delegate(k, 2, se_crew, n) :- deploy(k, n).
delegate(l, 2,  agent, n) :- deploy(l, n).
1{deploy(rem_win, n); deploy(vent_shaft, n)}1:- deploy(vent, n).
delegate(vent_shaft, 1, lt_crew, n) :- deploy(vent_shaft, n).
delegate(rem_win, 2, ae_crew, n) :- deploy(rem_win, n).

% Add or remove external inputs
:- responsible(Ac, Ag, n),  remove(Ac, Ag, n), c(n).
responsible(Ac, Ag, n):- add(Ac, Ag, n).

% Delegating to N agents creates N individual responsibilities
N{responsible(Ac, Ag, n): member(Ag, Group)}N :-  delegate(Ac, N, Group, n).


#minimize{1: responsible(Ac, Ag, n)}.
% Choose objectives
{deploy(Ac, n): objective(Ac)}:- c(n).

% Delegation constraints
:- not {deploy(Ac, n): abstract(Ac1), subtask(Ac1, Ac)}1, c(n). % Deploy only one method of an abstract task.
:- mandatory(Ac),  not deploy(Ac, n), c(n). % All mandatory tasks are deployd
deploy(Ac, n):- mandatory(Ac), c(n).

% Optimization 


:~ responsible(Ac, Ag, n-1), not responsible(Ac, Ag, n), c(n). [1@1] % The maxim of minimal change
:~ responsible(Ac, Ag, n), not responsible(Ac, Ag, n-1), c(n). [1@1] % The maxim of minimal change

%%%%%%%%%%%%%%%%% Sequencing stage  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Projections. Speeds up grounding.							 
expedited_by(Ac, Ag, n):- expedite(Ac, Ag, T, n), c(n).
expedited_at(Ac, T, n):- expedite(Ac, _, T, n), c(n).
concurrent(Ac1, Ac2, n):- expedite(Ac1, Ag1, T,  n), expedite(Ac2, Ag1, T, n), c(n),  Ac1 != Ac2.
something_done(T, n):- expedite(_,_,T, n), c(n).
someone_does(Ac, T, n):- expedite(Ac, _, T, n), c(n).
preceded(Ac1, n):- expedited_at(Ac1, T, n), expedited_at(Ac2, T-1, n), step(T, n), c(n).

% Generate an action sequence
step(1..Y, n):- Y = #count{Ac, Ag: responsible(Ac, Ag, n)}, c(n). % Securing enough time steps
1{expedite(Ac, Ag, T, n): step(T, n)}1 :- responsible(Ac, Ag, n), c(n). % Every scheduled task is expedited exactly once

% An action sequence forms a gapless sequence starting at 1 respecting the ordering constraints
:- someone_does(Ac, T, n), T>1, not preceded(Ac, n). % Actions form a cohesive time-sequence
:- someone_does(Ac1, T1, n), someone_does(Ac2, T2, n), not  T1 < T2, pred(Ac2, Ac1). % Respect the ordering constraints on actions
first(n) :- something_done(1, n), c(n). % Sequence starts at timestep 1.
:- not first(n), c(n).                  % Sequence starts at timestep 1.

% Other requirements
:- concurrent(Ac1, Ac2, n), c(n).  % An agent can only participate in one action at a time
%T1= T2 :- expedited_at(Ac, T1, n), expedited_at(Ac, T2, n). % An action only occurs once. % implicit in time compression

% Optimization. Compress time.
#minimize{T: expedite(Ac, Ag, T, n)}.

%%%%%%%%%%%%%%%%%%%%%%% Output %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

#show .
#show expedite(Ac, Ag, T, D): expedite(Ac, Ag, T, n), primitive(Ac), c(n), description(Ac, D).
#show participate(Ac, Ag, T, D): expedite(Ac, Ag, T, n), c(n), collaborative(Ac),  description(Ac, D).
