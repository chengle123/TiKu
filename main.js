const https = require('https');
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
const mysql = require('mysql');
var path = require('path');
var AipOcrClient = require("baidu-aip-sdk").ocr;

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

const issueList = require('./models/issue');

// 本地服务======================================================================================

var app = express();
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var server = app.listen(9696, function() {
	console.log('Ready');
	
});

// // 爬取数据=================================================================================================
var num = 0;
var page = parseInt(fs.readFileSync('./num.text',"utf-8")) || 1;
var getAnswer = (index) => {
	var url = 'http://answer.sm.cn/answer/detail?format=json&activity=million&sid='+index
	var req = http.get(url,(res) => {
        var datas = '';
        res.on('data', (data) => {
            datas += data;
        })
        res.on('end', (data) => {
			data = JSON.parse(datas).data.question;
			
				console.log(data,index)
			if(data.length > 0){
				for(var i = 0; i<data.length;i++){
					create({
						title: data[i].title,
						qid: 0,
                        select: '',
                        resolve: '[]',
						answer: data[i].answer
					});
				}
				num = 0;
				writeFile('./num.text',index);
				getAnswer(index+1);
			}else{
				if(num >= 30){
					console.log('退出采集');
					setTimeout(()=>{
						page = parseInt(fs.readFileSync('./num.text',"utf-8")) || 1;
						getAnswer(page);
					},3600000);
					return;
				}else{
					num ++;
					getAnswer(index+1);
				}
			}
        })
    }).on('error',(err) => {
        console.log('getAnswer异常原因'+err);
    })
    req.end();
	
}

var exist = false;
var getData = () => {
    var ops = {
            method: 'GET',
            host: 'www.wukong.com',
            port: '443',
            path: '/wenda/wapshare/subject/tab/brow/?subject_id=6509045544260731143&offset=0&tab_id=1',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Encoding':'utf-8',
                'Accept':'application/json',
                'Accept-Language':'zh-CN,zh;q=0.9',
                'Cache-Control':'no-cache',
                'Cookie':'tt_webid=73151001769; answer_finalFrom=https%3A%2F%2Fwww.baidu.com%2Flink; cookie_tt_page=6814bd3837c248978c24b6954675ca4b; tt_webid=73151001769; _ga=GA1.2.1829134616.1515656721; _gid=GA1.2.221882844.1515656721; answer_enterFrom=other',
                'Pragma':'no-cache',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
            }
        }
    var req = https.request(ops,(res) => {
        var datas = '';
        res.on('data', (data) => {
            datas += data;
        })
        res.on('end', (data) => {
            datas = JSON.parse(ClearBr(datas)).data['tab_item_list'];
            var arr = [];
        
            for(var i = 0; i<datas.length;i++){
                if(datas[i].question.title.indexOf('#百万英雄#') >= 0){
                    continue;
                }else{
                    arr.push({
                        title: datas[i].question.title,
                        qid: datas[i].question.qid,
                        select: datas[i].question.content.text,
                        resolve: datas[i].question.content.text.split(/(?=[A-Z]\.)/),
                        answer: ''
                    });
                }
            }
            // writeFile(arr);
			exist = false;
            getHtml(0,arr);            
        })
    }).on('error',(err) => {
        console.log('getData异常原因'+err);
    })
    req.end();
}


var getHtml = (i,data) => {
    if(i < data.length){
        var req = https.get('https://www.wukong.com/question/'+data[i].qid+'/',(res) => {
            var html = '';        //用来存储请求网页的整个html内容
		    var json = [];
            res.setEncoding('utf-8');
            res.on('data', (chunk) => {
                html += chunk;
            })
            res.on('end', () => {
                var arr = [];
                var $ = cheerio.load(html,{decodeEntities: false});
                var out = false;
                $(".answer-text-full").each(function(){
                    if(!out){
                        var text = $(this).text().toUpperCase();
                        // console.log(text)
                        for(var j = 0; j<data[i].resolve.length;j++){
                            if(data[i].resolve[j].indexOf(text) >= 0){
                                data[i].answer = text;
                                out = true;
                                break;
                            }
                        }
                    }else{
                        return false
                    }
                });
				data[i].resolve = JSON.stringify(data[i].resolve);
				if(!exist){
					create(data[i]);
					console.log(data[i])
					i++;
					getHtml(i,data)
				}else{
					setTimeout(()=>{
						getData();
					},60000);
				}
            })
        }).on('error',(err) => {
            console.log('getHtml异常原因'+err);
        })
        req.end();
    }else{
		setTimeout(()=>{
			getData();
		},10000)
        writeFile('./json.json',data);
    }
}


var ClearBr = (key) => { 
    key = key.replace(/<\/?.+?>/g,"");
    key = key.replace(/[\r\n]/g, "");
    key = key.replace(/\s+/g, ""); 
    return key; 
}
var writeFile = (url,data) => {
    fs.writeFile(url, JSON.stringify(data), function() {
        console.log('打包为json.json');
    });
}




// // 数据库操作==========================================================================

var create = (ops) => {
	issueList.create(ops).then((row)=>{
		console.log('插入一条数据')
	},(data)=>{
		exist = true;
		// console.log(data)
		console.log('插入失败')
	});
}

router.post('/getData', function(req, res) {
	var sql;
	if(req.body.type == '1') {
		sql = {where:{title:req.body.title},order:[['id', 'DESC']]};
	}else if(req.body.type == '2'){
		sql = {where:{answer:''},order:[['id', 'DESC']]};
	}
	routerGetData(sql,res);
})
router.post('/setEdit', function(req, res) {
	try{
		
		issueList.update({answer:req.body.answer},{where:{id:req.body.id}}).then(function(rows){
			res.json({
				result: 'success',
				data: '',
				msg: '修改成功'
			});
		})
		
	}catch(e) {
		res.json({
			result: 'error',
			data: '',
			msg: '修改失败'
		});
	}
})

var routerGetData = (sql,res) => {
	try{
		issueList.findAll(sql).then(function(rows){
			if(res){
				res.json({
					count: rows.length,
					result: 'success',
					data: rows,
					msg: '查询成功'
				});
			}else{
				if(rows.length > 0){
					console.log(`问题：${ rows[0].title }\n选项：${ rows[0].select }\n答案：${ rows[0].answer }`);
				}else{
					console.log('没有这个问题哟！');
				}
			}
		})
		
	}catch(e) {
		if(res){
			res.json({
				result: 'error',
				data: '',
				msg: '查询失败'
			});
		}else{
			console.log('查询失败')
		}
	}
}

app.use('/', router);


// 图片识别============================================


// 设置APPID/AK/SK
var APP_ID = "10673570";
var API_KEY = "9K4KgdlgQY17Moi9DpLnff35";
var SECRET_KEY = "DnpfvwXjZMizEKIf92lYj3PGsmvtGRZh";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

// var search = () => {
// 	var image = fs.readFileSync("./text_area.png").toString("base64");
// 	// 调用通用文字识别, 图片参数为本地图片
// 	client.generalBasic(image).then(function(result) {
// 		var text = '';
// 		for(var i=0;i<result.words_result.length;i++){
// 			text += result.words_result[i].words;
// 		}
// 		var sql = {where:{title: text.split(/[0-9]\./)[1]},order:[['id', 'DESC']]};
// 		routerGetData(sql);
// 	}).catch(function(err) {
// 		// 如果发生网络错误
// 		console.log(err);
// 	});
// }

// search();
getData();
getAnswer(page);