const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const mysql = require('mysql');

const issueList = require('./models/issue');

// issueList.findAll().then((row)=>{
// 	console.log(row)
// });
issueList.create({
	"title": "“一甲子”有多少年？",
	"qid": "6508773381289017607",
	"select": "A.十年B.六十年C.一百年",
	"resolve": '["A.十年", "B.六十年", "C.一百年"]',
	"answer": "B"
}).then((row)=>{
	console.log(row)
});


// var getData = () => {
//     var ops = {
//             method: 'GET',
//             host: 'www.wukong.com',
//             port: '443',
//             path: '/wenda/wapshare/subject/tab/brow/?subject_id=6509045544260731143&offset=0&tab_id=1',
//             headers:{
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Accept-Encoding':'utf-8',
//                 'Accept':'application/json',
//                 'Accept-Language':'zh-CN,zh;q=0.9',
//                 'Cache-Control':'no-cache',
//                 'Cookie':'tt_webid=73151001769; answer_finalFrom=https%3A%2F%2Fwww.baidu.com%2Flink; cookie_tt_page=6814bd3837c248978c24b6954675ca4b; tt_webid=73151001769; _ga=GA1.2.1829134616.1515656721; _gid=GA1.2.221882844.1515656721; answer_enterFrom=other',
//                 'Pragma':'no-cache',
//                 'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
//             }
//         }
//     var req = https.request(ops,(res) => {
//         var datas = '';
//         res.on('data', (data) => {
//             datas += data;
//         })
//         res.on('end', (data) => {
//             datas = JSON.parse(ClearBr(datas)).data['tab_item_list'];
//             var arr = [];
        
//             for(var i = 0; i<datas.length;i++){
//                 if(datas[i].question.title.indexOf('#百万英雄#') >= 0){
//                     continue;
//                 }else{
//                     arr.push({
//                         title: datas[i].question.title,
//                         qid: datas[i].question.qid,
//                         select: datas[i].question.content.text,
//                         resolve: datas[i].question.content.text.split(/(?=[A-Z]\.)/),
//                         answer: ''
//                     });
//                 }
//             }
//             writeFile(arr);
//             getHtml(0,arr);            
//         })
//     }).on('error',(err) => {
//         console.log('异常原因1'+err);
//     })
//     req.end();
// }



// var getHtml = (i,data) => {
//     if(i < data.length){
//         var req = https.get('https://www.wukong.com/question/'+data[i].qid+'/',(res) => {
//             var html = '';        //用来存储请求网页的整个html内容
// 		    var json = [];
//             res.setEncoding('utf-8');
//             res.on('data', (chunk) => {
//                 html += chunk;
//             })
//             res.on('end', () => {
//                 var arr = [];
//                 var $ = cheerio.load(html,{decodeEntities: false});
//                 var out = false;
//                 $(".answer-text-full").each(function(){
//                     if(!out){
//                         var text = $(this).text().toUpperCase();
//                         console.log(text)
//                         for(var j = 0; j<data[i].resolve.length;j++){
//                             if(data[i].resolve[j].indexOf(text) >= 0){
//                                 data[i].answer = text;
//                                 out = true;
//                                 break;
//                             }
//                         }
//                     }else{
//                         return false
//                     }
//                 });
//                 console.log(data[i])
//                 i++;
//                 getHtml(i,data)
//             })
//         }).on('error',(err) => {
//             console.log('异常原因'+err);
//         })
//         req.end();
//     }else{
//         writeFile(data);
//     }
// }


// var ClearBr = (key) => { 
//     key = key.replace(/<\/?.+?>/g,"");
//     key = key.replace(/[\r\n]/g, "");
//     key = key.replace(/\s+/g, ""); 
//     return key; 
// }
// var writeFile = (data) => {
//     fs.writeFile('./json.json', JSON.stringify(data), function() {
//         console.log('打包为json.json');
//     });
// }

// getData();
