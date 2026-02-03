<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use Config\Services;

class EmailTest extends Controller
{
    public function index()
    {
        $email = Services::email();
        $emailConfig = new \Config\Email();

        $to = $this->request->getGet('to') ?? 'sivaji786@gmail.com';
        $protocol = $this->request->getGet('protocol') ?? $emailConfig->protocol;

        if ($protocol === 'mail') {
            $email->initialize(['protocol' => 'mail']);
        }

        $fromEmail = !empty($emailConfig->fromEmail) ? $emailConfig->fromEmail : 'noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $fromName = !empty($emailConfig->fromName) ? $emailConfig->fromName : 'AELC Church App Test';

        $email->setFrom($fromEmail, $fromName);
        $email->setTo($to);
        $email->setSubject('Email Test Connectivity');
        $email->setMessage('This is a test email to verify your ' . strtoupper($protocol) . ' settings. <br><br>Timestamp: ' . date('Y-m-d H:i:s'));

        echo "<h2>Email Test Tool</h2>";
        echo "<p>Attempting to send email to: <strong>$to</strong></p>";
        echo "<p>Using Protocol: <strong>$protocol</strong></p>";
        echo "<p>SMTP Host: <strong>" . ($emailConfig->SMTPHost ?: '(empty)') . "</strong></p>";
        echo "<p>SMTP User: <strong>" . ($emailConfig->SMTPUser ?: '(empty)') . "</strong></p>";
        echo "<p>From: <strong>$fromName &lt;$fromEmail&gt;</strong></p>";
        echo "<hr>";

        if ($email->send()) {
            echo "<h3 style='color: green;'>Success! Email sent successfully.</h3>";
        } else {
            echo "<h3 style='color: red;'>Failed! Email could not be sent.</h3>";
        }

        echo "<h4>Debug Information:</h4>";
        echo "<pre>" . $email->printDebugger(['headers', 'subject', 'body']) . "</pre>";
    }
}
