var path = require('path');
var express = require('express');
var http = require('http');

var app = express();


//Path to the files
//Making it static to be able to use it throughout the app and it remains in memory
var welcome = path.resolve(__dirname, 'Pages');
app.use(express.static(welcome));


//The Home page, where you select books
app.get('/', function(request, response){
    response.sendFile('index.html', {root: welcome});
});



//A function to retrieve separate books information related to specific ISBN when you select
//If the request is to select, get the url using request.params.isbn and add a .html to it
//It is handling errors too
app.get('/select/:isbn', function(request, response, next){

    var langFile = request.params.isbn + '.html';

    response.sendFile(langFile, {root: welcome}, function(err){
        if (err){
            next(new Error('Book not found!!!'));
        }
    });
});


//Prints the error
app.use('/select', function(err, request, response, next){
    console.log(err);
    next(err);
});


//It's the error handling routine which sends back error message (and halts) if there's error
app.use('/select', function(err, request, response, next){

    if (err.message.includes('Book not found!!!')){
    response.writeHead(400, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>File not Found!!</h2></body></html>')}

    else{
        next(err);
    }

});

// If the error is not handled by any previous function, you reach here
app.use(function(request, response){

    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Server Error</h2></body></html>')
});


// this function is to handle an unhandled error that has occured somewhere
app.use(function(err, request, response, next){
    console.log(err);
    response.writeHead(500, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Internal Server Error</h2></body></html>');
});


// Here, the app listens at port 3000
var http = http.createServer(app);
http.listen(3000);
