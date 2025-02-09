<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $version = $data['version'];
    
    // In a real implementation, this would update a database
    // For now, we'll write to a file
    file_put_contents('data-version.txt', strval($version));
    
    echo json_encode(['success' => true]);
} 