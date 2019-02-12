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
	# print(json_data["links"][0])
	links = [link for link in json_data["links"].values() if link["node1_uuid"] == node_key or link["node2_uuid"] == node_key]
	f.write(f"1 {ipn} config.ionconfig\n")
	for link in links:
		for contact in link["contacts"].values():
			try:
				fromTime = contact["fromTime"]
				untilTime = contact["untilTime"]
				rate = contact["rate"]
				confidence = contact["confidence"]
				if (fromTime and untilTime and rate):
					f.write(f"a contact +{fromTime} +{untilTime} {rate} {confidence}\n")
			except:
				pass
	f.write(f"s\n")
	f.write(f"m horizon +0\n")

	f.close()