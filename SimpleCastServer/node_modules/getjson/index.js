var http = require("http");

exports.getJSON = function(options, callback){

    var req = http.request(options, function(res){
        
        var buffer = '';
       
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            buffer += chunk;
        });

        res.on('end', function() {
            var data = JSON.parse(buffer);
            callback(res.statusCode, data);
        });
    });

    req.end();
};