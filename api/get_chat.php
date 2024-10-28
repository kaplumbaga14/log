<?php
require_once 'auth.php';
require_once 'config.php';
header('Content-Type: application/json');

requireLogin();

$stmt = $pdo->query("SELECT * FROM chat_logs ORDER BY timestamp DESC LIMIT 100");
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($logs);
