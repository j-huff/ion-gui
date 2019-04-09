
import shlex, subprocess, re
import os,re
from time import sleep
import pickle,argparse
import math
import time

dir_path = os.path.dirname(os.path.realpath(__file__))
def run_test(num_bundles, bundle_size, num_instances=1, num_cores=12):
	start_time = time.time()
	print("\nRunning test:")
	print("  Bundle count:\t{}".format(num_bundles))
	print("  Bundle size:\t{}".format(bundle_size))
	print("  Endpoints:\t{}".format(num_instances))
	print("  Cores:\t{}".format(num_cores))
	print()
	counters = []
	for i in range(num_instances):
		corelist = "0-{}".format(num_cores-1)
		command = "taskset -c {} bpcounter ipn:3.{} {}".format(corelist,i+1,num_bundles)
		args = shlex.split(command)
		p = subprocess.Popen(args,stdout=subprocess.PIPE, cwd=dir_path+"/3.bench.tcp")
		counters.append(p)
	sleep(1)
	for i in range(num_instances):
		command = "taskset -c 9,10,11 bpdriver {} ipn:2.{} ipn:3.{} -{}".format(num_bundles,i+1,i+1,bundle_size)
		args = shlex.split(command)
		p = subprocess.Popen(args,stdout=subprocess.PIPE, cwd=dir_path+"/2.bench.tcp")

	s = 0
	count = 0
	for i,p in enumerate(counters):
		while True:
			l = p.stdout.readline().decode("utf-8")
			# print(l)
			if re.search('received', l):
				pass
			
			res = re.search('(?<=Throughput \(Mbps\)\: )[0-9]*\.[0-9]*',l)
			if res:
				split = l.split(' ')
				num = float(split[2].strip())
				s+=num
				count+=1
				# print("endpoint {}: {} Mbps".format(i+1,num))
				break
			if l == "":
				break
	elapsed_time = time.time() - start_time
	print("time: {} s".format(round(elapsed_time,2)))
	print("Throughput: {} Mbps".format(s))
	if count == 0:
		return 0
	else:
		return s


parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--graph', metavar='data_file',type=str, nargs=1)
args = parser.parse_args()

if args.graph:
	filename = args.graph[0]
	data = pickle.load(open(filename,'rb'))
	print(data)

	quit()

# args = shlex.split(command)

# throughput = run_test(50000, 10000, 10)
# print("Throughput: {} Mbps".format(throughput))

tests = {}

# tests = pickle.load(open("tests.p","rb"))

bundle_sizes = [512000]
bundle_count = 10000
runs = 1

command = "./start"
args = shlex.split(command)
p = subprocess.Popen(args,stdout=subprocess.PIPE)
p.wait()

print("ion nodes started")

sshProcess = subprocess.Popen(['ssh', 
                               "john@sagerlt"],
                               stdin=subprocess.PIPE, 
                               stdout = subprocess.PIPE,
                               universal_newlines=True,
                               bufsize=0)

sshProcess.stdin.write("bpcounter ipn:3.1 10000\n")


command = "bpdriver 10000 ipn:2.1 ipn:3.1 -10000"

args = shlex.split(command)
p = subprocess.Popen(args,stdout=subprocess.PIPE)
p.wait()

while True:
	l = sshProcess.stdout.readline()
	if l:
		print(l)