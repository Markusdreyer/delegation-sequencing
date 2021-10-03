#include "actions.lp".

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%      Generate responsibilities/delegate actions
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


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%              Suppress warnings
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

sub(-1,-1):- #false.
subtask(-1,-1):- #false.
