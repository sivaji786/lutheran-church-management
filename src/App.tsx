import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { AboutPage } from './components/pages/AboutPage';
import { MinistriesPage } from './components/pages/MinistriesPage';
import { ContactPage } from './components/pages/ContactPage';
import { SermonsPage } from './components/pages/SermonsPage';
import { IAmNewPage } from './components/pages/IAmNewPage';
import { AELCPage } from './components/pages/AELCPage';
import { LCHydPage } from './components/pages/LCHydPage';
import { SundaySchoolPage } from './components/pages/SundaySchoolPage';
import { WomenSamajPage } from './components/pages/WomenSamajPage';
import { YoutheranPage } from './components/pages/YoutheranPage';
import { EventsPage } from './components/pages/EventsPage';
import { PhotosPage } from './components/pages/PhotosPage';
import { VideosPage } from './components/pages/VideosPage';
import { storage } from './utils/localStorage';
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
  status: 'Open' | 'In Progress' | 'Updated' | 'Done';
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

type Page = 'home' | 'login' | 'about' | 'ministries' | 'contact' | 'sermons' | 'iamnew' | 'aelc' | 'lchyd' | 'sundayschool' | 'womensamaj' | 'youtheran' | 'events' | 'photos' | 'videos' | 'ticketDetail';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const path = window.location.pathname.substring(1); // Remove leading slash
    const validPages: Page[] = ['home', 'login', 'about', 'ministries', 'contact', 'sermons', 'iamnew', 'aelc', 'lchyd', 'sundayschool', 'womensamaj', 'youtheran', 'events', 'photos', 'videos', 'ticketDetail'];

    // Handle special case for 'im-new' which maps to 'iamnew' in state but might be different in URL
    // Actually, the test uses '/im-new', but the Page type has 'iamnew'.
    // Let's map URL paths to Page state
    if (path === 'im-new') return 'iamnew';
    if (path === 'sunday-school') return 'sundayschool';
    if (path === 'women') return 'womensamaj';
    if (path === 'youth') return 'youtheran';
    if (path === 'lch') return 'lchyd';

    if (validPages.includes(path as Page)) {
      return path as Page;
    }
    return 'home';
  });
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
      // In a real app, we might want to fetch only specific data for members
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
    setCurrentPage('home');
    storage.remove('currentUser');
    storage.clearPrefix('admin_');
    storage.clearPrefix('member_');
  };

  const addMember = async (member: Member) => {
    try {
      const response = await apiClient.createMember(member);
      if (response.success) {
        // Refresh members list to get the server-generated ID and data
        const membersRes = await apiClient.getMembers({ limit: 1000 });
        if (membersRes.success && membersRes.data.members) {
          setMembers(membersRes.data.members);
        }
        return true;
      } else {
        toast.error(response.message || 'Failed to add member');
        return false;
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
      return false;
    }
  };

  const importMembers = (importedMembers: Member[]) => {
    // For bulk import, we might want a specific API endpoint, 
    // but for now we'll just log a warning or implement a loop if needed.
    // This is likely a future enhancement.
    console.warn('Bulk import not yet fully implemented with API');
    setMembers([...members, ...importedMembers]);
  };

  const addOffering = async (offering: Offering) => {
    try {
      const response = await apiClient.createOffering(offering);
      if (response.success) {
        const offeringsRes = await apiClient.getOfferings({ limit: 1000 });
        if (offeringsRes.success && offeringsRes.data.offerings) {
          setOfferings(offeringsRes.data.offerings);
        }
        return true;
      } else {
        toast.error(response.message || 'Failed to record offering');
        return false;
      }
    } catch (error) {
      console.error('Error adding offering:', error);
      toast.error('Failed to record offering');
      return false;
    }
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
      // Assuming updateTicket can handle general updates including notes
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

  const updateMemberStatus = async (memberId: string, status: Member['memberStatus']) => {
    try {
      const response = await apiClient.updateMemberStatus(memberId, status);
      if (response.success) {
        const membersRes = await apiClient.getMembers({ limit: 1000 });
        if (membersRes.success && membersRes.data.members) {
          setMembers(membersRes.data.members);
        }
        toast.success('Member status updated');
      } else {
        toast.error(response.message || 'Failed to update member status');
      }
    } catch (error) {
      console.error('Error updating member status:', error);
      toast.error('Failed to update member status');
    }
  };

  const resetMemberPassword = async (memberId: string, newPassword: string) => {
    try {
      const response = await apiClient.resetMemberPassword(memberId, newPassword, newPassword);
      if (response.success) {
        toast.success('Password reset successfully');
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    }
  };

  const updateMemberDetails = async (memberId: string, updatedData: Partial<Member>) => {
    try {
      const response = await apiClient.updateMember(memberId, updatedData);
      if (response.success) {
        const membersRes = await apiClient.getMembers({ limit: 1000 });
        if (membersRes.success && membersRes.data.members) {
          setMembers(membersRes.data.members);
        }
        return true;
      } else {
        toast.error(response.message || 'Failed to update member');
        return false;
      }
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
      return false;
    }
  };

  const changeMemberPassword = (memberCode: string, currentPassword: string, newPassword: string) => {
    // This would need a member-specific API endpoint, likely /auth/change-password
    // For now, we'll keep it as is or add a TODO
    console.log(`Password changed for member ${memberCode}`);
    toast.info('Password change feature coming soon');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCurrentPage('ticketDetail');
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

  // Public pages
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={navigateTo} />

      {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} onNavigate={navigateTo} />}
      {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}
      {currentPage === 'ministries' && <MinistriesPage onNavigate={navigateTo} />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'sermons' && <SermonsPage />}
      {currentPage === 'iamnew' && <IAmNewPage />}
      {currentPage === 'aelc' && <AELCPage />}
      {currentPage === 'lchyd' && <LCHydPage />}
      {currentPage === 'sundayschool' && <SundaySchoolPage />}
      {currentPage === 'womensamaj' && <WomenSamajPage />}
      {currentPage === 'youtheran' && <YoutheranPage />}
      {currentPage === 'events' && <EventsPage />}
      {currentPage === 'photos' && <PhotosPage />}
      {currentPage === 'videos' && <VideosPage />}

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;