import os
stream = os.popen('clingo --outf=2 src/model.lp src/actions.lp')
output = stream.read()

print(output)