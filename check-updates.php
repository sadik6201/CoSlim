<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Read version data
$versionData = json_decode(file_get_contents('data-version.txt'), true);

if (!$versionData) {
    $versionData = [
        'version' => 0,
        'timestamp' => date('c')
    ];
}

echo json_encode($versionData); 