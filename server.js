var http = require('http');
var express = require('express');
var path = require('path');
var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var entries = [];
app.locals.entries = entries;

app.get('/', function (req, res) {
	res.render("index");
});

app.post('/scrape', function(req, res) { 	
	if (!req.body.url) {
		console.log('body', req.body);
		res.status(400).send("<h1>The URL is missing, Nothing to do!</h1>");
		return;
	}

	var url = req.body.url;
	//console.log(url);
	var options = {
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
    };
    
	request(url, function(err, resp, html) {
		var $ = cheerio.load(html);
		var title = $('meta[property="og:title"]').attr('content');
		var description = $('meta[property="og:description"]').attr('content');
		var image = $('meta[property="og:image"]').attr('content');
		entries.pop();	
		entries.push({
		 	title: title,
		 	description: description,
		 	image: image	
		});

		console.log(entries);
		res.redirect('/');
	});
});

app.use(function(req, res) {
	res.status(404).render("404");
});
	
http.createServer(app).listen(3000, function() {
	console.log('Scrape app started on port 3000');
});




