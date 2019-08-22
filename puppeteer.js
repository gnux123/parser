var puppeteer = require('puppeteer');

var simulator = function(callback = null){
    return new Promise(function(resolve, reject){
        var _options = {
            executablePath: 'D:\\chrome-win\\chrome.exe',
            ignoreHTTPSErrors: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            ignoreDefaultArgs: ['--disable-extensions']
        }; 
        
        puppeteer.launch(_options).then(function(browser) {
            browser.newPage().then(function(page){
                // page.goto("https://tw.yahoo.com/");
                // // browser.close();
                // // resolve(page);
                typeof callback == "function" ? callback(browser, page) : null;
            });
        });
    });
};

simulator(function(browser, page){
    
    page.goto("https://www.skl.com.tw/", {waitUntil: 'load'}).then(function(){
        page.screenshot({path: 'google_'+new Date().getTime()+'.png'}).then(function(){
            browser.close().then(function(){ console.log("successs") });
        });
    });
    
    // page.screenshot({path: 'google.png'});
    // browser.close();
});

// WebView.then(function(page){
//     page.goto("https://skl.com.tw/");
// });