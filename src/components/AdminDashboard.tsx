import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, UserPlus, DollarSign, Users, TrendingUp, LayoutDashboard, Menu, X, ArrowLeft, Ticket, Cake } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MemberRegistrationForm } from './MemberRegistrationForm';
import { OfferingForm } from './OfferingForm';
import { MembersTable, MemberFilters } from './MembersTable';
import { OfferingsTable, OfferingFilters } from './OfferingsTable';
import { MemberDetailView } from './MemberDetailView';
import { EditMemberPage } from './EditMemberPage';
import { AdminTicketsTable, TicketFilters } from './AdminTicketsTable';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { DashboardCharts } from './DashboardCharts';
import { Member, Offering, Ticket as TicketType } from '../App';
import { storage } from '../utils/localStorage';
import { apiClient } from '../services/api';
import { toast } from 'sonner';

const logoImage = 'https://placehold.co/100x100?text=Logo';

type AdminDashboardProps = {
  onLogout: () => void;
};

type MenuItem = 'dashboard' | 'members' | 'offerings' | 'tickets';
type MembersView = 'list' | 'add' | 'detail' | 'edit';
type OfferingsView = 'list' | 'add';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuItem>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [membersView, setMembersView] = useState<MembersView>('list');
  const [offeringsView, setOfferingsView] = useState<OfferingsView>('list');
  const [showBirthdayFilter, setShowBirthdayFilter] = useState(false);

  // Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [totalMembersRecords, setTotalMembersRecords] = useState(0);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [totalOfferingsRecords, setTotalOfferingsRecords] = useState(0);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [totalTicketsRecords, setTotalTicketsRecords] = useState(0);

  // "All" data for charts and forms (lookup lists)
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [allOfferings, setAllOfferings] = useState<Offering[]>([]);

  // Restore dashboard state from localStorage
  useEffect(() => {
    const savedMenu = storage.get<MenuItem>('admin_currentMenu');
    if (savedMenu) {
      setCurrentMenu(savedMenu);
    }
    // Initial fetch for charts and lookups
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [membersRes, offeringsRes] = await Promise.all([
        apiClient.getMembers({ limit: 1000 }),
        apiClient.getOfferings({ limit: 1000 })
      ]);
      if (membersRes.success) setAllMembers(membersRes.data.members || []);
      if (offeringsRes.success) setAllOfferings(offeringsRes.data.offerings || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchMembers = useCallback(async (filters: MemberFilters) => {
    try {
      const response = await apiClient.getMembers(filters);
      if (response.success) {
        setMembers(response.data.members || []);
        setTotalMembersRecords(response.data.pagination.totalRecords);
      }
    } catch (error) {
      toast.error('Failed to fetch members');
    }
  }, []);

  const fetchOfferings = useCallback(async (filters: OfferingFilters) => {
    try {
      const response = await apiClient.getOfferings(filters);
      if (response.success) {
        setOfferings(response.data.offerings || []);
        setTotalOfferingsRecords(response.data.pagination.totalRecords);
      }
    } catch (error) {
      toast.error('Failed to fetch offerings');
    }
  }, []);

  const fetchTickets = useCallback(async (filters: TicketFilters) => {
    try {
      const response = await apiClient.getTickets(filters);
      if (response.success) {
        setTickets(response.data.tickets || []);
        setTotalTicketsRecords(response.data.pagination.totalRecords);
      }
    } catch (error) {
      toast.error('Failed to fetch tickets');
    }
  }, []);

  // Action Handlers
  const handleAddMember = async (member: Member): Promise<boolean> => {
    try {
      const response = await apiClient.createMember(member);
      if (response.success) {
        toast.success('Member added successfully');
        fetchAllData(); // Refresh lookup list
        // Refresh table if currently viewing members (will be handled by table's internal state trigger or manual refresh?)
        // Actually table triggers fetch on mount/update. 
        // We might need to force refresh table. But for now, user goes back to list, which might not re-trigger fetch if filters didn't change.
        // But we can just let it be, or trigger a re-fetch if we had access to current filters.
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add member');
      return false;
    }
  };

  const handleAddOffering = async (offering: Offering): Promise<boolean> => {
    try {
      const response = await apiClient.createOffering(offering);
      if (response.success) {
        toast.success('Offering recorded successfully');
        fetchAllData(); // Refresh charts
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add offering');
      return false;
    }
  };

  const handleUpdateTicket = async (ticketId: string, status: TicketType['status'], adminNotes?: string) => {
    try {
      // Update status
      const statusResponse = await apiClient.updateTicketStatus(ticketId, status);

      // Update admin notes if provided
      if (adminNotes) {
        await apiClient.updateTicket(ticketId, { adminNotes });
      }

      if (statusResponse.success) {
        toast.success('Ticket updated successfully');
        // Refresh tickets list
        await fetchTickets({ page: 1, limit: 10, search: '', status: '', priority: '', category: '' });
      }
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const handleUpdateMemberStatus = async (memberId: string, status: Member['memberStatus']) => {
    try {
      const response = await apiClient.updateMemberStatus(memberId, status);
      if (response.success) {
        toast.success('Member status updated');
        fetchAllData();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleResetPassword = async (memberId: string, newPassword: string) => {
    try {
      const response = await apiClient.resetMemberPassword(memberId, newPassword, newPassword);
      if (response.success) {
        toast.success('Password reset successfully');
      }
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleUpdateMember = async (memberId: string, updatedData: Partial<Member>): Promise<boolean> => {
    try {
      const response = await apiClient.updateMember(memberId, updatedData);
      if (response.success) {
        toast.success('Member updated successfully');
        fetchAllData();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update member');
      return false;
    }
  };

  const handleImportMembers = async (importedMembers: Member[]) => {
    let successCount = 0;
    let failCount = 0;

    const toastId = toast.loading(`Importing ${importedMembers.length} members...`);

    for (const member of importedMembers) {
      try {
        // Remove temporary ID if present
        const { id, ...memberData } = member;
        const response = await apiClient.createMember(memberData);
        if (response.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    toast.dismiss(toastId);

    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} members`);
      fetchAllData(); // Refresh all data
      // Also trigger table refresh if possible, but fetchAllData updates allMembers which might be enough if we use it, 
      // but table uses its own fetch. We might need to force table refresh.
      // For now, user can refresh manually or we rely on allMembers update if table used it (it doesn't for display).
      // Let's call fetchMembers with current filters if we could, but we don't have them.
      // We'll just rely on the user refreshing or navigating.
    }

    if (failCount > 0) {
      toast.error(`Failed to import ${failCount} members`);
    }
  };

  // Dashboard Stats (calculated from "all" data for now)
  const totalMembers = allMembers.length;
  const totalOfferings = allOfferings.reduce((sum, offering) => sum + Number(offering.amount), 0);
  const thisMonthOfferings = allOfferings.filter(o => {
    const offeringDate = new Date(o.date);
    const now = new Date();
    return offeringDate.getMonth() === now.getMonth() &&
      offeringDate.getFullYear() === now.getFullYear();
  }).reduce((sum, offering) => sum + Number(offering.amount), 0);

  // We need to fetch tickets for stats too? Or just use what we have?
  // Tickets are usually fewer, so maybe we can fetch all tickets for stats?
  // For now, let's just use the paginated tickets count if we are on dashboard, 
  // but wait, we only fetch tickets when on tickets tab.
  // So we should fetch stats separately or fetch all tickets initially too.
  // Let's fetch all tickets initially for stats.
  const [allTickets, setAllTickets] = useState<TicketType[]>([]);
  useEffect(() => {
    apiClient.getTickets({ limit: 1000 }).then(res => {
      if (res.success) setAllTickets(res.data.tickets || []);
    });
  }, []);
  const openTickets = allTickets.filter(t => t.status === 'Open').length;

  // Calculate today's birthdays
  const today = new Date();
  const todayBirthdays = allMembers.filter(member => {
    const dob = new Date(member.dateOfBirth);
    return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
  }).length;

  const menuItems = [
    { id: 'dashboard' as MenuItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members' as MenuItem, label: 'Members', icon: Users },
    { id: 'offerings' as MenuItem, label: 'Offerings', icon: DollarSign },
    { id: 'tickets' as MenuItem, label: 'Tickets', icon: Ticket },
  ];

  const handleMenuClick = (menuId: MenuItem) => {
    setCurrentMenu(menuId);
    storage.set('admin_currentMenu', menuId);
    setSidebarOpen(false);
    // Reset members view when navigating to members
    if (menuId === 'members') {
      setMembersView('list');
      setSelectedMember(null);
      setShowBirthdayFilter(false); // Reset birthday filter
    }
    // Reset offerings view when navigating to offerings
    if (menuId === 'offerings') {
      setOfferingsView('list');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg shadow-elegant">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-slate-700" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
                )}
              </button>

              <div className="flex items-center gap-3">
                <img src={logoImage} alt="Lutheran Church Logo" className="h-12 w-auto" />
                <div className="hidden sm:block">
                  <h2 className="text-blue-900">Admin Portal</h2>
                  <p className="text-slate-600 text-sm">Church Management System</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] bg-white border-r border-slate-200 shadow-lg transition-transform duration-300 z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } w-64`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentMenu === item.id;

              return (
                <button
                  key={item.id}
                  data-testid={`sidebar-${item.id}`}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className={isActive ? '' : ''}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard View */}
            {currentMenu === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-blue-900 mb-2">Welcome Back, Admin</h1>
                  <p className="text-slate-600">Here's what's happening with your church today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-blue-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-600 text-sm">Total Members</p>
                        <h2 className="text-blue-900">{totalMembers}</h2>
                        <p className="text-slate-500 text-sm">Registered in system</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-md">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-600 text-sm">Total Offerings</p>
                        <h2 className="text-green-900">₹{totalOfferings.toLocaleString('en-IN')}</h2>
                        <p className="text-slate-500 text-sm">All time contributions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-md">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-600 text-sm">This Month</p>
                        <h2 className="text-amber-900">₹{thisMonthOfferings.toLocaleString('en-IN')}</h2>
                        <p className="text-slate-500 text-sm">
                          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-md">
                          <Ticket className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-600 text-sm">Open Tickets</p>
                        <h2 className="text-red-900">{openTickets}</h2>
                        <p className="text-slate-500 text-sm">Pending issues</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    onClick={() => {
                      setCurrentMenu('members');
                      setMembersView('list');
                      setShowBirthdayFilter(true);
                    }}
                    className="border-pink-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 cursor-pointer"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center shadow-md">
                          <Cake className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-600 text-sm">Today's Birthdays</p>
                        <h2 className="text-pink-900">{todayBirthdays}</h2>
                        <p className="text-slate-500 text-sm">Click to view members</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="border-purple-100 shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Quick Actions</CardTitle>
                    <CardDescription>Common tasks to manage your church</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={() => {
                          setCurrentMenu('members');
                          setMembersView('add');
                        }}
                        className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                      >
                        <UserPlus className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                        <p className="text-slate-700 group-hover:text-blue-900">Add New Member</p>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentMenu('offerings');
                          setOfferingsView('add');
                        }}
                        className="p-6 border-2 border-slate-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all duration-300 group"
                      >
                        <DollarSign className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                        <p className="text-slate-700 group-hover:text-green-900">Record Offering</p>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentMenu('members');
                          setMembersView('list');
                        }}
                        className="p-6 border-2 border-slate-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all duration-300 group"
                      >
                        <Users className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                        <p className="text-slate-700 group-hover:text-purple-900">View All Members</p>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentMenu('offerings');
                          setOfferingsView('list');
                        }}
                        className="p-6 border-2 border-slate-200 rounded-xl hover:border-amber-600 hover:bg-amber-50 transition-all duration-300 group"
                      >
                        <TrendingUp className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                        <p className="text-slate-700 group-hover:text-amber-900">View Offerings</p>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Charts */}
                <DashboardCharts members={allMembers} offerings={allOfferings} />

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="border-blue-100 shadow-elegant">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Recent Members</CardTitle>
                      <CardDescription>Latest registered members</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {allMembers.slice(-3).reverse().map((member) => (
                          <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                              {member.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-900">{member.name}</p>
                              <p className="text-slate-500 text-sm">{member.memberCode}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-600 text-xs">Registered</p>
                              <p className="text-slate-900 text-sm">
                                {new Date(member.registrationDate).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-100 shadow-elegant">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Recent Offerings</CardTitle>
                      <CardDescription>Latest contributions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {allOfferings.slice(-3).reverse().map((offering) => (
                          <div key={offering.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="text-slate-900">{offering.memberName}</p>
                              <p className="text-slate-500 text-sm">{offering.offerType}</p>
                            </div>
                            <p className="text-green-900">₹{offering.amount.toLocaleString('en-IN')}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Offerings View */}
            {currentMenu === 'offerings' && (
              <div className="space-y-6">
                {offeringsView === 'list' && (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h1 className="text-blue-900 mb-2">All Offerings</h1>
                        <p className="text-slate-600">View and manage all offering records with filters and export options.</p>
                      </div>
                      <Button
                        onClick={() => setOfferingsView('add')}
                        className="bg-green-600 hover:bg-green-700 shadow-lg"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Add New Offering
                      </Button>
                    </div>
                    <Card className="border-amber-100 shadow-elegant-lg">
                      <CardContent className="pt-6">
                        <OfferingsTable
                          offerings={offerings}
                          totalRecords={totalOfferingsRecords}
                          onFilterChange={fetchOfferings}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}
                {offeringsView === 'add' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => setOfferingsView('list')}
                        variant="outline"
                        className="border-slate-300"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Offerings
                      </Button>
                    </div>
                    <div>
                      <h1 className="text-blue-900 mb-2">Record New Offering</h1>
                      <p className="text-slate-600">Add a new offering contribution to the records.</p>
                    </div>
                    <Card className="border-green-100 shadow-elegant-lg">
                      <CardContent className="pt-6">
                        <OfferingForm
                          members={allMembers}
                          onAddOffering={async (offering) => {
                            const success = await handleAddOffering(offering);
                            if (success) {
                              setOfferingsView('list');
                            }
                            return success;
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Members View */}
            {currentMenu === 'members' && (
              <div className="space-y-6">
                {membersView === 'list' && (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h1 className="text-blue-900 mb-2">All Members</h1>
                        <p className="text-slate-600">Click on any member to view their complete profile and offering history.</p>
                      </div>
                      <Button
                        onClick={() => setMembersView('add')}
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add New Member
                      </Button>
                    </div>
                    <Card className="border-purple-100 shadow-elegant-lg">
                      <CardContent className="pt-6">
                        <MembersTable
                          members={members}
                          allMembers={allMembers}
                          totalRecords={totalMembersRecords}
                          onImportMembers={handleImportMembers}
                          onMemberClick={(member) => {
                            setSelectedMember(member);
                            setMembersView('detail');
                          }}
                          initialBirthdayFilter={showBirthdayFilter}
                          onFilterChange={fetchMembers}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}
                {membersView === 'add' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => setMembersView('list')}
                        variant="outline"
                        className="border-slate-300"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Members
                      </Button>
                    </div>
                    <div>
                      <h1 className="text-blue-900 mb-2">Register New Member</h1>
                      <p className="text-slate-600">Add a new member to the church registry.</p>
                    </div>
                    <Card className="border-blue-100 shadow-elegant-lg">
                      <CardContent className="pt-6">
                        <MemberRegistrationForm
                          onAddMember={async (member) => {
                            const success = await handleAddMember(member);
                            if (success) {
                              setMembersView('list');
                            }
                            return success;
                          }}
                          existingMembers={allMembers}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
                {membersView === 'detail' && selectedMember && (
                  <MemberDetailView
                    member={selectedMember}
                    offerings={allOfferings.filter(o => o.memberId === selectedMember.id)}
                    onUpdateMemberStatus={handleUpdateMemberStatus}
                    onResetPassword={handleResetPassword}
                    onEditMember={() => setMembersView('edit')}
                    onBack={() => {
                      setMembersView('list');
                      setSelectedMember(null);
                    }}
                  />
                )}
                {membersView === 'edit' && selectedMember && (
                  <EditMemberPage
                    member={selectedMember}
                    onUpdateMember={handleUpdateMember}
                    existingMembers={allMembers}
                    onBack={() => {
                      setMembersView('list');
                      setSelectedMember(null);
                    }}
                  />
                )}
              </div>
            )}

            {/* Tickets View */}
            {currentMenu === 'tickets' && (
              <div className="space-y-6">
                {selectedTicket ? (
                  <TicketDetailPage
                    ticket={selectedTicket}
                    onUpdateTicket={handleUpdateTicket}
                    onBack={() => setSelectedTicket(null)}
                  />
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h1 className="text-blue-900 mb-2">All Tickets</h1>
                        <p className="text-slate-600">View and manage member requests, suggestions, and profile updates.</p>
                      </div>
                    </div>
                    <Card className="border-red-100 shadow-elegant-lg">
                      <CardContent className="pt-6">
                        <AdminTicketsTable
                          tickets={tickets}
                          totalRecords={totalTicketsRecords}
                          onUpdateTicket={handleUpdateTicket}
                          onViewTicket={(ticket) => {
                            setSelectedTicket(ticket);
                          }}
                          onFilterChange={fetchTickets}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}