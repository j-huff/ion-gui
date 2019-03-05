from io import StringIO
import traceback
import logging

logging.basicConfig(filename='example.log',level=logging.DEBUG)


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

def generate_bprc(json_data,node_key,filename):
	nodes = json_data["nodes"]
	node = nodes[node_key]
	# print(node)
	f = open(filename,"w")
	ipn = node["ipn"]
	# print(json_data["links"][0])
	links = [link for link in json_data["links"].values() if link["node1_uuid"] == node_key or link["node2_uuid"] == node_key]
	f.write(f"1\na scheme ipn 'ipnfw' 'ipnadminep'\n")

	
	f.write(f"a endpoint ipn:{ipn}.0 q\n")
	for endpointStr in node["endpoints"].split(','):

		num = int(endpointStr)
		f.write(f"a endpoint ipn:{ipn}.{endpointStr} q\n")

	protocols = set()
	for link in links:
		protocols.add(link["protocol"])

	for protocol in protocols:
		if(protocol == "TCP"):
			payloadBytesPerFrame = node["protocolSettings"]["TCP"]["payloadBytesPerFrame"]
			overheadBytesPerFrame = node["protocolSettings"]["TCP"]["overheadBytesPerFrame"]
			nominalDataRate = node["protocolSettings"]["TCP"]["nominalDataRate"]
			f.write(f"a protocol tcp {payloadBytesPerFrame} {overheadBytesPerFrame} {nominalDataRate}\n")
		if(protocol == "UDP"):
			payloadBytesPerFrame = node["protocolSettings"]["UDP"]["payloadBytesPerFrame"]
			overheadBytesPerFrame = node["protocolSettings"]["UDP"]["overheadBytesPerFrame"]
			nominalDataRate = node["protocolSettings"]["UDP"]["nominalDataRate"]
			f.write(f"a protocol udp {payloadBytesPerFrame} {overheadBytesPerFrame} {nominalDataRate}\n")

	#TODO: fix multiple link bug
	processed_uuids = []
	for link in links:
		logging.debug(link["uuid"])
		if link["uuid"] in processed_uuids:
			logging.debug("link already processed\n")
			logging.debug(link)

			continue
		processed_uuids.append(link["uuid"])
		if(link["protocol"] == "TCP"):
			port1 = link["protocolSettings"]["TCP"]["port1"][0]
			port2 = link["protocolSettings"]["TCP"]["port2"][0]
			other_uuid = link["node2_uuid"]
			if(node["uuid"] == link["node2_uuid"]):
				other_uuid = link["node1_uuid"]
				tmp = port1
				port1 = port2
				port2 = tmp

			other_node = nodes[other_uuid]
			other_machine_uuid = other_node["machine"]
			other_addr = json_data["machines"][other_machine_uuid]["address"]
			

			f.write(f"a induct tcp {other_addr}:{port1} tcpcli\n")
			f.write(f"a outduct tcp {other_addr}:{port2} ''\n")




	f.write("r 'ipnadmin config.ipnrc'\ns\n")

	f.close()

def generate_ipnrc(json_data,node_key,filename):
	nodes = json_data["nodes"]
	node = nodes[node_key]
	# print(node)
	f = open(filename,"w")
	ipn = node["ipn"]
	# print(json_data["links"][0])
	links = [link for link in json_data["links"].values() if link["node1_uuid"] == node_key or link["node2_uuid"] == node_key]

	for link in links:
		if(link["protocol"] == "TCP"):
			port1 = link["protocolSettings"]["TCP"]["port1"][0]
			port2 = link["protocolSettings"]["TCP"]["port2"][0]
			other_uuid = link["node2_uuid"]
			if(node["uuid"] == link["node2_uuid"]):
				other_uuid = link["node1_uuid"]
				tmp = port1
				port1 = port2
				port2 = tmp

			other_node = nodes[other_uuid]
			other_machine_uuid = other_node["machine"]
			other_addr = json_data["machines"][other_machine_uuid]["address"]
			other_ipn = other_node["ipn"]

			f.write(f"a plan {other_ipn} tcp/{other_addr}:{port2}\n")






	f.close()