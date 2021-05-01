%%%%%%%%%%%%%%%%% Agent taxonomy  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Subclass reasoning
subclass(A, B):- is_subclass(A, B).
subclass(A, C):- is_subclass(A, D), subclass(D, C).

member(A, C):- is_a(A, C).
member(A, C):- is_a(A, D), subclass(D, C).

% Taxonomy of companies
class(agent).
is_subclass(ae_crew, agent).
is_subclass(driver, ae_crew).
is_subclass(se_crew, agent).
is_subclass(lt_crew, agent).

% Property ascription
property(barry, driver).

% Member agents
is_a(john, ae_crew).
is_a(barry, ae_crew).
is_a(frank, ae_crew).

is_a(jan, se_crew).
is_a(liz, se_crew).
is_a(kathrin, se_crew).

is_a(barry, driver).

is_a(xi, lt_crew).
is_a(lin, lt_crew).
is_a(dahn, lt_crew).

agent(X):- member(X, agent).

objective(Ac):- collaborative(Ac).
objective(Ac):- primitive(Ac).
objective(Ac):- abstract(Ac).

%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% %               Ordering constraints
%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%pred(b, a).
%pred(c, a).
%pred(d, b).
%pred(e, b).
%pred(f, b).
%pred(g, e).
%pred(g, f).
%pred(h, c).
%pred(i, c).
%pred(j, h).
%pred(j, i).
%pred(k, j).
%pred(k, g).
%pred(l, d).
%pred(m, e).
%pred(m, f).
%pred(n, e).
%pred(n, f).
%pred(n, l).

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


%% :- expedite(Ac, Ag, T), T>1, not expedite(Ac1, Ag1, T-1), objective(Ac1), agent(Ag1).
:- someone_does(Ac, T), T>1, not preceded(Ac). % Actions form a cohesive time-sequence
:- someone_does(Ac1, T1), someone_does(Ac2, T2), not  T1 < T2, pred(Ac2, Ac1). % Respect the ordering constraints on actions
first :- something_done(1). % Sequence starts at timestep 1.
:- not first.                  % Sequence starts at timestep 1.

%% % Other requirements
:- concurrent(Ac1, Ac2).  % An agent can only participate in one action at a time
T1 = T2 :- expedited_at(Ac, T1, n), expedited_at(Ac, T2, n). % An action only occurs once. % implicit in time compression


%% %:- remove(Ac, Ag, T), expedite(Ac, Ag, T).
%% %expedite(Ac, Ag, T):- add(Ac, Ag, T).

%% %% expedite(Ac, Ag, T2):- reschedule(Ac, Ag, T), step(T2).
%% %% :- expedite(Ac, Ag, T),  reschedule(Ac, Ag, T).
%% %% expedite(Ac, Ag, T):- schedule(Ac, Ag, T).


%% %expedite(e, john, 4).



%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% %                 Optimization
%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% % Optimization. Compress time.
#minimize{T: expedite(Ac, Ag, T)}.

%:~ expedite(Ac, Ag, T), not previous(Ac, Ag, T). [1@1] % The maxim of minimal change
%:~ previous(Ac, Ag, T), not expedite(Ac, Ag). [1@1] % The maxim of minimal change

%% :~ expedite(Ac, Ag, T), not previous(Ac, Ag, T), rescheduling. [1@1] % The maxim of minimal change
%% :~ previous(Ac, Ag, T), not expedite(Ac, Ag), rescheduling. [1@1] % The maxim of minimal change


%% :~ expedite(Ac, Ag, T), not previous(Ac, Ag, T), delegating. [1@1] % The maxim of minimal change
%% :~ previous(Ac, Ag, T), not expedite(Ac, Ag), redelegating. [1@1] % The maxim of minimal change

%% :~ expedite(Ac, Ag, T), not previous(Ac, Ag, T), delegating. [1@1] % The maxim of minimal change
%% :~ previous(Ac, Ag, T), not expedite(Ac, Ag), redelegating. [1@1] % The maxim of minimal change

							    
					      

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                 Python controller
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                Output/Testing
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%




#show .
%#show previous/3.
%#show reschedule/3.
%#show schedule/3.
%#show responsible/2.
%#show step/1.
#show expedite/3.
%#show expedite(Ac, Ag, T, D): expedite(Ac, Ag, T), primitive(Ac), description(Ac, D).
%#show participate(Ac, Ag, T, D): expedite(Ac, Ag, T), collaborative(Ac),  description(Ac, D).
