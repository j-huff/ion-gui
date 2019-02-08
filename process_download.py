import json
import  sys
import tempfile
import os
import uuid

from ion_config_utils import *

def pretty(obj):
	print(json.dumps(nodes, indent=4, separators=(',',' : ')))

# input_str = str(sys.stdin.read())
input_str = str(sys.argv[1])
input_json = json.loads(input_str)
# print(input_json['machines'])

path = os.getcwd() + "/tmp/" + str(uuid.uuid4()) +"/"
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

	generate_bprc(input_json,key,new_path+"config.bprc")

# print(generate_bprc(input_json))

