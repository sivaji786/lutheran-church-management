<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCoverPaymentMode extends Migration
{
    public function up()
    {
        // Modify offerings table payment_mode ENUM to include 'Cover'
        $this->db->query("ALTER TABLE offerings MODIFY COLUMN payment_mode ENUM('Cash','UPI','Bank Transfer','Cheque','Card','Cover') NOT NULL");
        
        // Modify non_member_offerings table payment_mode ENUM to include 'Cover'
        $this->db->query("ALTER TABLE non_member_offerings MODIFY COLUMN payment_mode ENUM('Cash','UPI','Bank Transfer','Cheque','Card','Cover') NOT NULL");
    }

    public function down()
    {
        // Revert offerings table payment_mode ENUM to exclude 'Cover'
        $this->db->query("ALTER TABLE offerings MODIFY COLUMN payment_mode ENUM('Cash','UPI','Bank Transfer','Cheque','Card') NOT NULL");
        
        // Revert non_member_offerings table payment_mode ENUM to exclude 'Cover'
        $this->db->query("ALTER TABLE non_member_offerings MODIFY COLUMN payment_mode ENUM('Cash','UPI','Bank Transfer','Cheque','Card') NOT NULL");
    }
}
