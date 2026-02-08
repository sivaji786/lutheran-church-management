<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateMaritalStatusToString extends Migration
{
    public function up()
    {
        // 1. Add a temporary column
        $this->forge->addColumn('members', [
            'marital_status_new' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true,
                'after' => 'marital_status'
            ]
        ]);

        // 2. Migrate existing data
        $db = \Config\Database::connect();
        
        // Map 1 (true) to married
        $db->query("UPDATE members SET marital_status_new = 'married' WHERE marital_status = 1");
        
        // Map 0 (false) to unmarried
        $db->query("UPDATE members SET marital_status_new = 'unmarried' WHERE marital_status = 0 OR marital_status IS NULL");

        // 3. Drop the old column
        $this->forge->dropColumn('members', 'marital_status');

        // 4. Rename the new column to the original name
        $this->forge->modifyColumn('members', [
            'marital_status_new' => [
                'name' => 'marital_status',
                'type' => 'VARCHAR',
                'constraint' => 20,
                'default' => 'unmarried'
            ]
        ]);
    }

    public function down()
    {
        // 1. Add temporary column as tinyint
        $this->forge->addColumn('members', [
            'marital_status_old' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
                'after' => 'marital_status'
            ]
        ]);

        // 2. Migrate data back
        $db = \Config\Database::connect();
        $db->query("UPDATE members SET marital_status_old = 1 WHERE marital_status = 'married'");
        $db->query("UPDATE members SET marital_status_old = 0 WHERE marital_status != 'married'");

        // 3. Drop the string column
        $this->forge->dropColumn('members', 'marital_status');

        // 4. Rename back
        $this->forge->modifyColumn('members', [
            'marital_status_old' => [
                'name' => 'marital_status',
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0
            ]
        ]);
    }
}
