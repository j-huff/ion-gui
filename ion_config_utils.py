from io import StringIO

def generate_bprc(json_data,node_key,filename):
	nodes = json_data["nodes"]
	node = nodes[node_key]
	print(node)
	f = open(filename,"w")
	wmKey = node["wmKey"]
	f.write(f"wmKey {wmKey}\n")
	f.close()
