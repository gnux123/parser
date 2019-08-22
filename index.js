var https = require('https');
var Request = require('request');
var fs = require('fs');
var express = require("express");
var cheerio = require("cheerio");
var app = express();
var Router = express.Router();
var portNumber = 5020;

var _urlpath = 'https://www.skl.com.tw/';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var request = function(url, callback=null){
    https.get(url, function(res){
        var _html = "";
        res.setEncoding('utf8');
        res.on('data', function(chunk) { _html += chunk; })
           .on('end', function(){ typeof callback === "function"?callback(_html):null });
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

Router.get('/data', function(requ,resp){
    resp.setHeader('Content-Type', 'application/json');
    var _currentTime = new Date().getTime();

    Request({
        url: "https://www.vanilla-air.com/api/booking/flight-fare/list.json?__ts="+_currentTime+"&adultCount=1&childCount=0&couponCode=&currency=TWD&destination=TPE&infantCount=0&isMultiFlight=true&origin=NRT&searchCurrency=TWD&targetMonth=201910&version=1.0",
        method: "GET",
        headers: {
            "Host": "www.vanilla-air.com",
            "Set-Cookie": "_abck=86BDEFBD85348D5B1993A22F5EE254CF~-1~YAAQZVFFy433BX5sAQAAEJJWuAJBAyfdT9f5xhGyyK+VesbsJo876eaXrHcfkJ7eVT1NUlYlzSe0YsPiruhUUWMWBZ5ZB0JA4S6kv2HGVQoOabTdsRlvc5C/pSUxbLjE1oIvnlWc7RMV5qmfePi1z96j9KlNAiKp7NAfJIN1uMbekH0cnSNgkEL8meTQvyFfvht4awSrnC/dwe0PSL2WxC7MKbawO3SlAHVStn/QE/DRBg4cxnUv51OMyteJPS7t/8bmyp++Aj1DOdnC00xdcqPIGAoPX3hZBEaHtv2nfCdVjpwz+ea3uytzt8og2g==~0~-1~-1; Domain=.vanilla-air.com; Path=/; Expires=Fri, 21 Aug 2020 07:59:36 GMT; Max-Age=31536000; Secure"
        }
    }, function(e, r, b){
        if (!e) {
            console.log(r.body);
        }else{
            console.log(e);
        }
    });
});




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



app.use('/api', Router);
app.listen(portNumber);

console.log("https://localhost:%s is on.", portNumber);
