<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class ReformatMemberCodes extends BaseCommand
{
    protected $group       = 'Maintenance';
    protected $name        = 'member:reformat';
    protected $description = 'Reformats member codes to LCH-XXXX-X and synchronizes across tables';

    public function run(array $params)
    {
        $db = \Config\Database::connect();
        $members = $db->table('members')->get()->getResultArray();

        CLI::write("Processing " . count($members) . " members...", 'yellow');

        $updatedCount = 0;
        foreach ($members as $member) {
            $oldCode = $member['member_code'];
            $id = $member['id'];
            $serial = $member['member_serial_num'];
            $order = $member['member_order'];

            // If serial or order is missing, try to derive from old code if possible
            if (empty($serial) || empty($order)) {
                if (preg_match('/LCH(\d+)/i', $oldCode, $matches)) {
                    $serial = (int)$matches[1];
                    $order = 1;
                } else {
                    CLI::error("Could not derive serial/order for member: $oldCode (ID: $id)");
                    continue;
                }
            }

            $newCode = "LCH-" . str_pad($serial, 4, '0', STR_PAD_LEFT) . "-" . $order;

            if ($oldCode !== $newCode) {
                CLI::write("Updating $oldCode -> $newCode", 'cyan');

                // Update member
                $db->table('members')->where('id', $id)->update([
                    'member_code' => $newCode,
                    'member_serial_num' => $serial,
                    'member_order' => $order
                ]);

                // Update offerings
                $db->table('offerings')->where('member_id', $id)->update(['member_code' => $newCode]);

                // Update tickets
                $db->table('tickets')->where('member_id', $id)->update(['member_code' => $newCode]);

                $updatedCount++;
            } else {
                // Even if code is same, ensure offerings/tickets are in sync
                $db->table('offerings')->where('member_id', $id)->update(['member_code' => $newCode]);
                $db->table('tickets')->where('member_id', $id)->update(['member_code' => $newCode]);
            }
        }

        // Second pass: Update head_of_family references
        CLI::write("Syncing head_of_family references...", 'yellow');
        foreach ($members as $member) {
            $serial = $member['member_serial_num'];
            if (empty($serial)) continue;

            $head = $db->table('members')
                       ->where('member_serial_num', $serial)
                       ->where('member_order', 1)
                       ->get()
                       ->getRowArray();

            if ($head) {
                $db->table('members')
                   ->where('member_serial_num', $serial)
                   ->update(['head_of_family' => $head['member_code']]);
            }
        }

        // Third pass: Brute force fix for orphaned/remaining malformed codes in offerings/tickets
        CLI::write("Performing pattern-based fix for remaining malformed codes...", 'yellow');
        $tables = ['offerings', 'tickets'];
        foreach ($tables as $table) {
            $records = $db->table($table)->like('member_code', 'LCH', 'after')->get()->getResultArray();
            foreach ($records as $record) {
                $oldCode = $record['member_code'];
                // Only fix if it matches LCH followed by numbers (old format)
                if (preg_match('/^LCH[0-9]+$/i', $oldCode)) {
                    if (preg_match('/LCH(\d+)/i', $oldCode, $matches)) {
                        $num = (int)$matches[1];
                        $newCode = "LCH-" . str_pad($num, 4, '0', STR_PAD_LEFT) . "-1";
                        $db->table($table)->where('id', $record['id'])->update(['member_code' => $newCode]);
                        CLI::write("Fixed $table [{$record['id']}]: $oldCode -> $newCode", 'cyan');
                    }
                }
            }
        }

        CLI::write("Finished! Updated $updatedCount member codes.", 'green');
    }
}
