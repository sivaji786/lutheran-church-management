import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Save, AlertCircle, User, MapPin, Church, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Member } from '../App';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';

type EditMemberPageProps = {
  member: Member | null;
  onUpdateMember: (memberId: string, updatedData: Partial<Member>) => Promise<boolean>;
  existingMembers: Member[];
  onBack: () => void;
};

export function EditMemberPage({
  member,
  onUpdateMember,
  existingMembers,
  onBack,
}: EditMemberPageProps) {
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        occupation: member.occupation,
        dateOfBirth: member.dateOfBirth,
        baptismStatus: member.baptismStatus,
        confirmationStatus: member.confirmationStatus,
        maritalStatus: member.maritalStatus,
        residentialStatus: member.residentialStatus,
        aadharNumber: member.aadharNumber,
        mobile: member.mobile,
        address: member.address,
        area: member.area,
        ward: member.ward,
        remarks: member.remarks,
        memberSerialNum: member.memberSerialNum,
      });
    }
  }, [member]);

  const validateForm = () => {
    const validationErrors: string[] = [];

    if (!formData.name?.trim()) {
      validationErrors.push('Name is required');
    }

    if (!formData.mobile?.trim()) {
      validationErrors.push('Mobile number is required');
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      validationErrors.push('Mobile number must be exactly 10 digits');
    } else {
      const mobileExists = existingMembers.some(
        m => m.mobile === formData.mobile && m.id !== member?.id
      );
      if (mobileExists) {
        validationErrors.push('This mobile number is already registered');
      }
    }

    if (!formData.dateOfBirth) {
      validationErrors.push('Date of birth is required');
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member) return;

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before saving');
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    const payload = { ...formData };

    // Auto-update member status if confirmation status is set to true and member is currently unconfirmed
    if (payload.confirmationStatus === true && member.memberStatus === 'unconfirmed') {
      payload.memberStatus = 'confirmed';
    }

    const success = await onUpdateMember(member.id!, payload);

    if (success) {
      toast.success(`Member ${formData.name} updated successfully`);
      onBack();
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setErrors([]);
    onBack();
  };

  if (!member) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Member Details
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-600 text-white">
            {member.memberCode}
          </Badge>
        </div>
      </div>

      {/* Page Title */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white shadow-lg">
            <span className="text-2xl">{member.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-blue-900 text-2xl mb-1">Edit Member Details</h1>
            <p className="text-slate-600">Update information for {member.name}</p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="border-blue-100 shadow-elegant-lg">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </TabsTrigger>
                <TabsTrigger value="church" className="flex items-center gap-2">
                  <Church className="w-4 h-4" />
                  Church Status
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notes
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="memberSerialNum" className="text-slate-900">
                      Serial Number
                    </Label>
                    <Input
                      id="memberSerialNum"
                      type="number"
                      value={formData.memberSerialNum || ''}
                      onChange={(e) => setFormData({ ...formData, memberSerialNum: parseInt(e.target.value) || undefined })}
                      placeholder="Enter serial number"
                      className="h-11"
                    />
                    <p className="text-xs text-amber-600">
                      Warning: Changing this will regenerate the Member Code.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-900">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation" className="text-slate-900">
                      Occupation
                    </Label>
                    <Input
                      id="occupation"
                      value={formData.occupation || ''}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      placeholder="Enter occupation"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-slate-900">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth || ''}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-slate-900">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobile"
                      value={formData.mobile || ''}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="10 digit mobile number"
                      maxLength={10}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="aadharNumber" className="text-slate-900">
                      Aadhar Number
                    </Label>
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber || ''}
                      onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                      placeholder="Enter Aadhar number"
                      className="h-11"
                    />
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Note:</strong> Member Code ({member.memberCode}) and Registration Date cannot be changed.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Address Information Tab */}
              <TabsContent value="address" className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-900">
                      Complete Address
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter complete address"
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-slate-900">
                        Area
                      </Label>
                      <Input
                        id="area"
                        value={formData.area || ''}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="Enter area"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ward" className="text-slate-900">
                        Ward
                      </Label>
                      <Input
                        id="ward"
                        value={formData.ward || ''}
                        onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                        placeholder="Enter ward"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Church Status Tab */}
              <TabsContent value="church" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id="baptismStatus"
                          checked={formData.baptismStatus || false}
                          onCheckedChange={(checked: boolean) =>
                            setFormData({ ...formData, baptismStatus: checked })
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="baptismStatus" className="text-slate-900 cursor-pointer block mb-1">
                            Baptism Status
                          </label>
                          <p className="text-sm text-slate-500">
                            Member has received baptism
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id="confirmationStatus"
                          checked={formData.confirmationStatus || false}
                          onCheckedChange={(checked: boolean) =>
                            setFormData({ ...formData, confirmationStatus: checked })
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="confirmationStatus" className="text-slate-900 cursor-pointer block mb-1">
                            Confirmation Status
                          </label>
                          <p className="text-sm text-slate-500">
                            Member has been confirmed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id="maritalStatus"
                          checked={formData.maritalStatus || false}
                          onCheckedChange={(checked: boolean) =>
                            setFormData({ ...formData, maritalStatus: checked })
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="maritalStatus" className="text-slate-900 cursor-pointer block mb-1">
                            Marital Status
                          </label>
                          <p className="text-sm text-slate-500">
                            Member is married
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id="residentialStatus"
                          checked={formData.residentialStatus || false}
                          onCheckedChange={(checked: boolean) =>
                            setFormData({ ...formData, residentialStatus: checked })
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="residentialStatus" className="text-slate-900 cursor-pointer block mb-1">
                            Residential Status
                          </label>
                          <p className="text-sm text-slate-500">
                            Member is a resident
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="remarks" className="text-slate-900">
                    Remarks / Additional Notes
                  </Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Enter any additional notes, remarks, or special instructions about this member..."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-slate-500">
                    This information is only visible to administrators
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons - Fixed at Bottom */}
        <Card className="border-blue-100 shadow-elegant sticky bottom-4 mt-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Make sure all required fields are filled correctly before saving
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="min-w-[120px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
