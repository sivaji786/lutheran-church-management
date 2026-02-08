import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { apiClient } from '../services/api';
import { User, Lock, Save, Shield, Edit2, X, RefreshCw } from 'lucide-react';

export function AdminProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Edit Profile State
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Maintenance State
    const [isReformatting, setIsReformatting] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.getAdminProfile();
            if (response.success) {
                setProfile(response.data);
                setEditName(response.data.name || '');
                setEditEmail(response.data.email || '');
            }
        } catch (error) {
            toast.error('Failed to load profile details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);

        try {
            const response = await apiClient.updateAdminProfile({
                name: editName,
                email: editEmail
            });

            if (response.success) {
                toast.success('Profile updated successfully');
                setProfile(response.data);
                setIsEditing(false);
            } else {
                toast.error(response.message || 'Failed to update profile');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setIsChangingPassword(true);

        try {
            const response = await apiClient.changeAdminPassword(currentPassword, newPassword);
            if (response.success) {
                toast.success('Password changed successfully');
                // Clear form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(response.message || 'Failed to change password');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleReformat = async () => {
        if (!window.confirm('Are you sure you want to reformat all member codes? This will sync all related data across the database.')) {
            return;
        }

        setIsReformatting(true);
        try {
            const response = await apiClient.reformatMemberCodes();
            if (response.success) {
                toast.success('Member codes reformatted successfully!');
                console.log('Maintenance results:', response.data);
            } else {
                toast.error(response.message || 'Failed to reformat codes');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to perform maintenance');
        } finally {
            setIsReformatting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-blue-900 mb-2">My Profile</h1>
                <p className="text-slate-600">View your account details and manage security settings.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Details Card */}
                <Card className="border-blue-100 shadow-elegant">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-blue-900">Account Details</CardTitle>
                                    <CardDescription>Your admin profile information</CardDescription>
                                </div>
                            </div>
                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                        id="edit-name"
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email Address</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-500">Username</Label>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-slate-600 text-sm">{profile?.username} (cannot be changed)</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                        disabled={isSavingProfile}
                                    >
                                        {isSavingProfile ? (
                                            'Saving...'
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditName(profile?.name || '');
                                            setEditEmail(profile?.email || '');
                                        }}
                                        disabled={isSavingProfile}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-500">Full Name</Label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium text-slate-900">{profile?.name || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-500">Username</Label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <Shield className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium text-slate-900">{profile?.username || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-500">Email Address</Label>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-slate-900">{profile?.email || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-500">Role</Label>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-slate-900 capitalize">{profile?.role || 'Admin'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Change Password Card */}
                <Card className="border-slate-200 shadow-elegant">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Lock className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <CardTitle className="text-slate-900">Security</CardTitle>
                                <CardDescription>Update your password</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 8 chars)"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-slate-800"
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? (
                                    'Updating...'
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Update Password
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {profile?.isSuperadmin === 'yes' && (
                <Card className="border-red-100 shadow-elegant">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <CardTitle className="text-red-900">System Maintenance</CardTitle>
                                <CardDescription>Critical system-wide maintenance tasks</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                            <h4 className="text-red-900 font-medium mb-1">Reformat Member Codes</h4>
                            <p className="text-red-700 text-sm mb-4">
                                This will reformat all member codes to the standard LCH-XXXX-X format and synchronize them across members,
                                offerings, and tickets tables. Use this if you notice inconsistent IDs in any table.
                            </p>
                            <Button
                                onClick={handleReformat}
                                variant="destructive"
                                disabled={isReformatting}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isReformatting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Reformatting...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reformat & Sync All Codes
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
