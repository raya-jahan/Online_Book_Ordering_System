var path = require('path');
var express = require('express');
var http = require('http');
var app = express();


//Path to the files
//Making it static to be able to use it throughout the app and it remains in memory
var welcome = path.resolve(__dirname, 'Pages');
app.use(express.static(welcome));


// Get model functions
var support = require("./model/model.js");


//The Home page, where you select books
app.get('/', function(request, response){
    response.sendFile('book.html', {root: welcome});
});


//First step; get and parse the order information, adding to the request
app.get('/order', function(request,response, next){
    request.order = support.createOrder(
        request.query.customer,
        request.query.copies, 
        request.query.books
    );

    next();
});


// Books ordered. Step 2: Validate form elements.
app.get("/order", function(request, response, next) {
    var errors = support.validateOrder(request.order);
    if (errors.length > 0) {
        next(new Error("validation"));
    }
    else {
        next();
    }
});


//Books ordered. 3rd step; Compute the price
app.get('/order', function(request, response, next){
    request.order = support.addCost(request.order);
    next();

});





//4th step; Displaying the result
app.use('/order', function(request, response){

    response.writeHead(200, {'Content-type': 'text/html'});
    response.end('<html><body><h3>Thank you for your order of '
        +request.order.copies+' copies of '+request.order.title+
        '.<br>At $'+support.getPrice(request.order.ISBN)+
        ' per copy, your total bill is $'+request.order.total+
        ' with tax.</h3></body></html>');
    
});


// Displaying the errors; If a validation error occured, send the error messages back as a response.
app.use("/order", function(err, request, response, next) {
    var errors = support.validateOrder(request.order);
    if (err.message.includes("validation")) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        var message = "<html><body><p>The following errors were found:<ul>"
        for (let error of errors) {
            message += "<li>"+error +"</li>";
            }    
        response.end(message+'</ul> Press the BACK button and try again!</p></body></html>');
    }
    else {
        next(err);
    }
});


// If the error is not handled by any previous function, you reach here
app.use(function(request, response){

    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>File Not Found! </h2></body></html>')
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
