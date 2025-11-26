<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class Dashboard extends BaseController
{
    use ResponseTrait;

    public function stats()
    {
        $db = \Config\Database::connect();
        
        // Get member statistics
        $memberStats = $db->query("
            SELECT 
                COUNT(*) as total_members,
                SUM(CASE WHEN member_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_members,
                SUM(CASE WHEN member_status = 'unconfirmed' THEN 1 ELSE 0 END) as unconfirmed_members,
                SUM(CASE WHEN member_status = 'suspended' THEN 1 ELSE 0 END) as suspended_members,
                SUM(CASE WHEN YEAR(registration_date) = YEAR(CURDATE()) AND MONTH(registration_date) = MONTH(CURDATE()) THEN 1 ELSE 0 END) as new_this_month
            FROM members
        ")->getRowArray();
        
        // Get offering statistics
        $offeringStats = $db->query("
            SELECT 
                COUNT(*) as total_offerings,
                SUM(amount) as total_amount,
                AVG(amount) as average_amount,
                SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) THEN amount ELSE 0 END) as this_year_total,
                SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE()) THEN amount ELSE 0 END) as this_month_total
            FROM offerings
        ")->getRowArray();
        
        // Get ticket statistics
        $ticketStats = $db->query("
            SELECT 
                COUNT(*) as total_tickets,
                SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open_tickets,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tickets,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved_tickets,
                SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed_tickets
            FROM tickets
        ")->getRowArray();

        return $this->respond([
            'success' => true,
            'data' => [
                'members' => [
                    'total' => (int)($memberStats['total_members'] ?? 0),
                    'confirmed' => (int)($memberStats['confirmed_members'] ?? 0),
                    'unconfirmed' => (int)($memberStats['unconfirmed_members'] ?? 0),
                    'suspended' => (int)($memberStats['suspended_members'] ?? 0),
                    'newThisMonth' => (int)($memberStats['new_this_month'] ?? 0)
                ],
                'offerings' => [
                    'total' => (int)($offeringStats['total_offerings'] ?? 0),
                    'totalAmount' => (float)($offeringStats['total_amount'] ?? 0),
                    'averageAmount' => (float)($offeringStats['average_amount'] ?? 0),
                    'thisYearTotal' => (float)($offeringStats['this_year_total'] ?? 0),
                    'thisMonthTotal' => (float)($offeringStats['this_month_total'] ?? 0)
                ],
                'tickets' => [
                    'total' => (int)($ticketStats['total_tickets'] ?? 0),
                    'open' => (int)($ticketStats['open_tickets'] ?? 0),
                    'inProgress' => (int)($ticketStats['in_progress_tickets'] ?? 0),
                    'resolved' => (int)($ticketStats['resolved_tickets'] ?? 0),
                    'closed' => (int)($ticketStats['closed_tickets'] ?? 0)
                ]
            ]
        ]);
    }
}
