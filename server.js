const express = require('express');
const app = express();

const fs = require('fs');
const shortid = require('shortid');
const path = require('path')
const child_process = require('child_process')

const bodyParser = require("body-parser");
app.use('/', express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // support json encoded bodies


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

app.post('/api/download', (req, res) => {
	
	child_process.exec("python3 process_download.py '" + JSON.stringify(req.body)+"'", function callback(error, stdout, stderr){
	    console.log("python output")
	    console.log(error)
	    console.log(stdout)
	    // result
	});

	console.log("Downloading")
	var state = req.body;
	// console.log(state)
	var id = req.params.id;
	var options = {
	    root: __dirname + '/client/public/',
	    dotfiles: 'deny',
	    headers: {
	        'x-timestamp': Date.now(),
	        'x-sent': true
	    }
 	 };
    var fileName = "testFile.zip"; // The default name the browser will use
    console.log("download attempt")
    console.log(__dirname+"/client/public/testFile")
    res.sendFile(fileName,options, function(err){console.log(err)});    
    // res.json("my body")
});

app.get('/api/newProjectId', (req, res) => {
	console.log("New project ID request")
	res.json(shortid.generate())
});

app.post('/api/saveProject', (req, res) => {
	var d = new Date().getTime();

	console.log("saving project: "+req.body.id)
	console.log(req.body)
	var id = req.body.id
	var state = req.body.state
	state.meta.lastSaved = d
	state = JSON.stringify(state)
	fs.writeFile(projectFilesFolder+id+'.json', state, 'utf8', function(){
		console.log("Saved project: "+JSON.stringify(req.body.id))
	});
	res.json()
});

app.post('/api/loadProject', (req, res) => {
	console.log("loading project: "+req.body.id)
	var id = req.body.id
	var contents = fs.readFileSync(projectFilesFolder+id+'.json', 'utf8');
	res.json(contents)
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);