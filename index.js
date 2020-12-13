const url = require('url')
const crypto = require('crypto')
const image = require('./src/image')
const svgExt = /\.svg$/
const pngExt = /\.png$/
const sizePat = /^\d+x\d+$/

const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
app.use(express.json());

app.get("*", async function(req, res) {  
  let { pathname, query } = url.parse(req.url, true)
  if (pathname === '/favicon.ico') {
    pathname = Math.random().toString()
  }
  // console.log(pathname)
  if (pathname === '/') {
    pathname = Math.random().toString()
  } else {
    res.setHeader('Cache-Control', 'max-age=2592000, public')
    res.setHeader('Last-Modified', 'Mon, 03 Jan 2011 17:45:57 GMT')
  }
  let height
  if (sizePat.test(query.size)) {
    height = query.size.slice(query.size.indexOf('x') + 1)
    query.size = query.size.slice(0, query.size.indexOf('x'))
  } else {
    height = query.size
  }
  if (query.type === 'svg' || svgExt.test(pathname)) {
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send( image.generateSVG(pathname.replace(svgExt, ''), query.text || '', query.size, height || ''))
    console.log(image.generateSVG(pathname.replace(svgExt, ''), query.text || '', query.size, height || ''))
  } else {
  const semiTransparentRedPng = await image.generatePNG2(pathname.replace(pngExt, ''), query.size, height || '');
  res.setHeader('Content-Type', 'image/png')
  res.send( semiTransparentRedPng )
  }
  //  res.send(image.generatePNG(pathname.replace(pngExt, ''), query.size, height || '')) 
  //  console.log(image.generatePNG(pathname.replace(pngExt, ''), query.size, height || ''))  
});

// app.get("*",edata)
app.listen(PORT, function() {
  console.log(`Url: http://127.0.0.1:${PORT}`);
});
