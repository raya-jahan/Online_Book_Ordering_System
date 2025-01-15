var path = require('path');
var express = require('express');
var http = require('http');
var exphandlebars = require('express-handlebars');

// Get the session handling middleware for express
const expressSession = require('express-session');

//Get model functions
var support = require("./model/model.js");

//Construct express object
var app = express();


//Setting up handlebars
var hndb = exphandlebars.create({defaultLayout: 'hellomain'});

app.engine('.handlebars', hndb.engine);
app.set('view engine', 'handlebars');
app.use(express.static('views'));


// Set its properties
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "0034fu0qwe9845paenu334yU",   // Secret key to sign session ID
    cookie: {maxAge: 600000}   // Session exprires in 600,000 ms (15 minutes)
}));

//Home page
app.get("/", function(request, response){
    response.render("books", {books: support.getBooksList(), customer: request.session.name});
});

//Books information page
app.get("/books", function(request, response){
    response.render("books", {books: support.getBooksList(), customer: request.session.name});
});


app.get("/orderform", function(request, response){
    
    response.render("orderformechoall", {previous: support.getPrevious(null)});
});



//Step 1: Get and parse order information, adding to the request
app.get("/order", function(request, response, next){
    request.order = support.createOrder(request.query.customer, request.query.copies, request.query.books);
    next();
});


//Books ordered. Step 2: Validate form elements.
app.get("/order", function(request, response, next) {
    var errors = support.validateOrder(request.order);
    if (Object.keys(errors).length === 0){
        next();
    }
    else{
        request.errorlist = errors;
        next(new Error("order"));
    }
});



//Step-2: books ordered. Compute the price
app.get("/order", function(request, response, next){
    request.order = support.addCost(request.order);
    next();
});


//Books ordered. Store the name
app.get("/order", function(request, response, next){
    request.session.name = request.order.customer;
    next();
});


//Step-3: Display order and total cost
app.get("/order", function(request, response){
    response.render("tablereceipt1", {order: request.order, customer: request.session.name});
});



//If "order" error, redisplay order form with error messages
app.use("/order", function(err, request, response, next){
    if (err.message.includes("order")){
        
        response.render("orderformechoall", {previous: support.getPrevious(request.order), errors: request.errorlist});
    }   
    else{
        next(err);
    }
});


//If the error is not handled by any previous function, you reach here
app.use(function(request, response){

    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>File Not Found! </h2></body></html>')
});


// this function is to handle an unhandled error that has occured somewhere
app.use(function(err, request, response, next){
    console.log(err);
    response.writeHead(500, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Server Error</h2></body></html>');
});


//If request not handled by any previous gets, send error page
app.use(function(request, response){
    response.render("404");
});


// Here, the app listens at port 3000
var http = http.createServer(app);
http.listen(3000);
