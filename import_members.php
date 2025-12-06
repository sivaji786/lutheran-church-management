<?php

// Database configuration
$host = 'localhost';
$db   = 'lutheran_church_main';
$user = 'root';
$pass = 'root'; // Updated from .env
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

// 1. Update Schema if columns don't exist
echo "Checking schema...\n";
$columns = [
    'family_id' => 'INT DEFAULT NULL COMMENT "From CSV MemberSerialNum"',
    'member_serial_num' => 'INT DEFAULT NULL COMMENT "From CSV MemberSerialNum (Explicit)"',
    'member_order' => 'INT DEFAULT NULL COMMENT "From CSV FamilySerialNum"',
    'head_of_family' => 'VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT "From CSV Address1"'
];

foreach ($columns as $col => $def) {
    try {
        $pdo->query("SELECT $col FROM members LIMIT 1");
        echo "Column $col already exists.\n";
    } catch (Exception $e) {
        echo "Adding column $col...\n";
        $pdo->exec("ALTER TABLE members ADD COLUMN $col $def");
    }
}

// 2. Truncate Table
echo "Truncating members table...\n";
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
$pdo->exec("TRUNCATE TABLE members");
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

// 3. Read CSV
$csvFile = 'lutheran_data.csv';
if (!file_exists($csvFile)) {
    die("CSV file not found: $csvFile\n");
}

$file = fopen($csvFile, 'r');
$header = fgetcsv($file); // Skip header

// Helper function for UUID
function generate_uuid() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// Helper to clean data
function clean($data) {
    $data = trim($data);
    if (strtolower($data) === 'nodata' || $data === '' || $data === '-') {
        return null;
    }
    return $data;
}

// Helper for dates
function parseDate($dateStr) {
    $dateStr = clean($dateStr);
    if (!$dateStr) return null;
    
    // Try d/m/Y
    $d = DateTime::createFromFormat('d/m/Y', $dateStr);
    if ($d && $d->format('d/m/Y') === $dateStr) {
        return $d->format('Y-m-d');
    }
    
    // Try d/m/Y/ (trailing slash seen in data)
    $d = DateTime::createFromFormat('d/m/Y/', $dateStr);
    if ($d) {
        return $d->format('Y-m-d');
    }

    // Try d/m/ (incomplete date) - Default to 1st of Jan or similar? 
    // Or just return NULL if invalid.
    // Let's try to be lenient.
    return null; 
}

// Helper for Yes/No
function parseBool($val) {
    $val = strtolower(clean($val) ?? '');
    return ($val === 'yes') ? 1 : 0;
}

// Helper for Resident
function parseResident($val) {
    $val = strtolower(clean($val) ?? '');
    return (strpos($val, 'non-resident') !== false) ? 0 : 1;
}

// Get last member code number
$stmt = $pdo->query("SELECT member_code FROM members WHERE member_code LIKE 'LCH%' ORDER BY LENGTH(member_code) DESC, member_code DESC LIMIT 1");
$lastCode = $stmt->fetchColumn();
$nextNum = 1;
if ($lastCode) {
    $nextNum = (int)substr($lastCode, 3) + 1;
}

echo "Starting import...\n";
$count = 0;
$passwordHash = password_hash('Member@123', PASSWORD_BCRYPT);

$stmtInsert = $pdo->prepare("
    INSERT INTO members (
        id, member_code, name, occupation, date_of_birth, 
        baptism_status, confirmation_status, marital_status, residential_status,
        aadhar_number, mobile, address, area, ward, 
        member_status, password, registration_date,
        family_id, member_serial_num, member_order, head_of_family
    ) VALUES (
        ?, ?, ?, ?, ?, 
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        'confirmed', ?, CURDATE(),
        ?, ?, ?, ?
    )
");

while (($row = fgetcsv($file)) !== false) {
    // Mapping based on CSV structure (0-indexed)
    // 0: MemberSerialNum -> family_id AND member_serial_num
    // 1: Address1 -> head_of_family
    // 2: Address2 
    // 3: Address3 -> address (combined)
    // 4: Area
    // 5: Ward
    // 6: FamilySerialNum -> member_order
    // 7: Full Name
    // 8: Occupation
    // 9: DOB
    // 10: Baptism
    // 11: Confirmation
    // 12: Marital
    // 13: Aadhar
    // 14: Resident
    // 15: Mobile

    $family_id = clean($row[0]);
    $member_serial_num = clean($row[0]); // Explicitly requested
    $head_of_family = clean($row[1]);
    $address2 = clean($row[2]);
    $address3 = clean($row[3]);
    $address = trim("$address2, $address3", ", ");
    $area = clean($row[4]);
    $ward = clean($row[5]);
    $member_order = clean($row[6]);
    $name = clean($row[7]);
    $occupation = clean($row[8]);
    $dob = parseDate($row[9]);
    $baptism = parseBool($row[10]);
    $confirmation = parseBool($row[11]);
    $marital = parseBool($row[12]);
    $aadhar = clean($row[13]);
    $resident = parseResident($row[14]);
    $mobile = clean($row[15]);
    
    // Generate Code
    // Formula: "LC" + "-" + "member_serial_number" + "-" +"family_id" (member_order)
    // Example: LC-0004-1
    $serial = str_pad($member_serial_num, 4, '0', STR_PAD_LEFT);
    $member_code = "LCH-{$serial}-{$member_order}";
    $id = generate_uuid();

    // Fallback for DOB if null (Schema says NOT NULL)
    if (!$dob) $dob = '1900-01-01'; 

    // Fallback for Mobile if null (Schema says NOT NULL)
    if (!$mobile) $mobile = '0000000000';

    // Fallback for Name
    if (!$name) $name = 'Unknown';

    try {
        $stmtInsert->execute([
            $id, $member_code, $name, $occupation, $dob,
            $baptism, $confirmation, $marital, $resident,
            $aadhar, $mobile, $address, $area, $ward,
            $passwordHash,
            $family_id, $member_serial_num, $member_order, $head_of_family
        ]);
        $count++;
        echo "Imported: $name ($member_code)\n";
    } catch (Exception $e) {
        echo "Error importing $name: " . $e->getMessage() . "\n";
    }
}

fclose($file);
echo "Import completed. Total records: $count\n";
