import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { KeyRound, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Member } from '../App';

type AdminResetPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onResetPassword: (memberId: string, newPassword: string) => void;
};

export function AdminResetPasswordDialog({
  open,
  onOpenChange,
  member,
  onResetPassword,
}: AdminResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifyMember, setNotifyMember] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const validatePasswords = () => {
    const validationErrors: string[] = [];

    if (!newPassword) {
      validationErrors.push('New password is required');
    } else if (newPassword.length < 8) {
      validationErrors.push('New password must be at least 8 characters');
    }

    if (!confirmPassword) {
      validationErrors.push('Confirm password is required');
    } else if (newPassword !== confirmPassword) {
      validationErrors.push('New password and confirm password do not match');
    }

    return validationErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!member) return;

    const validationErrors = validatePasswords();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    onResetPassword(member.id, newPassword);

    // Reset form
    setNewPassword('');
    setConfirmPassword('');
    setNotifyMember(true);
    setErrors([]);
    onOpenChange(false);

    toast.success(
      `Password reset successfully for ${member.name}. ${notifyMember ? 'Member has been notified.' : ''}`
    );
  };

  const handleCancel = () => {
    setNewPassword('');
    setConfirmPassword('');
    setNotifyMember(true);
    setErrors([]);
    onOpenChange(false);
  };

  const handleAutoFill = () => {
    const defaultPassword = 'Member@123';
    setNewPassword(defaultPassword);
    setConfirmPassword(defaultPassword);
    toast.info(`Password set to default: ${defaultPassword}`, {
      description: 'Make sure to share this with the member securely.',
      duration: 5000,
    });
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-900">Reset Member Password</DialogTitle>
              <DialogDescription>
                Reset password for {member.name} ({member.memberCode})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
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

            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <strong>Admin Action:</strong> You are resetting the password for this member.
                They will need to use the new password to login.
              </AlertDescription>
            </Alert>

            {/* Member Info */}
            <div className="bg-slate-50 rounded-lg p-3 space-y-1">
              <p className="text-sm"><strong>Member:</strong> {member.name}</p>
              <p className="text-sm"><strong>Member Code:</strong> {member.memberCode}</p>
              <p className="text-sm"><strong>Mobile:</strong> {member.mobile}</p>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="newPassword">New Password</Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleAutoFill}
                  className="h-auto p-0 text-xs"
                >
                  Use Default (Member@123)
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Notify Member Checkbox */}
            <div className="flex items-start space-x-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Checkbox
                id="notifyMember"
                checked={notifyMember}
                onCheckedChange={(checked) => setNotifyMember(checked as boolean)}
              />
              <div className="space-y-1">
                <label
                  htmlFor="notifyMember"
                  className="text-sm text-blue-900 cursor-pointer"
                >
                  Notify member about password reset
                </label>
                <p className="text-xs text-blue-700">
                  Send notification to member's registered mobile number
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-sm text-slate-900">
                <strong>Password Requirements:</strong>
              </p>
              <ul className="text-xs text-slate-700 mt-2 space-y-1 list-disc pl-5">
                <li>At least 8 characters long</li>
                <li>Should contain letters and numbers (recommended)</li>
                <li>Member will be able to change it after logging in</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Reset Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
