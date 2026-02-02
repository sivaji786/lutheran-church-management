import { useState, useEffect } from 'react';
import {
    UserPlus,
    Search,
    Edit2,
    Trash2,
    Key,
    Shield,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    MoreVertical,
    RefreshCw,
    ArrowLeft
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './ui/select';
import { Label } from './ui/label';
import { apiClient } from '../services/api';
import { toast } from 'sonner';

interface AdminUser {
    id: string;
    username: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    isSuperadmin: string;
    isActive: number | boolean;
    lastLogin: string | null;
    createdAt: string;
}

export default function ChurchUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        mobile: '',
        role: 'admin',
        isSuperadmin: 'no',
        isActive: true
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getAdminUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiClient.createAdminUser(formData);
            if (response.success) {
                toast.success('User created successfully. Default password is admin123');
                setView('list');
                setFormData({
                    username: '',
                    name: '',
                    email: '',
                    mobile: '',
                    role: 'admin',
                    isSuperadmin: 'no',
                    isActive: true
                });
                fetchUsers();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create user');
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            const response = await apiClient.updateAdminUser(selectedUser.id, formData);
            if (response.success) {
                toast.success('User updated successfully');
                setView('list');
                fetchUsers();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const response = await apiClient.deleteAdminUser(id);
            if (response.success) {
                toast.success('User deleted successfully');
                fetchUsers();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete user');
        }
    };

    const handleResetPassword = async (id: string) => {
        if (!confirm('Are you sure you want to reset password to "admin123"?')) return;
        try {
            const response = await apiClient.resetAdminUserPassword(id);
            if (response.success) {
                toast.success('Password reset to admin123 successfully');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to reset password');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {view === 'list' && (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Church User Management</h1>
                            <p className="text-slate-500 text-sm">Manage administrative users and their access levels.</p>
                        </div>
                        <Button onClick={() => setView('add')} className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add New User
                        </Button>
                    </div>

                    <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="search"
                                        placeholder="Search users..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
                                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border border-slate-200">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-semibold">User</TableHead>
                                            <TableHead className="font-semibold">Role</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Super Admin</TableHead>
                                            <TableHead className="font-semibold">Last Login</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center">Loading users...</TableCell>
                                            </TableRow>
                                        ) : filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">No users found.</TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-slate-900">{user.name}</span>
                                                            <span className="text-xs text-slate-500">@{user.username} • {user.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.isActive ? (
                                                            <div className="flex items-center gap-1.5 text-green-600">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span className="text-xs font-medium">Active</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                                <XCircle className="w-3.5 h-3.5" />
                                                                <span className="text-xs font-medium">Inactive</span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.isSuperadmin === 'yes' ? (
                                                            <div className="flex items-center gap-1.5 text-amber-600">
                                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                                <span className="text-xs font-medium">Yes</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                                <Shield className="w-3.5 h-3.5" />
                                                                <span className="text-xs font-medium">No</span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-slate-500">
                                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Never'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setFormData({
                                                                        username: user.username,
                                                                        name: user.name,
                                                                        email: user.email,
                                                                        mobile: user.mobile,
                                                                        role: user.role,
                                                                        isSuperadmin: user.isSuperadmin,
                                                                        isActive: user.isActive ? true : false
                                                                    });
                                                                    setView('edit');
                                                                }}>
                                                                    <Edit2 className="w-4 h-4 mr-2" /> Edit User
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                                                                    <Key className="w-4 h-4 mr-2" /> Reset Password
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:text-red-600"
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    disabled={user.username === 'admin'}
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete User
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Add User View */}
            {view === 'add' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setView('list')}
                            variant="outline"
                            className="border-slate-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Users
                        </Button>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Add New Church User</h1>
                        <p className="text-slate-500 text-sm">Create a new administrative user. Default password will be <strong>admin123</strong>.</p>
                    </div>

                    <Card className="border-blue-100 shadow-elegant-lg max-w-2xl">
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="mobile">Mobile</Label>
                                        <Input
                                            id="mobile"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(v: string) => setFormData({ ...formData, role: v })}
                                        >
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="isSuperadmin">Is Super Admin?</Label>
                                        <Select
                                            value={formData.isSuperadmin}
                                            onValueChange={(v: string) => setFormData({ ...formData, isSuperadmin: v })}
                                        >
                                            <SelectTrigger id="isSuperadmin">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="yes">Yes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setView('list')}>Cancel</Button>
                                    <Button type="submit">Create User</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Edit User View */}
            {view === 'edit' && selectedUser && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setView('list')}
                            variant="outline"
                            className="border-slate-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Users
                        </Button>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Edit Church User</h1>
                        <p className="text-slate-500 text-sm">Update user information and access levels for <strong>@{selectedUser.username}</strong>.</p>
                    </div>

                    <Card className="border-amber-100 shadow-elegant-lg max-w-2xl">
                        <CardContent className="pt-6">
                            <form onSubmit={handleEditUser} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-username">Username</Label>
                                    <Input
                                        id="edit-username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-email">Email</Label>
                                        <Input
                                            id="edit-email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-mobile">Mobile</Label>
                                        <Input
                                            id="edit-mobile"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-role">Role</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(v: string) => setFormData({ ...formData, role: v })}
                                        >
                                            <SelectTrigger id="edit-role">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-isSuperadmin">Is Super Admin?</Label>
                                        <Select
                                            value={formData.isSuperadmin}
                                            onValueChange={(v: string) => setFormData({ ...formData, isSuperadmin: v })}
                                        >
                                            <SelectTrigger id="edit-isSuperadmin">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="yes">Yes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 py-2">
                                    <input
                                        type="checkbox"
                                        id="edit-active"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="edit-active">Account Active</Label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setView('list')}>Cancel</Button>
                                    <Button type="submit">Update User</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
