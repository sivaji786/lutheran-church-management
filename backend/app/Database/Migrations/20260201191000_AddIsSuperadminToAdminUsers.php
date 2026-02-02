<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddIsSuperadminToAdminUsers extends Migration
{
    public function up()
    {
        $this->forge->addColumn('admin_users', [
            'is_superadmin' => [
                'type'       => 'VARCHAR',
                'constraint' => '10',
                'default'    => 'no',
                'after'      => 'role'
            ],
        ]);

        // Update existing admin to 'yes'
        $db = \Config\Database::connect();
        $db->table('admin_users')
           ->where('username', 'admin')
           ->update(['is_superadmin' => 'yes']);
    }

    public function down()
    {
        $this->forge->dropColumn('admin_users', 'is_superadmin');
    }
}
