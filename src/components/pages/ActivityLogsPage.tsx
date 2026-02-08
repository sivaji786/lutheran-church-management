import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Activity, Search, Filter, Loader2, ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";
import { apiClient } from '../../services/api';
import { toast } from "sonner";

type ActivityLog = {
    id: string;
    admin_id: string;
    admin_name: string;
    module: string;
    action: string;
    target_id: string;
    details: string;
    ip_address: string;
    created_at: string;
};

export function ActivityLogsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [moduleFilter, setModuleFilter] = useState("all");
    const [adminFilter, setAdminFilter] = useState("all");
    const [admins, setAdmins] = useState<{ id: string, username: string, name: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await apiClient.getAdminUsers();
            if (response.success) {
                setAdmins(response.data);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getActivityLogs({
                page: currentPage,
                limit: 20,
                search: searchTerm,
                module: moduleFilter,
                adminId: adminFilter
            });

            if (response.data.status === 200) {
                setLogs(response.data.data.logs);
                setTotalPages(response.data.data.pagination.totalPages);
                setTotalRecords(response.data.data.pagination.totalRecords);
            } else {
                toast.error("Failed to fetch activity logs");
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
            toast.error("Error loading activity logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchLogs();
        }, 500);

        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, moduleFilter, adminFilter]);

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create': return 'bg-green-100 text-green-800 border-green-200';
            case 'update': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delete': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 tracking-tight flex items-center gap-3">
                        <Activity className="w-8 h-8 text-blue-600" />
                        Activity Logs
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Monitor admin actions and changes across the system.
                    </p>
                </div>
                <Button variant="outline" onClick={fetchLogs} className="gap-2">
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card className="border-blue-100 shadow-elegant-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50/50 to-white border-b border-blue-50">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by admin, action, or details..."
                                className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter className="w-4 h-4 text-slate-500" />
                            <Select value={moduleFilter} onValueChange={setModuleFilter}>
                                <SelectTrigger className="w-full md:w-[200px] border-blue-200">
                                    <SelectValue placeholder="Filter by Module" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Modules</SelectItem>
                                    <SelectItem value="Members">Members</SelectItem>
                                    <SelectItem value="Offerings">Offerings</SelectItem>
                                    <SelectItem value="Guest Offerings">Guest Offerings</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={adminFilter} onValueChange={setAdminFilter}>
                                <SelectTrigger className="w-full md:w-[200px] border-blue-200">
                                    <SelectValue placeholder="Filter by Admin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Admins</SelectItem>
                                    {admins.map((admin) => (
                                        <SelectItem key={admin.id} value={admin.id}>
                                            {admin.name || admin.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                                    <TableHead className="w-[180px] font-semibold text-blue-900">Date & Time</TableHead>
                                    <TableHead className="w-[150px] font-semibold text-blue-900">Admin</TableHead>
                                    <TableHead className="w-[120px] font-semibold text-blue-900">Module</TableHead>
                                    <TableHead className="w-[100px] font-semibold text-blue-900">Action</TableHead>
                                    <TableHead className="font-semibold text-blue-900">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex justify-center items-center gap-2 text-blue-600">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Loading logs...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                            No activity logs found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900">{log.admin_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                                                    {log.module}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getActionColor(log.action)}>
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-600 max-w-md truncate md:whitespace-normal" title={log.details}>
                                                {log.details}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-4 border-t bg-slate-50/50">
                        <div className="text-sm text-slate-500">
                            Showing {logs.length} of {totalRecords} records
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || loading}
                                className="h-8 w-8 p-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-slate-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || loading}
                                className="h-8 w-8 p-0"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
