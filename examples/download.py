import json
import requests
import shutil
import zipfile
import sys

URL = "http://localhost:3000/api/downloadZip"

machineMap = {
	"Machine A": "127.0.0.1",
	# "Machine B": "192.168.20.25"
	"Machine B": "127.0.0.1"
}

PARAMS = {'id':sys.argv[1],'machineMap':json.dumps(machineMap)}

print("requesting")
r = requests.get(url = URL, params = PARAMS,stream=True)
print("request sent")

local_filename = "project.zip"
print()
with open(local_filename, 'wb') as f:
        shutil.copyfileobj(r.raw, f)

zip_ref = zipfile.ZipFile("project.zip", 'r')
zip_ref.extractall("")
zip_ref.close()
