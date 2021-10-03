import json
from clingo import Function
import clingo
import copy
from os import path
import re
import os 
import functools

from clingo.solving import Model


message = lambda: "Invalid input format.\n"

class SyntaxError(Exception):
    """Raised when the input is other than add/remove"""
    pass


class UnsatisfiabilityError(Exception):
    """Raised when the revision is unsatisfiable"""
    pass

             
def display(model):
    
    # c = model.cost
    # print((f'\n#################################################\n'
    #        f'#      Optimal model of cost {c}         \n'
    #        f'#################################################\n'
    # )) 

    orderer = lambda atom: atom.arguments[2]
    atoms = list(model.symbols(shown=True))
    atoms.sort(key = orderer) 

    for atom in atoms: 
        if (atom.match("expedite", 4)):
            action, agent, time, desc = atom.arguments
            fstring = f'Agent {agent}, expedite action {action} at time {time}\n Action description: {desc}\n'
            print(fstring)
        elif (atom.match("participate", 4)):
            action, agent, time, desc = atom.arguments
            fstring = f'Agent {agent}, help expedite {action} at time {time}\n Action description: {desc}\n'
            print(fstring)

def select_best_model(models):
    """Get the model that is optimal wrt. the ASP constraints."""
    ordmod = sorted(models, key = lambda m: m.cost[0])
    return ordmod[0]
    
def parse_term(term):
    """Parse user input."""
    term = clingo.parse_term(term)
    return (term.name, term.arguments)

def to_asp_predicate(term):
    """Validate and translate input to an ASP expression"""
    ops =  ["delegate",
            "schedule",
            "shuffle",
            "relieve",
            "relieve_f"
    ]

    if term == "shuffle":
        return term+"."
    else:
        try:
            pred, args = parse_term(term)
            if (str(pred) not in ops):
                raise SyntaxError()
            elif len(args) == 2:
                action, agent = args
                return f'{pred}({action}, {agent}).'
            elif len(args) == 3:
                action, agent, time = args
                return f'{pred}({action}, {agent}, {time}).'
            else: raise SyntaxError()
        except ValueError:
            raise SyntaxError()
    
def revise(trace, requested_changes):
    """Generates a new model that is as similar to the buffer_as_preceeding_modeled one as the
    requested revisions allow."""
    revision = functools.reduce(lambda a, b: a+b, trace + requested_changes )
    #print("In revise, revision: " + str(revision))
    print("REVISION: ", revision)
    prg = _initialise_base(revision)

    with prg.solve(yield_ = True) as results:
        m = results.model()
        if (m == []):
            raise UnsatisfiabilityError()
        #else:
            #best = select_best_model(models)
           
        #print("In revise, best: " + str(buffer_as_preceeding_model(best)))
        #display(m)
        print(str(m))
        return (str(m), buffer_as_past(parse_model(m)))

def revise_model(trace, requested_changes):
    return revise(trace, requested_changes)[0]


#TODO: parsing needs to handle two scenarios: one for storing bufffer with punctuation, and one for without
def parse_model(model, punctuation=False): 
    parsed_model = re.split(r"\)", str(model))
    parsed_model.remove("")
    res_list = []
    for el in parsed_model:
        res = el.strip()
        if res[-1] != ")":
            res += ")"
        if punctuation:
            res += "."
        res_list.append(res)
    return res_list

def interact():
    """Runs the session with the user."""
    rev = ""
    i = 0
    trace = generate_initial()
    while rev != "Q":
        i+=1
        term = input(f'Iteration {i} >> ')
        #print("In interact, term: " + str(term) )
        if term == 'Q': break
        elif term=='':
            print("No revision, no display.")
            continue
        else:
            try:
                trace = revise(trace,  [to_asp_predicate(term)])[1]

            except SyntaxError:
                print(message())
                continue
            except UnsatisfiabilityError as e: 
                msg = f'The assignment {term} is not satisfiable'
                print(msg)
                continue

def _initialise_base(programstring):
    """Initialises the main action file, which in turn loads the 'trace.lp' file."""
    prg = clingo.Control()
    prg.load("control.lp")
    prg.add("base", [], programstring)
    prg.ground([("base", [])])
    return prg

def buffer_as_past(model):
    """Removes all history, and buffers a new model. 
    Thus, the program remembers only the last model."""
    trace = []
    for atom in model:
         if "expedite" in atom:
             trace.append(atom.replace("expedite", "previous"))
    return trace

def generate_initial():
    """Generate a first model, before receiving any input from the user."""
    prg = _initialise_base("")
    with prg.solve(yield_ = True) as results:
        models = [m for m in results]
        best = select_best_model(models)
        parsed = parse_model(best, punctuation=True) 
        trace = buffer_as_past(parsed)
        display(best)
    #print("In generate_initial: " + str(trace))
    return trace

         
def run():
    """Pretty self-explanatory this."""
    try:

        interact()
    finally:
        pass
        

if __name__=='__main__':
    run()



