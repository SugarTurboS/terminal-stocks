//Global var
const request = require('request');
const colors = require('colors');
const iconv = require('iconv-lite');
const exec = require('child_process').exec;
const http = require('http');
const config = require('./config');
const BufferHelper = require('bufferhelper');

const space = {
    s2: "  ",
    s4: "    ",
    s8: "        ",
    s16: "                "
};

const stockIdList = config.stocks;

let stockResultList = [];

function renderList() {
    console.log('股票名称' +
        space.s4 +
        '昨日收盘' +
        space.s4 +
        '当前价格' +
        space.s4 +
        '今日涨幅' +
        space.s4 +
        '今日最高' +
        space.s4 +
        '今日最低');
    for (let i = 0; i < stockResultList.length; i++) {
        const item = stockResultList[i];
        let rate = 0.00;
        let rateText = '0.00%';
        if (item[3] != 0) {
            let dif = item[3] - item[2];
            if (dif >= 0) {
                rate = (dif / item[2] * 100).toFixed(2);
                rateText = colors.red(rate + '%');
            } else {
                rate = (dif / item[2] * 100).toFixed(2);
                rateText = colors.green(rate + '%');
            }
        }
        console.log("");
        console.log(colors.red(item[0]) +
            space.s4 +
            colors.yellow(item[2]) +
            space.s8 +
            colors.red(item[3]) +
            space.s8 +
            colors.red(rateText) +
            space.s8 +
            colors.red(item[4]) +
            space.s8 +
            colors.red(item[5])
        );
    }
}

function formatStr(data) {
    let str = '';
    str += colors.yellow(data.stockinfo.name);
    str += space.s2 + data.stockinfo.date;
    str += '\n';
    return str;
}

function getData() {
    let process = 0;
    stockResultList = [];
    clear();
    for (let i = stockIdList.length - 1; i >= 0; i--) {
        const item = stockIdList[i];
        let urlStr = config.api;
        urlStr = urlStr + item;
        const url = require('url').parse(urlStr);
        if(config.proxy.used){
            url.host = config.proxy.host;
            url.port = config.proxy.port;
            url.headers = {
                Host: config.proxy.headerHost
            }
        }
        http.get(url, function (res) {
            const bufferHelper = new BufferHelper();
            res.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
            res.on('end', function () {
                //console.log();
                process = process + 1;
                let str = iconv.decode(bufferHelper.toBuffer(), 'GBK');
                str = str.substring(str.indexOf("\"") + 1, str.lastIndexOf("\""));
                let arr = str.split(',');
                stockResultList.push(arr);
                if (process == stockIdList.length) {
                    renderList();
                    setTimeout(function () {
                        getData();
                    }, 5000);
                }
            });
        })
    }
    ;
}

function clear() {
    let stdout = "";

    // if (process.platform.indexOf("win") != 0) {
    //     stdout += "\033[2J";
    // } else {
    //     var lines = process.stdout.getWindowSize()[1];

    //     for (var i=0; i<lines; i++) {
    //         stdout += "\r\n";
    //     }
    // }

    // Reset cursur
    stdout += "\033c";
    stockResultList = [];
    process.stdout.write(stdout);
}

getData();

