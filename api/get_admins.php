<?php
require_once 'config.php';
header('Content-Type: application/json');

$stmt = $pdo->query("SELECT id, username, created_at FROM admins ORDER BY created_at DESC");
$admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($admins);
