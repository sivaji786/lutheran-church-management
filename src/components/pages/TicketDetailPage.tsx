import React, { useState } from 'react';
import { Ticket as TicketIcon, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Ticket } from '../../App';
import { toast } from 'sonner';

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
    const [adminNotes, setAdminNotes] = useState(ticket.adminNotes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async () => {
        setIsSubmitting(true);
        await onUpdateTicket(ticket.id, editingStatus, adminNotes);
        // toast is handled in App.tsx or we can show it here if App.tsx doesn't. 
        // App.tsx shows toast.success('Ticket updated successfully');
        // But here we also had toast.success. I'll remove the one here to avoid duplicate, 
        // or keep it if App.tsx returns void and I want to be sure.
        // App.tsx: toast.success('Ticket updated successfully');
        // So I will remove it here.
        onBack();
        setIsSubmitting(false);
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
                                        Admin Notes / Response
                                    </Label>
                                    <Textarea
                                        id="adminNotes"
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add your response or notes here..."
                                        className="min-h-32 resize-none"
                                    />
                                    <p className="text-xs text-slate-500">
                                        These notes will be visible to the member when they view this ticket.
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
