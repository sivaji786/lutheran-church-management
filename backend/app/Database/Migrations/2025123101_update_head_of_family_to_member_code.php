<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateHeadOfFamilyToMemberCode extends Migration
{
    public function up()
    {
        // Update head_of_family to store member_code instead of name
        // For each family (grouped by member_serial_num), set head_of_family to the member_code
        // of the member with member_order = 1
        
        $db = \Config\Database::connect();
        
        // Get all unique family serial numbers
        $query = $db->query("
            SELECT DISTINCT member_serial_num 
            FROM members 
            WHERE member_serial_num IS NOT NULL
        ");
        
        $families = $query->getResultArray();
        
        foreach ($families as $family) {
            $serialNum = $family['member_serial_num'];
            
            // Find the head of family (member_order = 1) for this family
            $headQuery = $db->query("
                SELECT member_code 
                FROM members 
                WHERE member_serial_num = ? 
                AND member_order = 1 
                LIMIT 1
            ", [$serialNum]);
            
            $head = $headQuery->getRow();
            
            // If no member with order 1, get the earliest created member
            if (!$head) {
                $headQuery = $db->query("
                    SELECT member_code 
                    FROM members 
                    WHERE member_serial_num = ? 
                    ORDER BY created_at ASC 
                    LIMIT 1
                ", [$serialNum]);
                
                $head = $headQuery->getRow();
            }
            
            // Update all members in this family to have the correct head_of_family
            if ($head && isset($head->member_code)) {
                $db->query("
                    UPDATE members 
                    SET head_of_family = ? 
                    WHERE member_serial_num = ?
                ", [$head->member_code, $serialNum]);
            }
        }
        
        // Update column comment to clarify it stores member_code
        $db->query("
            ALTER TABLE members 
            MODIFY COLUMN head_of_family VARCHAR(20) 
            COMMENT 'Member code of the head of family (e.g., LCH-0001-1)'
        ");
    }

    public function down()
    {
        // Reverting this migration would require storing the original names,
        // which we don't have. So we'll just clear the column.
        $db = \Config\Database::connect();
        
        $db->query("
            UPDATE members 
            SET head_of_family = NULL
        ");
        
        // Remove the comment
        $db->query("
            ALTER TABLE members 
            MODIFY COLUMN head_of_family VARCHAR(255)
        ");
    }
}
