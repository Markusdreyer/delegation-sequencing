#include "delegation.lp".
#include "sequencing.lp".


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                 Revision operators
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Remove a responsibility from an agent keeping nothing fixed
% (that is action-allocations and time may vary)
:- relieve(Ac, Ag), expedite(Ac, Ag, T), step(T).

%:-  relieve(Ac, Ag), expedite(Ac, Ag, T), step(T).
:- relieve(B, A), not agent(A). 

% Schedule a particular action at a particular time.
expedite(Ac, Ag, T):- schedule(Ac, Ag, T).

% Respect the constraints on competence when scheduling
% tasks for agents
:- schedule(Ac, Ag, T), delegate(Ac, _, Crew),  not competent(Ag, Ac).
competent(Ag, Ac):- delegate(Ac, _, Crew), member(Ag, Crew).

% Allocate an action to an agent. Dont care about time.
1{expedite(Ac, Ag, X): step(X)}1:-  delegate(Ac, Ag).

% Shuffle allocations. Keep task structure intact
T1 = T2 :- expedite(Ac, Ag1, T1), previous(Ac, Ag2, T2), shuffle.
shuffled :- delegate(Ac, N, Crew),
	    M = #count{Ag: member(Ag, Crew)},
	    N < M, 
	    expedite(Ac, Ag1, T),
	    not previous(Ac, Ag1, T).

:- shuffle, not shuffled.




% Backpropagate
responsible(Ac, Ag) :- expedite(Ac, Ag, T).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                 The maxim of minimal change
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

:~ expedite(Ac, Ag, T), not previous(Ac, Ag, T), not shuffle. [1@1]
:~ previous(Ac, Ag, T), not expedite(Ac, Ag), not shuffle. [1@1] 


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                 Suppress warnings
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

shuffle:- #false.
previous(-1, -1, -1):- #false.
delegate(-1, -1):- #false.
relieve(-1, -1):- #false.
expedite(-1, -1):- #false.
schedule(-1, -1, -1):- #false.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                 Testing
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%previous(a, liz, 1).
%previous(a, jan, 1).
%shuffle.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                  Output/Queries
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

#show .
#show expedite/3.
#show expedite(Ac, Ag, T, D): expedite(Ac, Ag, T), primitive(Ac), description(Ac, D).
#show participate(Ac, Ag, T, D): expedite(Ac, Ag, T), collaborative(Ac),  description(Ac, D).
					 
					      
