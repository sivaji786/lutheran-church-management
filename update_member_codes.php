<?php

// Database configuration
$host = 'localhost';
$db   = 'lutheran_church_main';
$user = 'root';
$pass = 'root';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

echo "Updating member codes...\n";

// Fetch all members with serial number and order
$stmt = $pdo->query("SELECT id, member_serial_num, member_order FROM members WHERE member_serial_num IS NOT NULL AND member_order IS NOT NULL");
$members = $stmt->fetchAll();

$count = 0;
$stmtUpdate = $pdo->prepare("UPDATE members SET member_code = ? WHERE id = ?");

foreach ($members as $member) {
    $serial = str_pad($member['member_serial_num'], 4, '0', STR_PAD_LEFT);
    $order = $member['member_order'];
    $newCode = "LCH-{$serial}-{$order}";

    try {
        $stmtUpdate->execute([$newCode, $member['id']]);
        $count++;
        // echo "Updated member {$member['id']} to $newCode\n";
    } catch (Exception $e) {
        echo "Error updating member {$member['id']}: " . $e->getMessage() . "\n";
    }
}

echo "Updated $count members.\n";
