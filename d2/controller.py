from clingo import Function
import clingo
import re
import functools

class SyntaxError(Exception):
    """Raised when the input is other than add/remove"""
    pass

class UnsatisfiabilityError(Exception):
    """Raised when the revision is unsatisfiable"""
    pass   
    
def revise(trace, requested_changes):
    """Generates a new model that is as similar to the buffer_as_preceeding_modeled one as the
    requested revisions allow."""
    revision = functools.reduce(lambda a, b: a+b, trace + requested_changes )
    prg = _initialise_base(revision)

    with prg.solve(yield_ = True) as results:
        m = results.model()
        return str(m)

def revise_model(trace, requested_changes):
    return revise(trace, requested_changes)

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

def _initialise_base(programstring):
    """Initialises the main action file, which in turn loads the 'trace.lp' file."""
    prg = clingo.Control()
    prg.load("control.lp")
    prg.add("base", [], programstring)
    prg.ground([("base", [])])
    return prg