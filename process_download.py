import json
import  sys
import tempfile
import os
import uuid
import zipfile
import time
import shutil


from ion_config_utils import *

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))

def pretty(obj):
	print(json.dumps(nodes, indent=4, separators=(',',' : ')))

# input_str = str(sys.stdin.read())
input_str = str(sys.argv[1])
input_json = json.loads(input_str)
# print(input_json['machines'])

tmp_path = os.getcwd() + "/tmp/"
path_uuid = str(uuid.uuid4())
path = tmp_path + path_uuid +"/"
common_path = os.getcwd() + "/config_common/"
# print ("The current working directory is %s" % path)
os.mkdir(path)

machines = input_json['machines']
nodes = input_json['nodes']
# pretty(nodes)

node_paths = {}
for key in nodes:
	node = nodes[key]
	new_path = path + node["name"] + "/"
	node_paths[key] = new_path
	os.mkdir(new_path)
	cmd = "cp "+common_path+"* "+new_path
	os.system(cmd)

	generate_ionconfig(input_json,key,new_path+"config.ionconfig")
	generate_ionrc(input_json,key,new_path+"config.ionrc")


zip_filename = tmp_path+path_uuid
shutil.make_archive(zip_filename, 'zip', path)
# time.sleep(.1)
ret = "{'filename' : '"+zip_filename+'.zip'+"'}"
print(zip_filename+".zip",end="")
shutil.rmtree(tmp_path + path_uuid)