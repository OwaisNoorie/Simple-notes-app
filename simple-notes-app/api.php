<?php
// api.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 1. DB connection details – change if needed
$host = "localhost";
$user = "root";          // default in XAMPP
$pass = "";              // default is empty
$db   = "simple_site";

// 2. Connect to MySQL
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// 3. Decide action
$action = isset($_GET['action']) ? $_GET['action'] : 'list';

if ($action === 'list') {

    // Fetch all notes
    $sql = "SELECT id, title, body, created_at FROM notes ORDER BY created_at DESC";
    $result = $conn->query($sql);

    $notes = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }
    }

    echo json_encode($notes);

} elseif ($action === 'add' && $_SERVER['REQUEST_METHOD'] === 'POST') {

    // Add a new note
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $body  = isset($_POST['body'])  ? trim($_POST['body'])  : '';

    if ($title === '') {
        http_response_code(400);
        echo json_encode(["error" => "Title is required"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO notes (title, body) VALUES (?, ?)");
    $stmt->bind_param("ss", $title, $body);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to insert note"]);
    }

    $stmt->close();

} elseif ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {

    // Update an existing note
    $id    = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $body  = isset($_POST['body'])  ? trim($_POST['body'])  : '';

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid note ID"]);
        exit;
    }

    if ($title === '') {
        http_response_code(400);
        echo json_encode(["error" => "Title is required"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE notes SET title = ?, body = ? WHERE id = ?");
    $stmt->bind_param("ssi", $title, $body, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update note"]);
    }

    $stmt->close();

} elseif ($action === 'delete' && $_SERVER['REQUEST_METHOD'] === 'POST') {

    // Delete a note
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid note ID"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM notes WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete note"]);
    }

    $stmt->close();

} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action or request method"]);
}

$conn->close();
