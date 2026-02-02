<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddNotesToOfferings extends Migration
{
    public function up()
    {
        // Add notes column to offerings table
        $fields = [
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'payment_mode',
            ],
        ];
        
        $this->forge->addColumn('offerings', $fields);
    }

    public function down()
    {
        // Remove notes column
        $this->forge->dropColumn('offerings', 'notes');
    }
}
