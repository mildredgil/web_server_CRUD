const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const { v4: uuidv4 } = require('uuid');

const jsonParser = bodyParser.json();

const validateAPIKEY = require('./middleware/validate-bearer-token');
app.use( validateAPIKEY ); 

app.use(morgan('dev'));

let createElement = (title, description, url, rating) => {
	return {
		id: uuidv4(),
		title,
		description,
		url,
		rating
	}
}

let listOfBookmarks = [
	createElement('blackboard', 'school platform', 'https://miscursos.tec.mx/webapps/login/?action=default_login', 5),
	createElement('twitter', 'news', 'https://twitter.com', 4)
]

//request, response
app.get('/bookmarks', (req, res) => {
	return res.status(200).json(listOfBookmarks);
});

app.get('/bookmark', (req, res) => {
	let title = req.query.title;

	if(!title) {
		res.statusMessage = "No title found."
		
		res.status(406).end();
	} else {
		let bkmark = listOfBookmarks.filter( bkmark => bkmark.title == title);

		if(bkmark.length == 0) {
			res.statusMessage = `There is no result with title=${title}`;
			res.status(404).end();
		} else {
			res.status(200).json(bkmark);
		}		
	}

	return res;
});

app.post('/bookmarks', [jsonParser], (req, res) => {
	let title = req.body.title;
	let description = req.body.description;
	let url = req.body.url;
	let rating = req.body.rating;

	if(!title || !description || !url || !rating) {
		res.statusMessage = `One of these parameters is missing in the request: description, title, url, rating`;
		return res.status(406).end();
	}

	let newBkmark = createElement(title, description, url, rating);
	listOfBookmarks.push( newBkmark );
	return res.status(201).json( newBkmark );
})

app.delete('/bookmark/:id', (req, res) => {
	let id = req.params.id;
	
	let bkmarkIndex = listOfBookmarks.findIndex( (bkmark) => {
		if(bkmark.id === id) {
			return true;
		}
	})

	if(bkmarkIndex > -1 ) {
		listOfBookmarks.splice(bkmarkIndex, 1);
		
		return res.status(200).json({});
	} else {
		res.statusMessage = `The bookmark with id = ${id} does not exist`;
		return res.status(404).end();
	}
});

app.patch('/bookmark/:id', [jsonParser], (req, res) => {
	let body_id = req.body.id;

	if(!body_id) {
		res.statusMessage = `The id parameter is missing.`;
		res.status(406).end();
	}

	let id = req.params.id;
	
	if(body_id != id) {
		res.statusMessage = `ids don't match.`;
		res.status(409).end();
	}

	let bkmark = listOfBookmarks.find( (bkmark) => {
		return bkmark.id == id;
	})

	if(!bkmark) {
		res.statusMessage = `There is no result with id=${id}`;
		res.status(404).end();
	}

	let title = req.body.title;
	let description = req.body.description;
	let url = req.body.url;
	let rating = req.body.rating;

	if(title) {
		bkmark.title = title;	
	}

	if(description) {
		bkmark.description = description;	
	}

	if(url) {
		bkmark.url = url;	
	}

	if(rating) {
		bkmark.rating = rating;	
	}
	
	res.status(202).json(bkmark);		

	return res;
})

app.listen( 8080, () => {
	console.log("Server - CRUD app on port 8080");
});

//http://localhost:8080