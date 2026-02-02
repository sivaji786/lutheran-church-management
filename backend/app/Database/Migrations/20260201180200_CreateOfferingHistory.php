<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOfferingHistory extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'offering_id' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'amount' => [
                'type' => 'DECIMAL',
                'constraint' => '15,2',
            ],
            'offer_type' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'payment_mode' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'cheque_number' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
            'transaction_id' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'receipt_number' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'date' => [
                'type' => 'DATE',
            ],
            'edited_by' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('offering_id');
        $this->forge->createTable('offering_history');
    }

    public function down()
    {
        $this->forge->dropTable('offering_history');
    }
}
