import React, { useState } from 'react';
import { LogOut, User, DollarSign, Calendar, LayoutDashboard, Menu, X, Ticket, KeyRound } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { TicketForm } from './TicketForm';
import { MyTickets } from './MyTickets';
import { Member, Offering, Ticket as TicketType } from '../App';
const logoImage = 'https://placehold.co/100x100?text=Logo';
import { ChangePasswordDialog } from './ChangePasswordDialog';

type MemberDashboardProps = {
  memberCode: string;
  members: Member[];
  offerings: Offering[];
  tickets: TicketType[];
  onAddTicket: (ticket: TicketType) => Promise<boolean>;
  onChangePassword: (memberCode: string, currentPassword: string, newPassword: string) => void;
  onLogout: () => void;
};

type MenuItem = 'dashboard' | 'my-details' | 'my-offerings' | 'my-tickets';

export function MemberDashboard({
  memberCode,
  members,
  offerings,
  tickets,
  onAddTicket,
  onChangePassword,
  onLogout,
}: MemberDashboardProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuItem>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  const member = members.find((m) => m.memberCode === memberCode);
  const memberOfferings = offerings.filter((o) => o.memberId === member?.id);
  const totalOfferings = memberOfferings.reduce((sum, offering) => sum + offering.amount, 0);
  const memberTickets = tickets.filter((t) => t.memberId === member?.id);

  const menuItems = [
    { id: 'dashboard' as MenuItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-details' as MenuItem, label: 'My Details', icon: User },
    { id: 'my-offerings' as MenuItem, label: 'My Offerings', icon: DollarSign },
    { id: 'my-tickets' as MenuItem, label: 'My Tickets', icon: Ticket },
  ];

  const handleMenuClick = (menuId: MenuItem) => {
    setCurrentMenu(menuId);
    setSidebarOpen(false);
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md shadow-elegant-lg">
          <CardHeader>
            <CardTitle>Member Not Found</CardTitle>
            <CardDescription>Unable to find member details</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onLogout} className="w-full bg-blue-600 hover:bg-blue-700">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  <h2 className="text-blue-900">Member Portal</h2>
                  <p className="text-slate-600 text-sm">Welcome, {member.name}</p>
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
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
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
                  <h1 className="text-blue-900 mb-2">Welcome, {member.name}</h1>
                  <p className="text-slate-600">Here's your membership overview.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-blue-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-600 text-sm">Member Code</p>
                        <h2 className="text-blue-900">{member.memberCode}</h2>
                        <p className="text-slate-500 text-sm">Your unique ID</p>
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
                        <p className="text-slate-500 text-sm">Your contributions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-600 text-sm">Total Records</p>
                        <h2 className="text-purple-900">{memberOfferings.length}</h2>
                        <p className="text-slate-500 text-sm">Offering entries</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Member Info Card */}
                <Card className="border-blue-100 shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Personal Information</CardTitle>
                    <CardDescription>Your registered details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-slate-500 text-sm">Full Name</p>
                        <p className="text-slate-900">{member.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-sm">Mobile Number</p>
                        <p className="text-slate-900">{member.mobile}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-sm">Occupation</p>
                        <p className="text-slate-900">{member.occupation}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-sm">Date of Birth</p>
                        <p className="text-slate-900">{new Date(member.dateOfBirth).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Offerings */}
                <Card className="border-green-100 shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Recent Offerings</CardTitle>
                    <CardDescription>Your latest contributions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {memberOfferings.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No offering records found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {memberOfferings.slice(-5).reverse().map((offering) => (
                          <div key={offering.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                              <p className="text-slate-900">{offering.offerType}</p>
                              <p className="text-slate-500 text-sm">
                                {new Date(offering.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })} • {offering.paymentMode}
                              </p>
                            </div>
                            <p className="text-green-900">₹{offering.amount.toLocaleString('en-IN')}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* My Details View */}
            {currentMenu === 'my-details' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-blue-900 mb-2">My Details</h1>
                  <p className="text-slate-600">Your registered member information.</p>
                </div>

                <Card className="border-blue-100 shadow-elegant-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                    <CardTitle className="text-blue-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <p className="text-slate-500 text-sm uppercase tracking-wide">Full Name</p>
                        <p className="text-slate-900 text-lg">{member.name}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-500 text-sm uppercase tracking-wide">Member Code</p>
                        <Badge className="bg-blue-600 text-white text-base px-4 py-1">
                          {member.memberCode}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-500 text-sm uppercase tracking-wide">Mobile Number</p>
                        <p className="text-slate-900 text-lg">{member.mobile}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-500 text-sm uppercase tracking-wide">Occupation</p>
                        <p className="text-slate-900 text-lg">{member.occupation}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-500 text-sm uppercase tracking-wide">Total Offerings</p>
                        <p className="text-green-900 text-lg">₹{totalOfferings.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-500 text-sm uppercase tracking-wide">Date of Birth</p>
                        <p className="text-slate-900 text-lg">{new Date(member.dateOfBirth).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Section */}
                <Card className="border-red-100 shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-blue-900 flex items-center gap-2">
                      <KeyRound className="w-5 h-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>Manage your account security and password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-slate-900">Password</p>
                          <p className="text-slate-500 text-sm">Change your account password</p>
                        </div>
                        <Button
                          onClick={() => setShowChangePasswordDialog(true)}
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <KeyRound className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          <strong>Security Tip:</strong> Choose a strong password with at least 8 characters, including letters and numbers.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* My Offerings View */}
            {currentMenu === 'my-offerings' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-blue-900 mb-2">My Offerings</h1>
                  <p className="text-slate-600">Complete history of your contributions.</p>
                </div>

                <Card className="border-green-100 shadow-elegant-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b">
                    <CardTitle className="text-blue-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Offering History
                    </CardTitle>
                    <CardDescription>All your contributions to the church</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {memberOfferings.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No offering records found</p>
                        <p className="text-sm mt-2">Your offerings will appear here once recorded</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Offer Type</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Payment Mode</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {memberOfferings.map((offering) => (
                              <TableRow key={offering.id}>
                                <TableCell>
                                  {new Date(offering.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                                    {offering.offerType}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-green-700">
                                  ₹{offering.amount.toLocaleString('en-IN')}
                                </TableCell>
                                <TableCell className="text-slate-600">{offering.paymentMode}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* My Tickets View */}
            {currentMenu === 'my-tickets' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-blue-900 mb-2">My Tickets</h1>
                  <p className="text-slate-600">Submit requests and track their status.</p>
                </div>

                {/* Create Ticket Form */}
                <TicketForm
                  memberCode={member.memberCode}
                  memberName={member.name}
                  memberId={member.id}
                  onAddTicket={async (newTicket) => await onAddTicket(newTicket)}
                />

                {/* My Tickets List */}
                <div>
                  <h2 className="text-blue-900 mb-4">My Submitted Tickets</h2>
                  <MyTickets tickets={memberTickets} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
        memberName={member.name}
        onChangePassword={(currentPassword, newPassword) => onChangePassword(member.memberCode, currentPassword, newPassword)}
      />
    </div>
  );
}