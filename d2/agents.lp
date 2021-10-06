%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%              Agent taxonomy                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Taxonomy of companies
class(agent).
is_subclass(se_crew, agent).
is_subclass(lt_crew, agent).
is_subclass(ae_crew, agent).
is_subclass(driver, ae_crew).

% Subclass reasoning
subclass(A, B):- is_subclass(A, B).
subclass(A, C):- is_subclass(A, D), subclass(D, C).

% Membership ascriptions
member(A, C):- is_a(A, C).
member(A, C):- is_a(A, D), subclass(D, C).

% Property ascription
property(barry, driver).

% Companies


is_a(barry, driver).
is_a(john, ae_crew).
is_a(frank, ae_crew).

is_a(jan, se_crew).
is_a(liz, se_crew).
is_a(kathrin, se_crew).

is_a(xi, lt_crew).
is_a(lin, lt_crew).
is_a(dahn, lt_crew).

% Def. agent
agent(X):- member(X, agent).
