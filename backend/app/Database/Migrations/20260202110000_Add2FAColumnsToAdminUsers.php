<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Add2FAColumnsToAdminUsers extends Migration
{
    public function up()
    {
        $fields = [
            'two_factor_code' => [
                'type'       => 'VARCHAR',
                'constraint' => '6',
                'null'       => true,
                'after'      => 'locked_until'
            ],
            'two_factor_expires_at' => [
                'type'  => 'DATETIME',
                'null'  => true,
                'after' => 'two_factor_code'
            ],
        ];
        $this->forge->addColumn('admin_users', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('admin_users', ['two_factor_code', 'two_factor_expires_at']);
    }
}
