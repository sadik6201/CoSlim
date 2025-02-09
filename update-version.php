<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $version = $data['version'];
    $timestamp = $data['timestamp'];
    
    // Store both version and timestamp
    $versionData = [
        'version' => $version,
        'timestamp' => $timestamp
    ];
    
    // Save to file
    file_put_contents('data-version.txt', json_encode($versionData));
    
    echo json_encode(['success' => true]);
} 