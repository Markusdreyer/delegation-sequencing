import clingo
import sys
            
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




if __name__=='__main__':
    run()
