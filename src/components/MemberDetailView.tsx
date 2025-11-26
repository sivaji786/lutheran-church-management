import React from 'react';
import { User, Mail, Phone, MapPin, DollarSign, Calendar, ArrowLeft, TrendingUp, PieChart, IdCard, Briefcase, Cake, Church, Heart, Home, CheckCircle, XCircle, BanIcon, Edit, KeyRound } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Member, Offering } from '../App';
import { toast } from 'sonner';
import { AdminResetPasswordDialog } from './AdminResetPasswordDialog';

type MemberDetailViewProps = {
  member: Member;
  offerings: Offering[];
  onUpdateMemberStatus: (memberId: string, status: Member['memberStatus']) => void;
  onResetPassword: (memberId: string, newPassword: string) => void;
  onEditMember: () => void;
  onBack: () => void;
};

export function MemberDetailView({ member, offerings, onUpdateMemberStatus, onResetPassword, onEditMember, onBack }: MemberDetailViewProps) {
  const [showResetPasswordDialog, setShowResetPasswordDialog] = React.useState(false);

  // Get offerings for this member
  const memberOfferings = offerings.filter(o => o.memberId === member.id);
  
  // Calculate statistics
  const totalContributions = memberOfferings.reduce((sum, o) => sum + o.amount, 0);
  const averageContribution = memberOfferings.length > 0 
    ? totalContributions / memberOfferings.length 
    : 0;
  
  // This month offerings
  const thisMonthOfferings = memberOfferings.filter(o => {
    const offeringDate = new Date(o.date);
    const now = new Date();
    return offeringDate.getMonth() === now.getMonth() && 
           offeringDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthOfferings.reduce((sum, o) => sum + o.amount, 0);
  
  // Offering type breakdown
  const offeringsByType = memberOfferings.reduce((acc, o) => {
    acc[o.offerType] = (acc[o.offerType] || 0) + o.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort offerings by date (most recent first)
  const sortedOfferings = [...memberOfferings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Last offering date
  const lastOfferingDate = sortedOfferings.length > 0 
    ? new Date(sortedOfferings[0].date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'No offerings yet';

  // Calculate age
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-slate-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Members
        </Button>
      </div>

      {/* Member Profile Card */}
      <Card className="border-blue-100 shadow-elegant-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="text-3xl">{member.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <CardTitle className="text-blue-900 text-2xl mb-2">{member.name}</CardTitle>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-blue-600 text-white">
                    {member.memberCode}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={
                      member.memberStatus === 'confirmed' 
                        ? 'bg-green-50 text-green-700 border-green-300' 
                        : member.memberStatus === 'suspended'
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }
                  >
                    {member.memberStatus === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {member.memberStatus === 'suspended' && <BanIcon className="w-3 h-3 mr-1" />}
                    {member.memberStatus === 'unconfirmed' && <XCircle className="w-3 h-3 mr-1" />}
                    {member.memberStatus === 'confirmed' && 'Confirmed'}
                    {member.memberStatus === 'unconfirmed' && 'Unconfirmed'}
                    {member.memberStatus === 'suspended' && 'Suspended'}
                  </Badge>
                </div>
              </div>
            </div>
            {/* Admin Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onEditMember}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Member Details
              </Button>

              <Button
                onClick={() => setShowResetPasswordDialog(true)}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Reset Password
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2 pb-2 border-b">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Occupation</p>
                    <p className="text-slate-900">{member.occupation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cake className="w-4 h-4 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Date of Birth</p>
                    <p className="text-slate-900">
                      {new Date(member.dateOfBirth).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                      <span className="text-slate-500 text-sm ml-2">
                        ({calculateAge(member.dateOfBirth)} years)
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IdCard className="w-4 h-4 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Aadhar Number</p>
                    <p className="text-slate-900 font-mono">{member.aadharNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2 pb-2 border-b">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Mobile Number</p>
                    <p className="text-slate-900">{member.mobile}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="text-slate-900">{member.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Area</p>
                    <p className="text-slate-900">{member.area}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Ward</p>
                    <p className="text-slate-900">{member.ward}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2 pb-2 border-b">
                <Church className="w-5 h-5 text-blue-600" />
                Status Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Baptism Status</p>
                  <Badge variant={member.baptismStatus ? "default" : "secondary"} className={member.baptismStatus ? "bg-green-100 text-green-800" : ""}>
                    {member.baptismStatus ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Confirmation Status</p>
                  <Badge variant={member.confirmationStatus ? "default" : "secondary"} className={member.confirmationStatus ? "bg-blue-100 text-blue-800" : ""}>
                    {member.confirmationStatus ? 'Confirmed' : 'Not Confirmed'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Marital Status</p>
                  <Badge variant="outline" className={member.maritalStatus ? "bg-pink-50 text-pink-700 border-pink-200" : "bg-slate-50 text-slate-700 border-slate-200"}>
                    {member.maritalStatus ? 'Married' : 'Unmarried'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Residential Status</p>
                  <Badge variant="outline" className={member.residentialStatus ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                    {member.residentialStatus ? 'Resident' : 'Non-Resident'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          {member.remarks && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-slate-900 mb-2">Remarks</h3>
              <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{member.remarks}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Status Management - Admin Actions */}
      <Card className="border-indigo-100 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-blue-900">Member Status Management</CardTitle>
          <CardDescription>Update member status and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                onUpdateMemberStatus(member.id, 'confirmed');
                toast.success(`${member.name} has been confirmed as a member`);
              }}
              disabled={member.memberStatus === 'confirmed'}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Member
            </Button>
            
            <Button
              onClick={() => {
                onUpdateMemberStatus(member.id, 'unconfirmed');
                toast.success(`${member.name}'s status has been set to unconfirmed`);
              }}
              disabled={member.memberStatus === 'unconfirmed'}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Mark as Unconfirmed
            </Button>
            
            <Button
              onClick={() => {
                onUpdateMemberStatus(member.id, 'suspended');
                toast.success(`${member.name} has been suspended`);
              }}
              disabled={member.memberStatus === 'suspended'}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <BanIcon className="w-4 h-4 mr-2" />
              Suspend Member
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              <strong>Current Status:</strong>{' '}
              <span className={
                member.memberStatus === 'confirmed' 
                  ? 'text-green-700' 
                  : member.memberStatus === 'suspended'
                  ? 'text-red-700'
                  : 'text-amber-700'
              }>
                {member.memberStatus.charAt(0).toUpperCase() + member.memberStatus.slice(1)}
              </span>
            </p>
            <p className="text-sm text-slate-500 mt-2">
              {member.memberStatus === 'confirmed' && '✓ This member has full access and permissions'}
              {member.memberStatus === 'unconfirmed' && '⚠ This member needs verification before full access'}
              {member.memberStatus === 'suspended' && '✗ This member\'s access has been restricted'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-green-100 shadow-elegant">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-md">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-slate-600 text-sm">Total Contributions</p>
              <h2 className="text-green-900">₹{totalContributions.toLocaleString('en-IN')}</h2>
              <p className="text-slate-500 text-sm">{memberOfferings.length} offerings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-elegant">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-slate-600 text-sm">Average Contribution</p>
              <h2 className="text-blue-900">₹{Math.round(averageContribution).toLocaleString('en-IN')}</h2>
              <p className="text-slate-500 text-sm">Per offering</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 shadow-elegant">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-slate-600 text-sm">This Month</p>
              <h2 className="text-amber-900">₹{thisMonthTotal.toLocaleString('en-IN')}</h2>
              <p className="text-slate-500 text-sm">{thisMonthOfferings.length} offerings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 shadow-elegant">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-slate-600 text-sm">Last Offering</p>
              <p className="text-purple-900 text-lg">{lastOfferingDate}</p>
              <p className="text-slate-500 text-sm">Most recent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offering Breakdown by Type */}
      {Object.keys(offeringsByType).length > 0 && (
        <Card className="border-pink-100 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-pink-600" />
              Offering Breakdown by Type
            </CardTitle>
            <CardDescription>Total contributions by offering type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(offeringsByType).map(([type, amount]) => (
                <div key={type} className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">{type}</p>
                  <p className="text-green-900 text-xl">₹{amount.toLocaleString('en-IN')}</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {Math.round((amount / totalContributions) * 100)}% of total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offering History */}
      <Card className="border-slate-200 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-blue-900">Offering History</CardTitle>
          <CardDescription>Complete record of all contributions</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedOfferings.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Offer Type</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOfferings.map((offering) => (
                    <TableRow key={offering.id}>
                      <TableCell>
                        {new Date(offering.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {offering.offerType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50">
                          {offering.paymentMode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-green-900">
                        ₹{offering.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No offering records found for this member</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <AdminResetPasswordDialog
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
        member={member}
        onResetPassword={onResetPassword}
      />
    </div>
  );
}