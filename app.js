//Global var
var request = require('request');
var colors = require('colors');
var iconv = require('iconv-lite');
var exec = require('child_process').exec;
var http = require('http');
var BufferHelper = require('bufferhelper');

var space = {
  s2:"  ",
  s4:"    ",
  s8:"        ",
  s16:"                "
};

var stockIdList = ['sh601118','sh600684'];

var stockResultList = [];

function renderList(){
  console.log('股票名称'+
              space.s4+
              '昨日收盘'+
              space.s4+
              '当前价格'+
              space.s4+
              '今日涨幅'+
              space.s4+
              '今日最高'+
              space.s4+
              '今日最低');
  for(var i=0;i<stockResultList.length;i++){
    var item = stockResultList[i];
    var rate = 0.00;
    var rateText = '0.00%';
    if(item[3] != 0){
      var dif = item[3] - item[2];
      if(dif >= 0){
        rate = (dif/item[2]*100).toFixed(2);
        rateText = colors.red(rate+'%');
      }else{
        rate = (dif/item[2]*100).toFixed(2);
        rateText = colors.green(rate+'%');
      }
    }
    console.log("");
    console.log(colors.red(item[0])+
                space.s4+
                colors.yellow(item[2])+
                space.s8+
                colors.red(item[3])+
                space.s8+
                colors.red(rateText)+
                space.s8+
                colors.red(item[4])+
                space.s8+
                colors.red(item[5])
                );
  }
}

function formatStr(data){
  var str = '';
  str += colors.yellow(data.stockinfo.name);
  str += space.s2 + data.stockinfo.date;
  str += '\n';
  return str;
}

function getData(){
  var process = 0;
  stockResultList = [];
  clear();
  for (var i = stockIdList.length - 1; i >= 0; i--) {
    var item = stockIdList[i];
    var urlStr = 'http://hq.sinajs.cn/list=';
    urlStr = urlStr + item;
    var url = require('url').parse(urlStr); 
    http.get(url,function(res){
      var bufferHelper = new BufferHelper();
      res.on('data', function (chunk) {
        bufferHelper.concat(chunk);
      });
      res.on('end',function(){ 
        //console.log();
        process = process + 1;
        var str = iconv.decode(bufferHelper.toBuffer(),'GBK');
        str = str.substring(str.indexOf("\"")+1,str.lastIndexOf("\""));
        var arr = str.split(',');
        stockResultList.push(arr);
        if(process == stockIdList.length){
          renderList();
          setTimeout(function(){
              getData();
          },5000);
        }
      });
    })
  };
}

function clear() {
    var stdout = "";

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

