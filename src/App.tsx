import { useState, useEffect, lazy, Suspense } from 'react';
import { storage } from './utils/localStorage';
import { LoginPage } from './components/pages/LoginPage';
import { LoadingSpinner } from './components/LoadingSpinner';
// Lazy load heavy dashboard components
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const MemberDashboard = lazy(() => import('./components/MemberDashboard').then(m => ({ default: m.MemberDashboard })));
const TicketDetailPage = lazy(() => import('./components/pages/TicketDetailPage').then(m => ({ default: m.TicketDetailPage })));
const MemberLookupPage = lazy(() => import('./components/pages/MemberLookupPage').then(m => ({ default: m.MemberLookupPage })));

import { apiClient } from './services/api';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

export type Member = {
  id?: string;
  name: string;
  occupation: string;
  dateOfBirth?: string;
  baptismStatus: boolean;
  confirmationStatus: boolean;
  maritalStatus: 'married' | 'unmarried' | 'widow';
  residentialStatus: boolean; // true = Resident, false = Non-Resident
  aadharNumber?: string;
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
  isHeadOfFamily?: string | boolean; // API returns "0" or "1" as strings
  is_head_of_family?: string | boolean | number; // For snake_case handling
  headOfFamily?: string;
  age?: number;
  familyMembers?: Member[];
};

export type Offering = {
  id?: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  date: string;
  amount: number;
  offerType: string;
  paymentMode: string;
  notes?: string;
  receiptNumber?: string;
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

export type TicketHistory = {
  id: string;
  ticketId: string;
  action: string;
  oldStatus?: string;
  newStatus?: string;
  notes?: string;
  performedBy: string;
  performedByType: 'admin' | 'member';
  performedByName: string;
  createdAt: string;
};

export type User = {
  type: 'admin' | 'member';
  memberCode?: string;
  token?: string;
  isSuperadmin?: string;
};

type Page = 'login' | 'ticketDetail' | 'lookup';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Check for search routing on mount and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      // Check hash for routing (e.g. /#/lookup)
      const hash = window.location.hash;
      if (hash === '#/lookup' || hash === '#lookup') {
        setCurrentPage('lookup');
      } else if (!hash || hash === '#/') {
        // Also handle navigating back to login
        if (!currentUser) setCurrentPage('login');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for changes
    window.addEventListener('hashchange', handleHashChange);

    // Set up auto-logout callback
    apiClient.onUnauthorized = () => {
      console.warn('Session expired - performing auto-logout');
      handleLogout();
      toast.error('Session expired. Please log in again.');
    };

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentUser]);

  // Inactivity timeout for admin users (2 hours)
  useEffect(() => {
    if (currentUser?.type !== 'admin') return;

    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 2 hours = 7200000ms
      timeoutId = setTimeout(() => {
        console.warn('Admin session timed out due to inactivity');
        handleLogout();
        toast.error('Session timed out due to 2 hours of inactivity. Please log in again.');
      }, 7200000);
    };

    // Events that indicate user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Set up listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer start
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser]);


  // Restore user session from localStorage on app load
  useEffect(() => {
    const savedUser = storage.get<User>('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      // Ensure token is set
      apiClient.setToken(savedUser.token || '');

      // Fetch data based on user type

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

                if (fullMemberData.familyMembers && fullMemberData.familyMembers.length > 0) {
                  setMembers(fullMemberData.familyMembers);
                } else {
                  setMembers([fullMemberData]);
                }

                // Fetch offerings - include family if head of family
                // Check both string "1" and boolean true, and also check the snake_case version just in case
                const isHeadOfFamily = fullMemberData.isHeadOfFamily === "1" ||
                  fullMemberData.isHeadOfFamily === true ||
                  (fullMemberData as any).is_head_of_family === true ||
                  (fullMemberData as any).is_head_of_family === 1;

                const offeringsRes = await apiClient.getMemberOfferings(member.id, {
                  includeFamily: isHeadOfFamily
                });
                if (offeringsRes.success && offeringsRes.data.offerings) {
                  setOfferings(offeringsRes.data.offerings);
                }
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
  }, []);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    storage.set('currentUser', user);

    // Only fetch data needed for this user type
    if (user.type === 'admin') {
      // Admin needs all data
      // await fetchData(); 
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

              // Fetch offerings - include family if head of family
              const isHeadOfFamily = fullMemberData.isHeadOfFamily === "1" ||
                fullMemberData.isHeadOfFamily === true ||
                (fullMemberData as any).is_head_of_family === true ||
                (fullMemberData as any).is_head_of_family === 1;

              const offeringsRes = await apiClient.getMemberOfferings(member.id, {
                includeFamily: isHeadOfFamily
              });
              if (offeringsRes.success && offeringsRes.data.offerings) {
                setOfferings(offeringsRes.data.offerings);
              }
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
    apiClient.logout(); // Clears authToken from localStorage
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
      // Prepare update data - MUST include status even if not changed
      const updateData: any = { status };

      // Add admin notes if provided
      if (adminNotes && adminNotes.trim()) {
        updateData.admin_notes = adminNotes;
      }

      // DEBUG: Log what we're sending
      console.log('Updating ticket:', ticketId);
      console.log('Update data:', updateData);
      console.log('Admin notes:', adminNotes);

      // Use PUT /tickets/:id endpoint (NOT /tickets/:id/status)
      // This endpoint handles both status updates AND admin notes
      const res = await apiClient.updateTicket(ticketId, updateData);

      if (res.success) {
        const ticketsRes = await apiClient.getTickets({ limit: 1000 });
        if (ticketsRes.success && ticketsRes.data.tickets) {
          setTickets(ticketsRes.data.tickets);
        }
        toast.success('Ticket updated successfully');
      } else {
        toast.error(res.message || 'Failed to update ticket');
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

  // 1. Check for Lookup Page specifically
  if (currentPage === 'lookup') {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <Suspense fallback={<LoadingSpinner />}>
          <MemberLookupPage />
        </Suspense>
      </>
    );
  }

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
              currentUser={currentUser}
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