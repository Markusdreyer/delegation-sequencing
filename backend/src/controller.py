import clingo
import sys

message = lambda: "Input format is: ad | remove (Action, Agent, Time)\nQ: quit"

def display(model):
    c = model.cost
    print((f'\n#################################################\n'
           f'#      Optimal model of cost {c}         \n'
           f'#################################################\n'
    )) 
    
    srt = sorted(model.symbols(terms=True), key=lambda atom: atom.arguments[2])
    res = ""
    for atom in srt:
        if (atom.match("expedite", 4)):
            action, agent, time, desc = atom.arguments
            fstring = f'Agent {agent}, expedite action {action} at time {time}\n Action description: {desc}\n'
            print(fstring)
            sys.stdout.flush()
        elif (atom.match("participate", 4)):
            action, agent, time, desc = atom.arguments
            fstring = f'Agent {agent}, help expedite {action} at time {time}\n Action description: {desc}\n'
            print(fstring)
            sys.stdout.flush()

            
def run():
    input_file = sys.argv[1]
    print(f"Loading {input_file}")
    sys.stdout.flush()
    prg = clingo.Control()
    prg.load(input_file)
    prg.ground([("base", [])])
    i = 0
    rev = ""
    prg.ground([("step", [i])])
    prg.assign_external(clingo.Function("c", [i]), True)
    
    with prg.solve(yield_ = True) as results:
        models = [m for m in results]
        ordmod = sorted(models, key = lambda m: m.cost[0])
        display(ordmod[0])

     
    while rev!="Q":
        i+=1
        rev = input(">> ")
        try:
            term = clingo.parse_term(rev)
        except RuntimeError:
            if rev!= "Q":
                print(message())
                continue
            else: break

        pred = term.name
        
        if (str(pred) not in ["add", "remove"]):
            print(message())
            continue
        
        try: 
            action, agent = term.arguments[0], term.arguments[1]
        except (IndexError, UnboundLocalError):
            print(message())
            continue
        
        prg.assign_external(clingo.Function("c", [i-1]), False)
        prg.ground([("step", [i])])
        prg.assign_external(clingo.Function("c", [i]), True)
        prg.assign_external(clingo.Function(pred, [action, agent, i]), True)

        with prg.solve(yield_ = True) as results:
            models = [m for m in results]
            if (models == []):
                print("This assignment has no satisfying models")
                continue
            else:
                ordmod = sorted(models, key = lambda m: m.cost[0])
                display(ordmod[0])



if __name__=='__main__':
    run()
