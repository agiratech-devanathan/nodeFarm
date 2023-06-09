const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify=require('slugify');
const replaceTemplate= require('./module/replaceTemplate');

// const textIn=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOuput=`this is what we know about avacodo:${textIn}.\n created on ${Date()}`;
// fs.writeFileSync('./txt/output.txt',textOuput);
// console.log("file written");

//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😁');
//       })
//     });
//   });
// });
// console.log('Will read file!');


/////SERVER///////



const tempOverView=fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data);
const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);


const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);


    if (pathname === '/' || pathname === "/overview") {
        res.writeHead(200, {
            'Content-type': 'text/html'
          });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverView.replace('{%PRODUCT_CARDS%}', cardsHtml);
         res.end(output);
    }
    else if (pathname === "/product") {
        res.writeHead(200, {
            'Content-type': 'text/html'
          });
          const product = dataObj[query.id];

          const output = replaceTemplate(tempProduct, product);
          res.end(output);
    }
    else if (pathname === "/api") {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }

})

server.listen(8000, '127.0.0.1', () => {
    console.log("Server Started... in port 8000");
})