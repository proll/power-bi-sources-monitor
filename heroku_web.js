// Nodejs libs.
var path = require('path');
var fs = require('fs');
var url = require('url');

// External libs.
var connect = require('connect'),
	httpProxy = require('http-proxy');

var storeDataCollector = require('./store-data-collector');

// Get values from config, or use defaults.
var port = process.env.PORT || 5000;
var base = './app';

var proxy = new httpProxy.RoutingProxy({changeOrigin: true});

var middleware = [

	// if request points to non existing file, route to index.html
	function(req, res, next){
		var requestedPath = url.parse(req.url).pathname;
		if (requestedPath === "/uncommented") {
			storeDataCollector.collect_uncommented_reviews((reviews)=>{
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(reviews), "utf-8");
			});
			return;
		}

		fs.exists(base + requestedPath, function(exists){
			if(exists){
				return next();
			}else{
				fs.readFile(base + "/index.html", function(error, content){
					if(error){
						console.log("Cannot read file: " + base + "/index.html");
					}else{
						res.writeHead(200, { 'Content-Type': 'text/html' });
						res.end(content, "utf-8");
					}
				});
			}
		});
	},
	
	// Serve other files static
	connect.static(base),
	
	// Make empty directories browsable. (overkill?)
	connect.directory(base)
];
connect.apply(null, middleware).listen(port);