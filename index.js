var https = require('https');
var fs = require('fs');
var express = require("express");
var cheerio = require("cheerio");
var app = express();
var Router = express.Router();
var portNumber = 5020;

var _urlpath = 'https://www.skl.com.tw/';

var request = function(url, callback=null){
    https.get(url, function(res){
        var _html = "";
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            _html += chunk;
        });

        res.on('end', function(){ typeof callback === "function"?callback(_html):null });
    });
}


var _getMegaData = function(arr, callback = null){

    var _callApi = function(type, callback=null){
        var _currentTime = new Date().getTime();
        var _url = _urlpath + '/sklife_web/jsp/metaMenu.jsp?typeId='+type+'&v='+_currentTime;
        request(_url, function(data) { typeof callback == "function"?callback(data):null });
    };

    var AllData = [];

    for(var i = 0; i < arr.length; i++){
        let _item = arr[i];
        _callApi(_item.id, function(data){
            _item["MegaMenu"] = JSON.parse(data)["MegaMenu"];
            AllData.push(_item);
            if(AllData.length == arr.length){
                typeof callback === "function" ? callback(AllData) : null;
            }
        });
    }
};

Router.get('/mainmenu', function(req, resp){
    resp.setHeader('Content-Type', 'application/json');
    request(_urlpath, function(html){
        var $ = cheerio.load(html);
        var navData=$('.mainNav').find(".navchad li");
        var _data = [];

        navData.each(function(){
            var _navText = $(this).find("span.text").text();
            var _id = $(this).data("ga-id");
            var _temp = {
                id: _id,
                name: _navText
            };
            _data.push(_temp);
        });

        _getMegaData(_data, function(data){
           resp.send(data);
        });
    });
});

app.use('/', Router);
app.listen(portNumber);

console.log("https://localhost:%s is on.", portNumber);
