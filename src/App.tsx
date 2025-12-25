import { useState, useEffect, lazy, Suspense } from 'react';
import { storage } from './utils/localStorage';
import { LoginPage } from './components/pages/LoginPage';
import { LoadingSpinner } from './components/LoadingSpinner';
// Lazy load heavy dashboard components
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const MemberDashboard = lazy(() => import('./components/MemberDashboard').then(m => ({ default: m.MemberDashboard })));
const TicketDetailPage = lazy(() => import('./components/pages/TicketDetailPage').then(m => ({ default: m.TicketDetailPage })));
import { apiClient } from './services/api';
import { toast, Toaster } from 'sonner';

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
      // Ensure token is set
      apiClient.setToken(savedUser.token || '');

      // Fetch data based on user type
      if (savedUser.type === 'admin') {
        fetchData(); // Admin needs all data
      } else {
        // Member - fetch member record and their specific data
        (async () => {
          try {
            const memberRes = await apiClient.getMembers({
              search: savedUser.memberCode,
              limit: 10
            });

            if (memberRes.success && memberRes.data.members) {
              // Get the member ID to fetch their full details including family members
              const member = memberRes.data.members.find(
                (m: any) => m.memberCode === savedUser.memberCode
              );

              if (member?.id) {
                // Fetch full member details including family members
                const memberDetailRes = await apiClient.getMember(member.id);
                if (memberDetailRes.success && memberDetailRes.data) {
                  const fullMemberData = memberDetailRes.data;

                  // Set members array with the logged-in member and their family members
                  if (fullMemberData.familyMembers && fullMemberData.familyMembers.length > 0) {
                    setMembers(fullMemberData.familyMembers);
                  } else {
                    setMembers([fullMemberData]);
                  }
                }

                // Fetch only this member's offerings using dedicated endpoint
                const offeringsRes = await apiClient.getMemberOfferings(member.id);
                if (offeringsRes.success && offeringsRes.data.offerings) {
                  setOfferings(offeringsRes.data.offerings);
                }

                // Fetch only this member's tickets using memberId filter
                const ticketsRes = await apiClient.getTickets({ memberId: member.id, limit: 1000 });
                if (ticketsRes.success && ticketsRes.data.tickets) {
                  setTickets(ticketsRes.data.tickets);
                }
              }
            }
          } catch (error) {
            console.error('Error restoring session:', error);
          }
        })();
      }
    }
  }, []);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    storage.set('currentUser', user);

    // Only fetch data needed for this user type
    if (user.type === 'admin') {
      // Admin needs all data
      await fetchData();
    } else {
      // Member - fetch member record and their specific data
      try {
        const memberRes = await apiClient.getMembers({
          search: user.memberCode,
          limit: 10
        });

        if (memberRes.success && memberRes.data.members) {
          // Get the member ID to fetch their full details including family members
          const member = memberRes.data.members.find(
            (m: any) => m.memberCode === user.memberCode
          );

          if (member?.id) {
            // Fetch full member details including family members
            const memberDetailRes = await apiClient.getMember(member.id);
            if (memberDetailRes.success && memberDetailRes.data) {
              const fullMemberData = memberDetailRes.data;

              // Set members array with the logged-in member and their family members
              if (fullMemberData.familyMembers && fullMemberData.familyMembers.length > 0) {
                setMembers(fullMemberData.familyMembers);
              } else {
                setMembers([fullMemberData]);
              }
            }

            // Fetch only this member's offerings using dedicated endpoint
            const offeringsRes = await apiClient.getMemberOfferings(member.id);
            if (offeringsRes.success && offeringsRes.data.offerings) {
              setOfferings(offeringsRes.data.offerings);
            }

            // Fetch only this member's tickets using memberId filter
            const ticketsRes = await apiClient.getTickets({ memberId: member.id, limit: 1000 });
            if (ticketsRes.success && ticketsRes.data.tickets) {
              setTickets(ticketsRes.data.tickets);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast.error('Failed to load your data. Please try again.');
      }
    }
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
          <>
            <Toaster position="top-right" richColors closeButton />
            <Suspense fallback={<LoadingSpinner />}>
              <TicketDetailPage
                ticket={selectedTicket}
                onUpdateTicket={updateTicket}
                onBack={handleBackFromTicket}
              />
            </Suspense>
          </>
        );
      }

      // Show admin dashboard
      return (
        <>
          <Toaster position="top-right" richColors closeButton />
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard
              onLogout={handleLogout}
            />
          </Suspense>
        </>
      );
    }

    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <Suspense fallback={<LoadingSpinner />}>
          <MemberDashboard
            memberCode={currentUser.memberCode!}
            members={members}
            offerings={offerings}
            tickets={tickets}
            onAddTicket={addTicket}
            onChangePassword={changeMemberPassword}
            onLogout={handleLogout}
          />
        </Suspense>
      </>
    );
  }

  // Public pages (Only Login in portal mode)
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <div className="min-h-screen bg-white">
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      </div>
    </>
  );
}

export default App;