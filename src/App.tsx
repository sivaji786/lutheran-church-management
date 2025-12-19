import { useState, useEffect } from 'react';
import { storage } from './utils/localStorage';
import { LoginPage } from './components/pages/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { TicketDetailPage } from './components/pages/TicketDetailPage';
import { apiClient } from './services/api';
import { toast } from 'sonner';

export type Member = {
  id?: string;
  name: string;
  occupation: string;
  dateOfBirth: string;
  baptismStatus: boolean;
  confirmationStatus: boolean;
  maritalStatus: boolean; // true = Married, false = Unmarried
  residentialStatus: boolean; // true = Resident, false = Non-Resident
  aadharNumber: string;
  mobile: string;
  address: string;
  area: string;
  ward: string;
  remarks: string;
  memberCode: string;
  registrationDate: string;
  memberStatus: 'confirmed' | 'unconfirmed' | 'suspended';
  memberSerialNum?: number;
  memberOrder?: number;
  familyMembers?: Member[];
};

export type Offering = {
  id?: string;
  memberId: string;
  memberName: string;
  date: string;
  amount: number;
  offerType: string;
  paymentMode: string;
};

export type Ticket = {
  id?: string;
  ticketNumber: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  category: 'Profile Update' | 'Suggestion' | 'Request' | 'Other';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority?: 'low' | 'medium' | 'high';
  createdDate: string;
  updatedDate: string;
  adminNotes?: string;
};

export type User = {
  type: 'admin' | 'member';
  memberCode?: string;
  token?: string;
};

type Page = 'login' | 'ticketDetail';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchData = async () => {
    try {
      const [membersRes, offeringsRes, ticketsRes] = await Promise.all([
        apiClient.getMembers({ limit: 1000 }), // Fetch all members for now
        apiClient.getOfferings({ limit: 1000 }), // Fetch all offerings
        apiClient.getTickets({ limit: 1000 }) // Fetch all tickets
      ]);

      if (membersRes.success && membersRes.data.members) {
        setMembers(membersRes.data.members);
      }

      if (offeringsRes.success && offeringsRes.data.offerings) {
        setOfferings(offeringsRes.data.offerings);
      }

      if (ticketsRes.success && ticketsRes.data.tickets) {
        setTickets(ticketsRes.data.tickets);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data. Please try again.');
    }
  };

  // Restore user session from localStorage on app load
  useEffect(() => {
    const savedUser = storage.get<User>('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      // Fetch data for both admin and member to ensure dashboard works
      apiClient.setToken(savedUser.token || ''); // Ensure token is set
      fetchData();
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storage.set('currentUser', user);
    // Fetch data for both admin and member
    fetchData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    storage.remove('currentUser');
    storage.clearPrefix('admin_');
    storage.clearPrefix('member_');
  };

  const addTicket = async (ticket: Ticket) => {
    try {
      const response = await apiClient.createTicket(ticket);
      if (response.success) {
        const ticketsRes = await apiClient.getTickets({ limit: 1000 });
        if (ticketsRes.success && ticketsRes.data.tickets) {
          setTickets(ticketsRes.data.tickets);
        }
        return true;
      } else {
        toast.error(response.message || 'Failed to create ticket');
        return false;
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
      return false;
    }
  };

  const updateTicket = async (ticketId: string, status: Ticket['status'], adminNotes?: string) => {
    try {
      // First update status
      const statusRes = await apiClient.updateTicketStatus(ticketId, status);

      // If there are notes, we might need a separate update or the API handles it.
      if (adminNotes) {
        await apiClient.updateTicket(ticketId, { adminNotes });
      }

      if (statusRes.success) {
        const ticketsRes = await apiClient.getTickets({ limit: 1000 });
        if (ticketsRes.success && ticketsRes.data.tickets) {
          setTickets(ticketsRes.data.tickets);
        }
        toast.success('Ticket updated successfully');
      } else {
        toast.error(statusRes.message || 'Failed to update ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const changeMemberPassword = async (memberCode: string, currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.changePassword(memberCode, currentPassword, newPassword);
      if (response.success) {
        toast.success('Password changed successfully');
        return true;
      } else {
        toast.error(response.message || 'Failed to change password');
        return false;
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
      return false;
    }
  };

  const handleBackFromTicket = () => {
    setSelectedTicket(null);
    // User stays in admin dashboard, just clears ticket detail view
  };

  // If user is logged in, show dashboard
  if (currentUser) {
    if (currentUser.type === 'admin') {
      // Show ticket detail page if viewing a ticket
      if (currentPage === 'ticketDetail' && selectedTicket) {
        return (
          <TicketDetailPage
            ticket={selectedTicket}
            onUpdateTicket={updateTicket}
            onBack={handleBackFromTicket}
          />
        );
      }

      // Show admin dashboard
      return (
        <AdminDashboard
          onLogout={handleLogout}
        />
      );
    }

    return (
      <MemberDashboard
        memberCode={currentUser.memberCode!}
        members={members}
        offerings={offerings}
        tickets={tickets}
        onAddTicket={addTicket}
        onChangePassword={changeMemberPassword}
        onLogout={handleLogout}
      />
    );
  }

  // Public pages (Only Login in portal mode)
  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;