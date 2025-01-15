//bookslist
function getBooksList(){

    const booksList = [
        //{ISBN: "0", title: "0", price: 0, image: "0"},
        {ISBN: "978-0486853642", title: "A farewell to arms (Dover Thrift Editions)", price: 12, image: "978-0486853642.jpg"},
        {ISBN: "978-0063297494", title: "Big two-hearted river", price: 16.69, image: "978-0063297494.jpg"  },
        {ISBN: "978-1416591313", title: "A Moveable Feast: The Restored Edition", price: 12, image: "978-1416591313.jpg" },
        
        ];

        return booksList;
    }


//Getting the Books list by specific ISBN number    
function getBooksByISBN(ISBN){
    var bookList = getBooksList();

    for (let book of bookList){
        if (ISBN === book.ISBN){
            return book;
        }
    }
}

//Getting the price of books
function getPrice(ISBN){

    var price = 0;
    var books = getBooksByISBN(ISBN);
    
    price = books.price;
    return price;

    

}

// Converting raw inputs into an order
function createOrder(customer, copies, books) {
    var order = {};
    order.customer = customer.trim();
    order.copiesString = copies.trim(); // For redisplay
    order.copies = parseInt(copies.trim()); // Get the copies and parse to a number
    order.ISBN = books;                          // Get the ISBN
    
    
    
    // Get title from ISBN for receipt page
    var book =  getBooksByISBN(order.ISBN);
    if (book) {  
        order.title = getBooksByISBN(order.ISBN).title;
        order.image = getBooksByISBN(order.ISBN).image;
        order.price = getBooksByISBN(order.ISBN).price;
    }
    return order;
}

// Validate order, returning list of errors. 
function validateOrder(order) {
    var errors = {}; 

    // Validate customer field (must not be empty)
    if (order.customer === "") {  
        errors.CustomerMissing = true;
    }

    // Validate copies field (must be number at least 1)
    if (isNaN(order.copies) || order.copies < 1 || order.copies === "") {    
        errors.CopiesIllegal = true;        
    }

    // Validate books (must be ISBN in entity list); order.ISBN === "0"
    if ( !getBooksByISBN(order.ISBN)) { 
        
        errors.BookMissing = true;
    }

    return errors;
}


//Adding total cost to order
function addCost(order){
    order.total = (getPrice(order.ISBN) * order.copies * 1.0175).toFixed(2);
    return order;
};

//Compute total from list of order
function getTotal(orders){
    var total = 0;
    for (let order of orders){
        total += order.total;
    }
    return total;
}


function getPrevious(order) {
    var previous = {}; // New (empty) object
    if (!order) { // No previous order so display defaults    
        previous.copies = "0"; // Default quantity is 0
        
        previous.book = getBooksList();     // Display initial list of books with none selected
    }
    else {  // Redisplay existing values 
        previous.customer = order.customer; // Just show customer again
        previous.copies = order.copiesString; // Redisplay original number of copies in form
        


        var boo = getBooksList(); // Get copy of book list    
        for (let book of boo) {
            if (order.ISBN === book.ISBN) { // Search for book matching id of previous selection
                book.selected = "selected";  // Insert selected into option of selected book
            }
            else {
                book.selected = ""; 
            }        
        }
        previous.book = boo;
    }
    return previous;
}

//Make function available publicly
module.exports = {getBooksList, getBooksByISBN, getPrice, createOrder, validateOrder, addCost, getTotal, getPrevious};
