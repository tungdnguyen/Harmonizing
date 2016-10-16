var express = require('express');
var fs = require('fs');



var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'music/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".mp3");
  }
})

var upload = multer({ storage: storage })
var uploadURL;
var app = express();
app.get('/',function(req,res){
	
	return res.redirect('/public/home.html');

});


app.get('/choose',function(req,res){
	
	return res.redirect('/public/choose.html');

});

app.get('/record',function(req,res){
	
	return res.redirect('/public/record.html');

});

app.get('/uploaded',function(req,res){
	
	return res.redirect('/public/uploaded.html');

});

app.get('/harmonysample',function(req,res){
	
	return res.redirect('/public/harmonysample.html');

});

app.post('/record', upload.any(), function (req, res, next) {
  	console.log("FILE UPLOADED");
  	var str = JSON.stringify(req.files);
  	fs.writeFile('data.json.txt',str, function (err) {
  			if (err) throw err;
  			console.log('It\'s saved!');
		});
  	var obj = JSON.parse(str);

  	console.log(obj[0].filename);
  	var stru = obj[0].filename;
  	uploadURL = stru;
  	return res.redirect('/public/uploaded.html');
})


app.use('/public', express.static(__dirname + '/public'));
/** Implementing Simple Music Server using Express JS **/
app.get('/music', function(req,res){
	// File to be served
	
	var fileId = req.query.id; 
	var file = __dirname + '/music/' + fileId;
	fs.exists(file,function(exists){
		if(exists)
		{
			var rstream = fs.createReadStream(file);
			rstream.pipe(res);
		}
		else
		{
			res.send("Its a 404");
			res.end();
		}
	
	});
	
});

app.get('/download', function(req,res){
	var fileId = req.query.id;
	var file = __dirname + '/music/' + fileId;
	fs.exists(file,function(exists){
		if(exists)
		{
			res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
			res.setHeader('Content-Type', 'application/audio/mpeg3')
			var rstream = fs.createReadStream(file);
			rstream.pipe(res);
		}
		else
		{
			res.send("Its a 404");
			res.end();
		}
	});
	
	
});
app.set('view engine','ejs'); 
app.get('/result', function(req, res){ 
 res.render('result',{title:"Result", upload:uploadURL});
 });

var port = Number(process.env.PORT || 3003);
app.listen(port,function(){
	console.log('App listening on port 3003!');
});