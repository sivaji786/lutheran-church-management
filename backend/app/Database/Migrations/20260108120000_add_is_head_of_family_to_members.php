<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddIsHeadOfFamilyToMembers extends Migration
{
    public function up()
    {
        $this->forge->addColumn('members', [
            'is_head_of_family' => [
                'type' => 'BOOLEAN',
                'default' => false,
                'null' => false,
                'after' => 'member_order'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('members', 'is_head_of_family');
    }
}
