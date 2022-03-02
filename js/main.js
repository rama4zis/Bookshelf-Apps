var bookData = [];

// get data from input 
function getBookData() {
    var bookInput = {
        id: +new Date(),
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        year: parseInt(document.getElementById("year").value),
        isComplete: document.getElementById("isComplete").checked,
    };
    bookData.push(bookInput);

    saveData(bookData);

    // clear input value 
    clearInput();

    // return last data
    renderBook(bookData[bookData.length - 1]);
}

// clear input value
function clearInput() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("year").value = "";
    document.getElementById("isComplete").checked = false;
}

// template render book data to element
function renderBook(datas) {

    if (datas.title) { // if data just 1 obj
        var id = datas.id;
        var title = datas.title;
        var author = datas.author;
        var year = datas.year;
        var isComplete = datas.isComplete;

        var bookTemplate = `
            <div class="book">
                <div class="id">` + id + `</div>
                <div class="title">` + title + `</div>
                <div class="author">` + author + `</div>
                <div class="year">` + year + `</div>
                <div class="hidden" id="alreadyRead">` + isComplete + `</div>

                <div class="button-wrap-book">
                <button class="book-button button already-read" id="` + id + `" onclick="moveShelfbook(this.id)">MOVE</button>
                    <button class="button book-button" id="` + id + `" onclick="deleteBookData(this.id)">DELETE</button>
                </div>
            </div>
            `;

        // render book to bookshelf 
        if (isComplete == true) {
            document.getElementById("done-read").innerHTML += bookTemplate;
        }else {
            document.getElementById("unread").innerHTML += bookTemplate;
        }
    } else {
        // get object data 
        for (book of datas) {
            // console.log(book);
            var id = book.id;
            var title = book.title;
            var author = book.author;
            var year = book.year;
            var isComplete = book.isComplete;

            var bookTemplate = `
            <div class="book">
                <div class="id">` + id + `</div>
                <div class="title">` + title + `</div>
                <div class="author">` + author + `</div>
                <div class="year">` + year + `</div>
                <div class="hidden" id="alreadyRead">` + isComplete + `</div>

                <div class="button-wrap-book">
                <button class="book-button button already-read" id="` + id + `" onclick="moveShelfbook(this.id)">MOVE</button>
                    <button class="button book-button" id="` + id + `" onclick="deleteBookData(this.id)">DELETE</button>
                </div>
            </div>
            `;

            // render book to bookshelf 
            if (isComplete == true) {
                document.getElementById("done-read").innerHTML += bookTemplate;
            }else {
                document.getElementById("unread").innerHTML += bookTemplate;
            }
        }
    }



}

// Save data to local storage
function saveData(data) {
    localStorage.setItem("bookData", JSON.stringify(data));
}

// Render data from local storage
function localStorageRender() {
    var localBookData = JSON.parse(localStorage.getItem("bookData"));
    renderBook(localBookData);
}

// when submit button clicked add book data
document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    getBookData();
});

// Srach button clicked
document.getElementById("search").addEventListener("submit", function (e) {
    e.preventDefault();
    data = document.getElementById("search-title").value
    searchBook(data);
    console.log("search this "+data);
});

// renew data book from local storage 
function renewData(id) {
    // update bookData var 
    newBookData = [];
    for (var i = 0; i < bookData.length; i++) {
        if (bookData[i].id != id) {
            newBookData.push(bookData[i]);
        }else{
            // change status to true 
            newBookData.push({
                id: bookData[i].id,
                title: bookData[i].title,
                author: bookData[i].author,
                year: bookData[i].year,
                isComplete: !bookData[i].isComplete,
            });
        }
    }
    // console.log(newBookData);

    bookData = newBookData;
    saveData(bookData);
}

// ============ MOVE BOOK TO ALREADY READ ============

function moveShelfbook(id) {
    var book = document.getElementById(id).parentElement.parentElement;
    // console.log(book);
    var check = book.querySelector("#alreadyRead").innerHTML;
    // reverse check 
    var validation = (check == "true") ? !true : !false;
    var bookData = {
        id: book.querySelector(".id").innerHTML,
        title: book.querySelector(".title").innerHTML,
        author: book.querySelector(".author").innerHTML,
        year: parseInt(book.querySelector(".year").innerHTML),
        isComplete: validation,
    };
    // console.log(bookData);
    renderBook(bookData);
    deleteBookElement(book);
    
    // renew data book
    renewData(id);
    
    
}

function deleteBookElement(book) {
    book.remove();
}

function deleteBookData(id) {
    // update bookData var
    newBookData = [];
    for (var i = 0; i < bookData.length; i++) {
        if (bookData[i].id != id) {
            newBookData.push(bookData[i]);
        }
    }
    bookData = newBookData;
    saveData(bookData);

    // remove book element 
    deleteBookElement(document.getElementById(id).parentElement.parentElement);
}

function searchBook(title) {
    // var search = document.getElementById("search-title").value;
    var searchResult = [];
    for (var i = 0; i < bookData.length; i++) {
        if (bookData[i].title.toLowerCase() == title.toLowerCase()) {
            searchResult.push(bookData[i]);
        }
    }
    // hidden all book
    var books = document.getElementsByClassName("book");
    for (var i = 0; i < books.length; i++) {
        books[i].style.display = "none";
    }

    // if title empty, show all bookData 
    if (title == "") {
        renderBook(bookData);
    }else{
    // console.log(searchResult);
    renderBook(searchResult);
    }
}

// All Document loaded
document.addEventListener("DOMContentLoaded", function () {
    // local storage check 
    if (localStorage.getItem("bookData") != null) {
        bookData = JSON.parse(localStorage.getItem("bookData"));
        // localStorageRender();
        renderBook(bookData);
    }
});
