//bookslist
function getBooksList(){

    const booksList = [
        {ISBN: "0", title: "0", price: 0, image: "0"},
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
    order.copies = parseInt(copies.trim()); // Get the copies and parse to a number
    order.ISBN = books;                          // Get the ISBN
    
    
    // Get title from ISBN for receipt page
    var book =  getBooksByISBN(order.ISBN);
    if (book) {  
        order.title = getBooksByISBN(order.ISBN).title;  
    }
    return order;
}

// Validate order, returning list of errors. 
function validateOrder(order) {
    var errors = []; 

    // Validate customer field (must not be empty)
    if (order.customer === "") { 
        errors.push("Must give customer name for the order"); 
    }

    // Validate copies field (must be number at least 1)
    if (isNaN(order.copies) || order.copies < 1 || order.copies === "") {  
        errors.push("Must purchase at least one copy");           
    }

    // Validate books (must be ISBN in entity list)
    if (order.ISBN === "0" || !getBooksByISBN(order.ISBN)) { 
        errors.push("Must select a book!")
    }

    return errors;
}


//Adding total cost to order
function addCost(order){
    order.total = getPrice(order.ISBN) * order.copies * 1.0175;
    return order;
};

//Make function available publicly
module.exports = {getBooksList, getBooksByISBN, getPrice, createOrder, validateOrder, addCost };
