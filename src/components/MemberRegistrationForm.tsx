import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Member } from '../App';

type MemberRegistrationFormProps = {
  onAddMember: (member: Member) => Promise<Member | null>;
  existingMembers: Member[];
};

export function MemberRegistrationForm({ onAddMember }: MemberRegistrationFormProps) {
  const [memberSerialNum, setMemberSerialNum] = useState('');
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [baptismStatus, setBaptismStatus] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState<'married' | 'unmarried' | 'widow'>('unmarried');
  const [residentialStatus, setResidentialStatus] = useState(true);
  const [aadharNumber, setAadharNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [ward, setWard] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newMember: Member = {
      memberSerialNum: parseInt(memberSerialNum),
      name,
      occupation,
      dateOfBirth,
      baptismStatus,
      confirmationStatus,
      maritalStatus,
      residentialStatus,
      aadharNumber,
      mobile,
      address,
      area,
      ward,
      remarks,
      memberCode: '', // Backend will generate this
      registrationDate: new Date().toISOString().split('T')[0],
      memberStatus: confirmationStatus ? 'confirmed' : 'unconfirmed',
    };

    const createdMember = await onAddMember(newMember);

    if (createdMember) {
      // Toast is handled by parent component

      // Reset form
      setMemberSerialNum('');
      setName('');
      setOccupation('');
      setDateOfBirth('');
      setBaptismStatus(false);
      setConfirmationStatus(false);
      setMaritalStatus('unmarried');
      setResidentialStatus(true);
      setAadharNumber('');
      setMobile('');
      setAddress('');
      setArea('');
      setWard('');
      setRemarks('');
    }
    setIsSubmitting(false);
  };

  const handleClearForm = () => {
    setMemberSerialNum('');
    setName('');
    setOccupation('');
    setDateOfBirth('');
    setBaptismStatus(false);
    setConfirmationStatus(false);
    setMaritalStatus('unmarried');
    setResidentialStatus(true);
    setAadharNumber('');
    setMobile('');
    setAddress('');
    setArea('');
    setWard('');
    setRemarks('');
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name and Occupation */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter member's full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation *</Label>
            <Input
              id="occupation"
              placeholder="Enter occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Row 2: DOB and Mobile */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter 10-digit or 13-digit (+91) number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^\d+]/g, ''))}
              pattern="^(\+\d{12}|\d{10})$"
              maxLength={mobile.startsWith('+') ? 13 : 10}
              required
            />
          </div>
        </div>

        {/* Row 3: Serial Number and Aadhar */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="memberSerialNum">Serial Number *</Label>
            <Input
              id="memberSerialNum"
              type="number"
              placeholder="Enter serial number (e.g. 1)"
              value={memberSerialNum}
              onChange={(e) => setMemberSerialNum(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aadharNumber">Aadhar Number (Optional)</Label>
            <Input
              id="aadharNumber"
              type="text"
              placeholder="Enter 12-digit Aadhar number (optional)"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, ''))}
              pattern="[0-9]{12}"
              maxLength={12}
            />
          </div>
        </div>

        {/* Row 4: Status Switches */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
            <div className="space-y-1">
              <Label htmlFor="baptismStatus" className="cursor-pointer">Baptism Status</Label>
              <p className="text-sm text-slate-500">
                {baptismStatus ? 'Yes' : 'No'}
              </p>
            </div>
            <Switch
              id="baptismStatus"
              checked={baptismStatus}
              onCheckedChange={setBaptismStatus}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
            <div className="space-y-1">
              <Label htmlFor="confirmationStatus" className="cursor-pointer">Confirmation Status</Label>
              <p className="text-sm text-slate-500">
                {confirmationStatus ? 'Confirmed' : 'Not Confirmed'}
              </p>
            </div>
            <Switch
              id="confirmationStatus"
              checked={confirmationStatus}
              onCheckedChange={setConfirmationStatus}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1 p-4 bg-white rounded-lg border border-slate-200">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select
              value={maritalStatus}
              onValueChange={(value: any) => setMaritalStatus(value as 'married' | 'unmarried' | 'widow')}
            >
              <SelectTrigger id="maritalStatus" className="w-full">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="unmarried">Unmarried</SelectItem>
                <SelectItem value="widow">Widow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
            <div className="space-y-1">
              <Label htmlFor="residentialStatus" className="cursor-pointer">Residential Status</Label>
              <p className="text-sm text-slate-500">
                {residentialStatus ? 'Resident' : 'Non-Resident'}
              </p>
            </div>
            <Switch
              id="residentialStatus"
              checked={residentialStatus}
              onCheckedChange={setResidentialStatus}
            />
          </div>
        </div>

        {/* Row 5: Address (Full Width) */}
        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Row 6: Area and Ward */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="area">Area *</Label>
            <Input
              id="area"
              placeholder="Enter area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ward">Ward *</Label>
            <Input
              id="ward"
              placeholder="Enter ward"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            placeholder="Enter any additional remarks (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClearForm}
          >
            Clear Form
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Member'}
          </Button>
        </div>
      </form>
    </Card>
  );
}