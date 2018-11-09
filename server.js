const express = require('express');

const app = express();

const fs = require('fs');
const projectFilesFolder='./data/projectFiles/'

app.get('/api/projectFiles', (req, res) => {
	projects = []
	fs.readdirSync(projectFilesFolder).forEach(file => {
		var contents = fs.readFileSync(projectFilesFolder+file, 'utf8');
		var json = JSON.parse(contents)
		var meta = json.meta
		projects.push({filename:file,meta:meta})
	})
	console.log(projects)
	res.json(projects)
	console.log("projectFiles")

});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);