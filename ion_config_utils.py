from io import StringIO

def generate_ionconfig(json_data,node_key,filename):
	nodes = json_data["nodes"]
	node = nodes[node_key]
	# print(node)
	f = open(filename,"w")
	wmKey = node["wmKey"]
	sdrName = node["sdrName"]
	wmSize = node["wmSize"]
	heapWords = node["heapWords"]

	f.write(f"wmKey {wmKey}\n")
	f.write(f"sdrName {sdrName}\n")
	f.write(f"wmSize {wmSize}\n")
	f.write(f"configFlags 1\n")
	f.write(f"heapWords {heapWords}\n")
	f.close()

def generate_ionrc(json_data,node_key,filename):
	nodes = json_data["nodes"]
	node = nodes[node_key]
	# print(node)
	f = open(filename,"w")
	ipn = node["ipn"]

	f.write(f"1 {ipn} config.ionconfig\n")
	f.write(f"s\n")
	f.write(f"m horizon +0\n")

	f.close()