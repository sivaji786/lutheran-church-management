<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class Maintenance extends BaseController
{
    use ResponseTrait;

    public function reformatMemberCodes()
    {
        // Security check: only superadmins allowed
        $user = $this->request->user ?? null;
        if (!$user || $user['is_superadmin'] !== 'yes') {
            return $this->failForbidden('Only superadmins can perform this action');
        }

        $db = \Config\Database::connect();
        $members = $db->table('members')->get()->getResultArray();

        $updatedCount = 0;
        $fixedTicketsCount = 0;
        $fixedOfferingsCount = 0;

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
                    continue;
                }
            }

            $newCode = "LCH-" . str_pad($serial, 4, '0', STR_PAD_LEFT) . "-" . $order;

            if ($oldCode !== $newCode) {
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

        // Third pass: Pattern-based fix for orphaned records
        $tables = ['offerings', 'tickets'];
        foreach ($tables as $table) {
            $records = $db->table($table)->like('member_code', 'LCH', 'after')->get()->getResultArray();
            foreach ($records as $record) {
                $oldCode = $record['member_code'];
                if (preg_match('/^LCH[0-9]+$/i', $oldCode)) {
                    if (preg_match('/LCH(\d+)/i', $oldCode, $matches)) {
                        $num = (int)$matches[1];
                        $newCode = "LCH-" . str_pad($num, 4, '0', STR_PAD_LEFT) . "-1";
                        $db->table($table)->where('id', $record['id'])->update(['member_code' => $newCode]);
                        if ($table === 'tickets') $fixedTicketsCount++;
                        if ($table === 'offerings') $fixedOfferingsCount++;
                    }
                }
            }
        }

        return $this->respond([
            'success' => true,
            'message' => 'Member codes reformatted and synchronized successfully',
            'data' => [
                'updatedMembers' => $updatedCount,
                'fixedTickets' => $fixedTicketsCount,
                'fixedOfferings' => $fixedOfferingsCount
            ]
        ]);
    }
}
