<?php
require_once 'auth.php';
require_once 'config.php';
header('Content-Type: application/json');

requireLogin();

$stmt = $pdo->query("SELECT * FROM ban_logs ORDER BY timestamp DESC");
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($logs);
