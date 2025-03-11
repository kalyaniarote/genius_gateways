<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$filename = "news.json";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (file_exists($filename)) {
        echo file_get_contents($filename);
    } else {
        echo json_encode([]);
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $news = json_decode(file_get_contents("php://input"), true);
    
    if ($news) {
        $existingNews = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];
        $existingNews[] = $news;
        file_put_contents($filename, json_encode($existingNews, JSON_PRETTY_PRINT));
        echo json_encode(["message" => "News added successfully"]);
    } else {
        echo json_encode(["error" => "Invalid news data"]);
    }
}
?>
