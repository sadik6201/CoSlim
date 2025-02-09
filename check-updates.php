<?php
header('Content-Type: application/json');

// In a real implementation, this would check a database
// For now, we'll read from a file
$version = file_get_contents('data-version.txt');

echo json_encode([
    'version' => intval($version)
]); 