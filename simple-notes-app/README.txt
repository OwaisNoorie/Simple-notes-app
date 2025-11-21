Simple Notes App
=================

This is a very simple full-stack notes application built with:
- HTML, CSS, JavaScript (frontend)
- PHP (backend)
- MySQL (database)

Features:
- Add a note (title + text)
- List all notes
- Edit an existing note
- Delete a note

------------------------------------
1. Database Setup (MySQL)
------------------------------------

1. Open phpMyAdmin (usually at http://localhost/phpmyadmin).
2. Go to the SQL tab and run the following commands:

   CREATE DATABASE simple_site;

   USE simple_site;

   CREATE TABLE notes (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(100) NOT NULL,
       body TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

3. Make sure the credentials in api.php match your MySQL settings:
   - host: localhost
   - user: root
   - password: (empty by default in XAMPP)
   - database: simple_site

------------------------------------
2. Installation / Running
------------------------------------

1. Copy the folder "simple-notes-app" into your web server's root folder:
   - For XAMPP on Windows: C:\xampp\htdocs\simple-notes-app

2. Start Apache and MySQL from the XAMPP Control Panel.

3. In your browser, open:
   http://localhost/simple-notes-app/index.html

You should be able to:
- Add a note from the form
- See it appear in the notes list
- Edit or delete notes using the buttons on each card
