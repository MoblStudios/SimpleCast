/**
 * SimpleCast API JSONP Proxy 2012
 * @author Matt Null
 */

var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , rest = require('getjson')
  , fs = require('fs');


 // Configuration
app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname));
});

//start the server
server.listen(3333);

app.get('/', function(req,res){
	res.send(fs.readFileSync('index.html', encoding='utf8'));
});

app.get('/weather', function(req, res){	
	var callback = req.param('callback');
	var lat = req.param('lat') || '';
	var lon = req.param('lon') || '';
	var query = 'lat='+lat+'&lon='+lon;
	

	var almanacOptions = {
		host: 'api.wunderground.com',
		port: 80,
		path: 'http://api.wunderground.com/api/16ff6f53cb5fb58f/almanac/q/'+query+'.json',
		method: 'GET'
	};

	rest.getJSON(almanacOptions, function(status, almanac){
		
		var forecastOptions = {
			host: 'mattnull.openweather.jit.su',
			port: 80,
			path: '/forecast?'+query,
			method: 'GET'
		};

		rest.getJSON(forecastOptions, function(status, forecast){
			
			res.set({
				'Content-Type': 'application/javascript',
			});

			//process data 
			var data = {};
			data.forecast = [];
			
			var f = forecast.forecast.simpleforecast.forecastday;
			
			for(var i = 0; i < f.length; i++){
				data.forecast.push({
					high : f[i].high.fahrenheit,
					low : f[i].low.fahrenheit,
					perc : f[i].pop,
					icon : f[i].icon,
					month : f[i].date.monthname,
					weekDay : f[i].date.weekday,
					day : f[i].date.day
				});
			}

			data.almanac = almanac.almanac;
			res.send(callback+'('+JSON.stringify(data)+');');
		});
	});

});

console.log("Express server listening on port " + 3333);
