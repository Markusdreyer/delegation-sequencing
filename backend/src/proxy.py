import os
import json

stream = os.popen('clingo --outf=2 -Wno-atom-undefined --opt-mode=optN --models=4 src/model.lp src/actions.lp')
output = stream.read()

with open('src/res.json', 'w') as f:
    f.write(output)
    #json.dump(output, f)

print("Data ready")