import os

stream = os.popen('clingo --outf=2  --opt-mode=optN --models=4 asp/actions.lp asp/control.lp')
output = stream.read()

try:
    with open('./src/res.json', 'w') as f:
        f.write(output)
        print("Data ready")
except Exception as error:
    print("Unable to write to file")

