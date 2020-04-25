const KEY = "2abbf7c3-245b-404f-9473-ade729ed4653";

function validateAPIKEY(req, res, next) {
	if(!req.query.apiKey && !req.headers.authorization && !req.headers['book-api-key']) {
		res.statusMessage = "Unauthorizated request. Send the API KEY"
		return res.status(401).end();
	}

	if(req.query.apiKey !== KEY && req.headers.authorization !== `Bearer ${KEY}` && req.headers['book-api-key'] !== KEY) {
		res.statusMessage = "Unauthorizated request. Invalid API KEY"
		return res.status(401).end();
	}	
	
	next();
}

module.exports = validateAPIKEY;