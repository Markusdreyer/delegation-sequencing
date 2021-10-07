%%%%%%%%%%%%%%%%% Agent taxonomy  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Subclass reasoning
subclass(A, B):- is_subclass(A, B).
subclass(A, C):- is_subclass(A, D), subclass(D, C).

member(A, C):- is_a(A, C).
member(A, C):- is_a(A, D), subclass(D, C).

% Taxonomy of companies
class(agent).

agent(X):- member(X, agent).

objective(Ac):- collaborative(Ac).
objective(Ac):- primitive(Ac).
objective(Ac):- abstract(Ac).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                     Generate responsibilities
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

N{responsible(Ac, Ag): member(Ag, Group)}N :-  delegate(Ac, N, Group).
{deploy(X): objective(X)}.

:- not {deploy(Ac): abstract(Ac1), subtask(Ac1, Ac)}1. 

% All mandatory tasks are deployd
:- mandatory(X), not deploy(X).

% Dont deploy non-selected subtasks
:- not mandatory(Ac), deploy(Ac).

% Inherit mandatoriness to substasks

mandatory(Ac2):- sub(Ac1, Ac2), deploy(Ac2), mandatory(Ac1).

#minimize{1: responsible(Ac, Ag, N)}.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                 Projections
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
delegated(Ac):-  delegate(Ac, _, _).
expedited_by(Ac, Ag):- expedite(Ac, Ag, T).
expedited_at(Ac, T):- expedite(Ac, _, T).
concurrent(Ac1, Ac2):- expedite(Ac1, Ag1, T), expedite(Ac2, Ag1, T),  Ac1 != Ac2.
something_done(T):- expedite(_,_,T).
someone_does(Ac, T):- expedite(Ac, _, T).
preceded(Ac1):- expedited_at(Ac1, T), expedited_at(Ac2, T-1), step(T).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                 Temporalize
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

step(1..Y+1):- Y = #count{Ac: responsible(Ac, Ag)}.
1{expedite(Ac, Ag, T): step(T)}1 :- responsible(Ac, Ag).

:- someone_does(Ac, T), T>1, not preceded(Ac). % Actions form a cohesive time-sequence
:- someone_does(Ac1, T1), someone_does(Ac2, T2), not  T1 < T2, pred(Ac2, Ac1). % Respect the ordering constraints on actions
first :- something_done(1). % Sequence starts at timestep 1.
:- not first.                  % Sequence starts at timestep 1.

%% % Other requirements
:- concurrent(Ac1, Ac2).  % An agent can only participate in one action at a time
T1 = T2 :- expedited_at(Ac, T1, q), expedited_at(Ac, T2, q). % An action only occurs once. % implicit in time compression


#minimize{T: expedite(Ac, Ag, T)}.				      

#show .

#show expedite/3.

