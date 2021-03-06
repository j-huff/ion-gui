const express = require('express');
const app = express();

const fs = require('fs');
const shortid = require('shortid');
const path = require('path')
const child_process = require('child_process')

const bodyParser = require("body-parser");
const ion_config = require('./ion_config')
app.use('/', express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // support json encoded bodies


const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data/configs.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the configs database.');
});

// db.run('CREATE TABLE configs (url text NOT NULL PRIMARY KEY,read_url text NOT NULL UNIQUE,json blob)');
// db.run('CREATE UNIQUE INDEX idx_url ON configs (url);')
// db.run('CREATE UNIQUE INDEX idx_read_url ON configs (read_url);')




const projectFilesFolder='./data/projectFiles/'

app.get('/api/projectFiles', (req, res) => {
	projects = []
	fs.readdirSync(projectFilesFolder).forEach(file => {
		if(path.extname(file) == '.json'){
			var contents = fs.readFileSync(projectFilesFolder+file, 'utf8');
			var json = JSON.parse(contents)
			var meta = json.meta
			projects.push({filename:file,meta:meta})
		}
	})
	projects = projects.sort(function(a,b){return  b.meta.lastSaved-a.meta.lastSaved})
	res.json(projects)
});


const applyMachineMap = (json, machineMap) => {
	console.log("Machine map")
	let remapped = {...json};
	for(let map_key in machineMap){
		console.log(map_key)
  		for(let machine_key in json.machines){

  			if(remapped.machines[machine_key].name == map_key){
				console.log("remapping")
				remapped.machines[machine_key].address = machineMap[map_key]
  			}
  		}
  	}
  	return remapped
}

const defaultZipOptions = () => {
	return {
		    dotfiles: 'deny',
		    headers: {
		        'x-timestamp': Date.now(),
		        'x-sent': true
		    }
	 	 };
}
const getZip = (json) => {
	console.log("exporting")
	child_process.exec("python3.7 process_download.py '" + JSON.stringify(json)+"'", function callback(error, stdout, stderr){

	    
	    var zip_filename = stdout
	    console.log(zip_filename)
	 	return zip_filename

	    
	});
}

app.get('/api/downloadZip', (req, res) => {
	console.log("Download Zip Request")
	console.log("query: "+req.query.id)
	const query = req.query
	const id = query.id
	console.log(query.machineMap)
	const machineMap = JSON.parse(query.machineMap)

	var sql = `SELECT url,
             read_url,
             json
      FROM configs
      WHERE url  = ? OR read_url = ?`;
	db.get(sql, [id,id], (err, row) => {
		if (err) {
			return console.error(err.message);
		}
		if(row){
			const json = JSON.parse(row.json)
		  	let remapped = applyMachineMap(json,machineMap);

			let zip_file = ion_config.configFromJSON(remapped);
			zip_file.generateNodeStream({type:'nodebuffer',streamFiles:true})
				.pipe(res);

		}
	});
});

app.post('/api/export', (req, res) => {
	console.log("exporting")
	child_process.exec("python3.7 process_download.py '" + JSON.stringify(req.body)+"'", function callback(error, stdout, stderr){

	    var options = {
		    dotfiles: 'deny',
		    headers: {
		        'x-timestamp': Date.now(),
		        'x-sent': true
		    }
	 	 };
	    zip_filename = stdout
	    console.log("zip_filename: ")
	    console.log(zip_filename)
	    console.log(stderr)
	    if(zip_filename){
	    	res.sendFile(zip_filename,options, function(err){
		    if(err){console.log(err)}
		    	fs.unlink(zip_filename,function(err){})
		    }); 
	    }
	});

    // var fileName = "testFile.zip"; // The default name the browser will use
    // console.log("download attempt")
    // console.log(__dirname+"/client/public/testFile")
    // res.sendFile(fileName,options, function(err){console.log(err)});    
    // res.json("my body")
});

app.get('/api/newProjectId', (req, res) => {
	console.log("New project ID request")
	res.json({id:shortid.generate(),read_id:shortid.generate()})
});

app.post('/api/saveProject', (req, res) => {



	var d = new Date().getTime();
	console.log("saving project: "+req.body.id)
	console.log(req.body)
	console.log(JSON.stringify(req.body.state))
	var id = req.body.id
	var state = req.body.state
	if(id == state.meta.read_id){
		return
	}

	state.meta.lastSaved = d
	var state_str = JSON.stringify(state)

	db.run('INSERT or REPLACE INTO configs (url, read_url, json) VALUES (?,?,?)',[id,state.meta.read_id,state_str])

	res.json()
});

app.post('/api/loadProject', (req, res) => {
	console.log("loading project: "+req.body.id)
	var id = req.body.id
	// var contents = fs.readFileSync(projectFilesFolder+id+'.json', 'utf8');
	
	var sql = `SELECT url,
             read_url,
             json
      FROM configs
      WHERE url  = ? OR read_url = ?`;
	db.get(sql, [id,id], (err, row) => {
	  if (err) {
	    return console.error(err.message);
	  }
	  if(row){
	  	res.json(row.json)
	  }else{
	  	res.status(404).json("Project id not found")
	  }
	});

	
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);