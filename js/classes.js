// Book Class
class Book{
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

// UI Class
class UI{
	// Add book to list
	addBookToList(book){
		// Get list
		const list = document.getElementById('book-list');
		// Create tr element
		const row = document.createElement('tr');
		// Insert cols
		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="delete">&times;</a></td></td>`;
		// Insert row to list
		list.appendChild(row);
	}

	// Show alert
	showAlert(message, className) {
		// Create div
		const div = document.createElement('div');
		// Add class
		div.className = `alert ${className}`;
		// Add text
		div.appendChild(document.createTextNode(message));
		// Get parent
		const container = document.querySelector('.container');
		// Get form
		const form = document.querySelector('#book-form');
		// Insert div before form
		container.insertBefore(div, form);
		// Timeout after 3 second
		setTimeout(function(){
			document.querySelector('.alert').remove();
		}, 3000);
	}

	// Clear form fields
	clearFormFields(){
		document.getElementById('title').value = '';
		document.getElementById('author').value = '';
		document.getElementById('isbn').value = '';
	}

	// Delete book
	deleteBook(target){
		if (target.className === 'delete') {
			// Delete tr element from DOM
			target.parentElement.parentElement.remove();
		}
	}
}

// Class for localStorage
class Store{
	// Get books from localStorage
	static getBooks(){
		let books;
		// If LS empty init empty array
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			// Get items as array of objects
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	// Display books
	static displayBooks(){
		const books = Store.getBooks();
		// Display books list from LS
		books.forEach(function(book){
			const ui = new UI;
			ui.addBookToList(book);
		});
	}

	// Add book to localStorage
	static addBook(book){
		const books = Store.getBooks();
		// Add new book to current books array
		books.push(book);
		// Update books array in LS
		localStorage.setItem('books', JSON.stringify(books));
	}

	// Remove book from localStorage
	static removeBook(isbn){
		const books = Store.getBooks();
		books.forEach(function(book, index){
			// Delete book if current ISBN from array is the same from DOM
			if(book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		// Update books array in LS
		localStorage.setItem('books', JSON.stringify(books));
	}
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e){
	// Get form values
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const isbn = document.getElementById('isbn').value;
	// Instantiate Book
	const book = new Book(title, author, isbn);
	// Instantiate UI
	const ui = new UI();
	// Validate
	if (title === '' || author === '' || isbn === '') {
		// Error alert
		ui.showAlert('Please fill in all fields', 'error');
	} else {
		// Add book to list
		ui.addBookToList(book);
		// Add to LS
		Store.addBook(book);
		// Show success alert
		ui.showAlert('Book Added!', 'success');
		// Clear form fields
		ui.clearFormFields();
	}
	e.preventDefault();
});

// Event Listener for delete book
document.getElementById('book-list').addEventListener('click', function(e){
	// Instantiate UI
	const ui = new UI();
	// Delete book from DOM
	ui.deleteBook(e.target);
	// Delete book from LS based on ISBN value
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
	// Show alert
	ui.showAlert('Book Removed!', 'success');
	// Prevent default
	e.preventDefault();
});