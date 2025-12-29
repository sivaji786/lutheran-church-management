import { useState, useEffect } from 'react';
import { Ticket as TicketIcon, ArrowLeft, Clock, MessageSquare, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Ticket, TicketHistory } from '../../App';
import { apiClient } from '../../services/api';

type TicketDetailPageProps = {
    ticket: Ticket;
    onUpdateTicket: (ticketId: string, status: Ticket['status'], adminNotes?: string) => Promise<void>;
    onBack: () => void;
};

const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
        case 'Open':
            return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'In Progress':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Resolved':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Closed':
            return 'bg-slate-100 text-slate-800 border-slate-200';
    }
};

const getCategoryColor = (category: Ticket['category']) => {
    switch (category) {
        case 'Profile Update':
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'Suggestion':
            return 'bg-green-50 text-green-700 border-green-200';
        case 'Request':
            return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'Other':
            return 'bg-slate-50 text-slate-700 border-slate-200';
    }
};

export function TicketDetailPage({ ticket, onUpdateTicket, onBack }: TicketDetailPageProps) {
    const [editingStatus, setEditingStatus] = useState<Ticket['status']>(ticket.status);
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketHistory, setTicketHistory] = useState<TicketHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Fetch ticket history on component mount
    useEffect(() => {
        const fetchHistory = async () => {
            if (!ticket.id) return;

            try {
                setLoadingHistory(true);
                const response = await apiClient.getTicketHistory(ticket.id);
                if (response.success && response.data) {
                    setTicketHistory(response.data);
                }
            } catch (error) {
                console.error('Error fetching ticket history:', error);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [ticket.id]);

    const handleUpdate = async () => {
        if (!ticket.id) return;

        setIsSubmitting(true);
        try {
            await onUpdateTicket(ticket.id, editingStatus, adminNotes);
            // Clear the notes textarea after successful update
            setAdminNotes('');
            // Refresh history
            const response = await apiClient.getTicketHistory(ticket.id);
            if (response.success && response.data) {
                setTicketHistory(response.data);
            }
            onBack();
        } catch (error) {
            console.error('Error updating ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tickets
                    </Button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
                            <TicketIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white text-3xl font-bold">Ticket Details</h1>
                            <p className="text-blue-100 text-lg">{ticket.ticketNumber}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="shadow-lg">
                        <CardContent className="p-8 space-y-6">
                            {/* Ticket Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-lg">
                                <div>
                                    <Label className="text-xs text-slate-600 uppercase tracking-wide">Member</Label>
                                    <p className="text-lg font-medium text-slate-900 mt-1">
                                        {ticket.memberName}
                                    </p>
                                    <p className="text-sm text-slate-500">{ticket.memberCode}</p>
                                </div>

                                <div>
                                    <Label className="text-xs text-slate-600 uppercase tracking-wide">Category</Label>
                                    <div className="mt-2">
                                        <Badge variant="outline" className={getCategoryColor(ticket.category)}>
                                            {ticket.category}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs text-slate-600 uppercase tracking-wide">Status</Label>
                                    <div className="mt-2">
                                        <Badge className={getStatusColor(ticket.status)}>
                                            {ticket.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs text-slate-600 uppercase tracking-wide">Created Date</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <p className="text-slate-900">
                                            {new Date(ticket.createdDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs text-slate-600 uppercase tracking-wide">Last Updated</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <p className="text-slate-900">
                                            {new Date(ticket.updatedDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700">Subject</Label>
                                <p className="mt-2 text-lg text-slate-900">{ticket.subject}</p>
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700">Description</Label>
                                <div className="mt-2 p-6 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-slate-900 whitespace-pre-wrap leading-relaxed">
                                        {ticket.description}
                                    </p>
                                </div>
                            </div>

                            {/* Ticket History / Comment Ladder */}
                            {ticketHistory.length > 0 && (
                                <>
                                    <div className="border-t border-slate-200 my-8"></div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-slate-600" />
                                            <h3 className="text-xl font-semibold text-slate-900">Conversation History</h3>
                                        </div>

                                        <div className="space-y-4">
                                            {ticketHistory.map((entry) => (
                                                <div key={entry.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <User className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="font-semibold text-slate-900">{entry.performedByName}</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {entry.performedByType === 'admin' ? 'Admin' : 'Member'}
                                                                </Badge>
                                                                <span className="text-xs text-slate-500">
                                                                    {new Date(entry.createdAt).toLocaleString('en-IN', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>

                                                            <div className="mt-2">
                                                                <p className="text-sm font-medium text-slate-700">{entry.action}</p>
                                                                {entry.oldStatus && entry.newStatus && (
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge className={getStatusColor(entry.oldStatus as Ticket['status'])}>
                                                                            {entry.oldStatus}
                                                                        </Badge>
                                                                        <span className="text-slate-400">→</span>
                                                                        <Badge className={getStatusColor(entry.newStatus as Ticket['status'])}>
                                                                            {entry.newStatus}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {entry.notes && (
                                                                    <div className="mt-3 p-3 bg-white rounded border border-slate-200">
                                                                        <p className="text-slate-900 whitespace-pre-wrap">{entry.notes}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Divider */}
                            <div className="border-t border-slate-200 my-8"></div>

                            {/* Admin Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-slate-900">Admin Actions</h3>

                                {/* Status Update */}
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm font-medium text-slate-700">
                                        Update Status
                                    </Label>
                                    <Select
                                        value={editingStatus}
                                        onValueChange={(value: Ticket['status']) => setEditingStatus(value)}
                                    >
                                        <SelectTrigger id="status" className="h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Admin Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="adminNotes" className="text-sm font-medium text-slate-700">
                                        Add Response
                                    </Label>
                                    <Textarea
                                        id="adminNotes"
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add your response or notes here..."
                                        className="min-h-32 resize-none"
                                    />
                                    <p className="text-xs text-slate-500">
                                        This response will be added to the conversation history and visible to the member.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={handleUpdate}
                                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Ticket'}
                                    </Button>
                                    <Button
                                        onClick={onBack}
                                        variant="outline"
                                        className="h-12 px-8"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
