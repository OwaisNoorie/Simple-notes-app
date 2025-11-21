# Simple-notes-app
Created using HTML, CSS, JS and PhP for backend and MySQL for database


This project is a full-stack Notes App built using HTML, CSS, JavaScript, PHP, and MySQL. It allows users to add, view, edit, and delete notes, with all data stored in a database.
The frontend is made with HTML for structure, CSS for styling, and JavaScript for interactive actions. The main page (index.html) contains a form where users can enter a note title and text. When the user submits the form, JavaScript (script.js) sends the data to the backend using the fetch() API. JavaScript also loads all existing notes from the database and displays them dynamically. Each note card includes Edit and Delete buttons.
When a user clicks Edit, the note’s content is loaded back into the form, and the button changes to “Update Note.” A Cancel button allows the user to exit edit mode. When Delete is pressed, JavaScript asks for confirmation, then sends a delete request to the server.
The backend is handled by api.php, which communicates with a MySQL database. It includes the following actions:


action=list → fetch and return all notes.


action=add → insert a new note.


action=update → update an existing note using its ID.


action=delete → remove a note permanently.


The database contains one table:notes, which stores each note’s ID, title, body, and creation time.
To run the project, you simply place the folder inside XAMPP’s htdocs, create the database using the provided SQL commands, and visit the app in your browser.
This project demonstrates full-stack development skills, including UI design, dynamic JavaScript behavior, REST-like PHP APIs, and SQL database operations.
