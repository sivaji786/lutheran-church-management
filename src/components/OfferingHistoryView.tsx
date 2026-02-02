import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, History, Clock, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Offering } from '../App';
import { apiClient } from '../services/api';
import { toast } from 'sonner';

type HistoryRecord = {
    id: string;
    offeringId: string;
    amount: number;
    offerType: string;
    paymentMode: string;
    date: string;
    notes: string | null;
    editedBy: string;
    createdAt: string;
};

type OfferingHistoryViewProps = {
    offering: Offering;
    onBack: () => void;
};

export function OfferingHistoryView({ offering, onBack }: OfferingHistoryViewProps) {
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.getOfferingHistory(offering.id!);
            if (response.success) {
                setHistory(response.data);
            } else {
                toast.error(response.message || 'Failed to load history');
            }
        } catch (error) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    }, [offering.id]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch (e) {
            return 'N/A';
        }
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return 'N/A';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Offering Edit History</h2>
                        <p className="text-muted-foreground">
                            Viewing history for {offering.memberName} ({offering.memberCode})
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
                    <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Original Receipt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold break-all">{offering.receiptNumber || 'N/A'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Current Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{offering.amount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Offer Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {offering.offerType}
                        </Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Payment Mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {offering.paymentMode}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                        <History className="w-5 h-5" />
                        Historical Records
                    </CardTitle>
                    <CardDescription>
                        Records of the offering before each update
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No edit history found for this offering.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-700">Modification Date</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Previous Amount</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Previous Type</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Previous Mode</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Previous Date</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium text-slate-600">
                                            {formatDateTime(record.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-orange-600 font-bold">
                                            ₹{record.amount.toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-blue-100 text-blue-600 bg-blue-50/30">
                                                {record.offerType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                {record.paymentMode}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {formatDate(record.date)}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-slate-500" title={record.notes || ''}>
                                            {record.notes || <span className="text-muted-foreground italic text-xs">No notes</span>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
