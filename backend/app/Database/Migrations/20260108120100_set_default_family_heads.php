<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SetDefaultFamilyHeads extends Migration
{
    public function up()
    {
        // Set is_head_of_family = true for all members where member_order = 1
        $this->db->query("
            UPDATE members 
            SET is_head_of_family = true 
            WHERE member_order = 1
        ");
        
        // Set is_head_of_family = false for all other members (where it's NULL or member_order != 1)
        $this->db->query("
            UPDATE members 
            SET is_head_of_family = false 
            WHERE member_order != 1 OR member_order IS NULL
        ");
    }

    public function down()
    {
        // Reset all to false
        $this->db->query("UPDATE members SET is_head_of_family = false");
    }
}
