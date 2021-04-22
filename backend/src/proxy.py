import os
import json

stream = os.popen('clingo --outf=2 -Wno-atom-undefined src/model.lp src/actions.lp')
#clingo --outf=2 -Wno-atom-undefined --opt-mode=optN --models=50 src/model.lp src/actions.lp
output = stream.read()

with open('src/res.json', 'w') as f:
    json.dump(output, f)

print("Data ready")