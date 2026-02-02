import React from 'react';
import { User, Mail, Phone, MapPin, DollarSign, Calendar, ArrowLeft, TrendingUp, PieChart, IdCard, Briefcase, Cake, Church, Heart, Home, CheckCircle, XCircle, BanIcon, Edit, KeyRound, Printer, Crown, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import churchLogo from '../assets/church_logo_new.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Member, Offering } from '../App';
import { toast } from 'sonner';
import { AdminResetPasswordDialog } from './AdminResetPasswordDialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

type MemberDetailViewProps = {
  member: Member;
  offerings: Offering[];
  onUpdateMemberStatus: (memberId: string, status: Member['memberStatus']) => void;
  onResetPassword: (memberId: string, newPassword: string) => void;
  onEditMember: () => void;
  onBack: () => void;
  onMemberClick?: (member: Member) => void;
  onSetFamilyHead?: (memberId: string) => void;
  onDeleteMember?: (memberId: string) => void;
};

export function MemberDetailView({ member, offerings, onUpdateMemberStatus, onResetPassword, onEditMember, onBack, onMemberClick, onSetFamilyHead, onDeleteMember }: MemberDetailViewProps) {
  const [showResetPasswordDialog, setShowResetPasswordDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // Get offerings for this member
  const memberOfferings = offerings.filter(o => o.memberId === member.id);

  // Calculate statistics - ensure amounts are numbers
  const totalContributions = memberOfferings.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
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
  const thisMonthTotal = thisMonthOfferings.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  // Offering type breakdown
  const offeringsByType = memberOfferings.reduce((acc, o) => {
    acc[o.offerType] = (acc[o.offerType] || 0) + (Number(o.amount) || 0);
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
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleResetPassword = (newPassword: string) => {
    if (member.id) {
      onResetPassword(member.id, newPassword);
      setShowResetPasswordDialog(false);
    }
  };

  const handlePrintFamilyDetails = async () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Page width for landscape A4 is roughly 297mm
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    // Add Logo
    try {
      const img = new Image();
      img.src = churchLogo;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      doc.addImage(img, 'PNG', 15, 10, 25, 25);
    } catch (error) {
      console.error("Error loading logo:", error);
    }

    // Header
    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0); // Green
    doc.text('ANDHRA EVANGELICAL LUTHERAN CHURCH', centerX, 15, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0); // Red
    doc.text("HYDERABAD 'A-1' PARISH", centerX, 23, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0); // Green
    doc.text('Central Guntur Synod', centerX, 29, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0); // Black
    doc.setFont('helvetica', 'normal');
    doc.text('6-1-68, Lakdi-ka-Pul, Saifabad, Hyderabad – 500 004.', centerX, 34, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('MEMBERSHIP FORM', centerX, 39, { align: 'center' });
    doc.line(centerX - 20, 40, centerX + 20, 40); // Underline

    // Member Details
    let yPos = 50;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Name & Address:', 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 255); // Blue
    doc.text(member.name, 45, yPos);

    doc.setTextColor(0, 0, 0); // Black
    doc.setFont('helvetica', 'bold');
    // Adjust position for landscape
    doc.text('Serial No :', 220, yPos);
    doc.setTextColor(0, 0, 255); // Blue
    doc.text(member.memberSerialNum ? member.memberSerialNum.toString().padStart(4, '0') : '', 240, yPos);

    yPos += 7;
    doc.setTextColor(0, 0, 255); // Blue
    // Split address into multiple lines if needed
    const addressLines = doc.splitTextToSize(member.address, 150); // Wider address area
    doc.text(addressLines, 14, yPos);

    doc.setTextColor(0, 0, 0); // Black
    doc.setFont('helvetica', 'bold');
    doc.text('Area', 220, yPos);
    doc.text(':', 237, yPos);
    doc.setTextColor(0, 0, 255); // Blue
    doc.text(member.area, 240, yPos);

    yPos += 7;
    doc.setTextColor(0, 0, 0); // Black
    doc.setFont('helvetica', 'bold');
    doc.text('Ward', 220, yPos);
    doc.text(':', 237, yPos);
    doc.setTextColor(0, 0, 255); // Blue
    doc.text(`"${member.ward}"`, 240, yPos);

    yPos += Math.max(addressLines.length * 5, 7);
    doc.setTextColor(0, 0, 0); // Black
    doc.setFont('helvetica', 'bold');
    doc.text('Mob No:', 14, yPos);
    doc.setTextColor(0, 0, 255); // Blue
    doc.text(member.mobile, 30, yPos);

    // Table
    const tableColumn = [
      "S No", "Full Name", "Occupation", "Date of Birth",
      "Baptism", "Confirmation", "Marital",
      "Aadhar No", "Residential", "Mobile Number"
    ];

    const tableRows = member.familyMembers?.map((fm, index) => [
      index + 1,
      fm.name,
      fm.occupation,
      fm.dateOfBirth ? new Date(fm.dateOfBirth).toLocaleDateString('en-GB') : '',
      fm.baptismStatus ? 'Yes' : 'No',
      fm.confirmationStatus ? 'Yes' : 'No',
      fm.maritalStatus ? 'Yes' : 'No',
      fm.aadharNumber || '',
      fm.residentialStatus ? 'Resident' : 'Non-Res',
      fm.mobile || ''
    ]);

    autoTable(doc, {
      startY: yPos + 10,
      head: [tableColumn],
      body: tableRows || [],
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fontSize: 10 // Increased font size
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [0, 0, 0],
        fontSize: 9, // Increased font size
        cellPadding: 3, // Increased padding
        valign: 'middle',
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 }, // S No
        1: { cellWidth: 50 }, // Full Name - Wider
        2: { cellWidth: 30 }, // Occupation - Wider
        3: { halign: 'center', cellWidth: 25 }, // DOB
        4: { halign: 'center', cellWidth: 20 }, // Baptism
        5: { halign: 'center', cellWidth: 25 }, // Confirmation
        6: { halign: 'center', cellWidth: 20 }, // Marital
        7: { halign: 'center', cellWidth: 30 }, // Aadhar - Wider
        8: { halign: 'center', cellWidth: 25 }, // Residential
        9: { halign: 'center', cellWidth: 25 }  // Mobile
      }
    });

    doc.save(`Family_Details_${member.memberSerialNum || member.memberCode}.pdf`);
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
                  {member.memberSerialNum && (
                    <Badge className="bg-blue-600 text-white">
                      {member.memberSerialNum.toString().padStart(4, '0')}
                    </Badge>
                  )}
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

              {onDeleteMember && (
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="outline"
                  className="border-red-500 text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Member
                </Button>
              )}
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
                  <User className="w-4 h-4 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Serial Number</p>
                    <p className="text-slate-900 font-mono">
                      {member.memberSerialNum ? member.memberSerialNum.toString().padStart(4, '0') : '-'}
                    </p>
                  </div>
                </div>
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
                      {member.dateOfBirth ? (
                        <>
                          {new Date(member.dateOfBirth).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                          <span className="text-slate-500 text-sm ml-2">
                            ({calculateAge(member.dateOfBirth)} years)
                          </span>
                        </>
                      ) : (
                        '-'
                      )}
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

      {/* Family Details Section */}
      {member.familyMembers && member.familyMembers.length > 0 && (
        <Card className="border-indigo-100 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Family Details (Serial No: {member.memberSerialNum?.toString().padStart(4, '0')})
            </CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>Family members registered under the same serial number</CardDescription>
              <Button
                onClick={handlePrintFamilyDetails}
                variant="outline"
                size="sm"
                className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Printer className="w-4 h-4" />
                Print Form
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[50px]">S.No</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Baptism</TableHead>
                    <TableHead>Confirmation</TableHead>
                    <TableHead>Marital</TableHead>
                    <TableHead>Aadhar No</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {member.familyMembers.map((fm) => (
                    <TableRow
                      key={fm.id}
                      className={`${fm.id === member.id ? "bg-blue-50/50" : "hover:bg-slate-50 cursor-pointer transition-colors"}`}
                      onClick={() => {
                        if (fm.id !== member.id && onMemberClick) {
                          onMemberClick(fm);
                        }
                      }}
                    >
                      <TableCell className="font-medium">{fm.memberOrder}</TableCell>
                      <TableCell className="font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          {fm.name}
                          {fm.isHeadOfFamily === "1" && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                              <Crown className="w-3 h-3 mr-1" />
                              Head
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{fm.occupation}</TableCell>
                      <TableCell>
                        {fm.dateOfBirth ? new Date(fm.dateOfBirth).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={fm.baptismStatus ? "default" : "secondary"} className={fm.baptismStatus ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                          {fm.baptismStatus ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={fm.confirmationStatus ? "default" : "secondary"} className={fm.confirmationStatus ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}>
                          {fm.confirmationStatus ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={fm.maritalStatus ? "bg-pink-50 text-pink-700 border-pink-200" : "bg-slate-50 text-slate-700 border-slate-200"}>
                          {fm.maritalStatus ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{fm.aadharNumber || '-'}</TableCell>
                      <TableCell>
                        <span className={fm.residentialStatus ? "text-green-700" : "text-amber-700"}>
                          {fm.residentialStatus ? 'Resident' : 'Non-Resident'}
                        </span>
                      </TableCell>
                      <TableCell>{fm.mobile || '-'}</TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        {fm.isHeadOfFamily !== "1" && onSetFamilyHead && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-200 text-amber-700 hover:bg-amber-50"
                            onClick={() => {
                              if (fm.id) {
                                onSetFamilyHead(fm.id);
                                toast.success(`${fm.name} is now the head of the family`);
                              }
                            }}
                          >
                            <Crown className="w-3 h-3 mr-1" />
                            Make Head
                          </Button>
                        )}
                        {fm.isHeadOfFamily === "1" && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                            <Crown className="w-3 h-3 mr-1" />
                            Current Head
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

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
                if (member.id) {
                  onUpdateMemberStatus(member.id, 'confirmed');
                  toast.success(`${member.name} has been confirmed as a member`);
                }
              }}
              disabled={member.memberStatus === 'confirmed'}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Member
            </Button>

            <Button
              onClick={() => {
                if (member.id) {
                  onUpdateMemberStatus(member.id, 'unconfirmed');
                  toast.success(`${member.name}'s status has been set to unconfirmed`);
                }
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
                if (member.id) {
                  onUpdateMemberStatus(member.id, 'suspended');
                  toast.success(`${member.name} has been suspended`);
                }
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
              <h2 className="text-green-900">₹{Number(totalContributions).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
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
              <h2 className="text-blue-900">₹{Number(averageContribution).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
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
              <h2 className="text-amber-900">₹{Number(thisMonthTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
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
      {
        Object.keys(offeringsByType).length > 0 && (
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
                    <p className="text-green-900 text-xl">₹{Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-slate-500 text-sm mt-1">
                      {totalContributions > 0 && !isNaN(amount) && !isNaN(totalContributions) && amount > 0
                        ? `${Math.round((amount / totalContributions) * 100)}% of total`
                        : '0% of total'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      }

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
                    <TableHead>Notes</TableHead>
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
                      <TableCell className="text-slate-600 text-sm">{offering.notes || '-'}</TableCell>
                      <TableCell className="text-right text-green-900">
                        ₹{Number(offering.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
        onResetPassword={handleResetPassword}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{member.name}</strong>?
              {offerings.length > 0 && (
                <span className="block mt-2 text-amber-700">
                  ⚠️ This member has {offerings.length} offering record(s). These will also be deleted.
                </span>
              )}
              <span className="block mt-2 text-red-700 font-semibold">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (onDeleteMember && member.id) {
                  onDeleteMember(member.id);
                  setShowDeleteDialog(false);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}