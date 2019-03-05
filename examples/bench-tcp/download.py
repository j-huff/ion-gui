import json
import requests
import shutil
import zipfile
import sys
from ast import literal_eval

URL = "http://localhost:3000/api/downloadZip"

input_str = sys.stdin.read()
print(input_str)
machineMap = literal_eval(input_str);
print(machineMap)
#machineMap = {"Machine A":"localhost"}
PARAMS = {'id':sys.argv[1],'machineMap':json.dumps(machineMap)}

r = requests.get(url = URL, params = PARAMS,stream=True)


local_filename = "project.zip"
print()
with open(local_filename, 'wb') as f:
        shutil.copyfileobj(r.raw, f)

zip_ref = zipfile.ZipFile("project.zip", 'r')
zip_ref.extractall("")
zip_ref.close()
