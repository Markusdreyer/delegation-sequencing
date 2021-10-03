%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%              Agent taxonomy                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Taxonomy of companies
class(agent).

% Subclass reasoning
subclass(A, B):- is_subclass(A, B).
subclass(A, C):- is_subclass(A, D), subclass(D, C).

% Membership ascriptions
member(A, C):- is_a(A, C).
member(A, C):- is_a(A, D), subclass(D, C).


% Def. agent
agent(X):- member(X, agent).

