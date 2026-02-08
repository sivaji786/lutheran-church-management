<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateActivityLogsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'admin_id' => [
                'type' => 'VARCHAR',
                'constraint' => 36, // UUID
                'null' => true,
            ],
            'admin_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'module' => [
                'type' => 'VARCHAR',
                'constraint' => 50, // e.g., 'Members', 'Offerings'
            ],
            'action' => [
                'type' => 'VARCHAR',
                'constraint' => 50, // e.g., 'Create', 'Update', 'Delete'
            ],
            'target_id' => [
                'type' => 'VARCHAR',
                'constraint' => 255, // ID of the affected record
                'null' => true,
            ],
            'details' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'ip_address' => [
                'type' => 'VARCHAR',
                'constraint' => 45,
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('module');
        $this->forge->addKey('action');
        $this->forge->addKey('created_at');
        $this->forge->createTable('activity_logs');
    }

    public function down()
    {
        $this->forge->dropTable('activity_logs');
    }
}
