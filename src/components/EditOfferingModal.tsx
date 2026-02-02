import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Offering } from '../App';
import { toast } from 'sonner';

type EditOfferingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    offering: Offering;
    onUpdate: (id: string, data: any) => Promise<boolean>;
};

export function EditOfferingModal({ isOpen, onClose, offering, onUpdate }: EditOfferingModalProps) {
    const [date, setDate] = useState(offering.date.split('T')[0]);
    const [amount, setAmount] = useState(offering.amount.toString());
    const [offerType, setOfferType] = useState(offering.offerType);
    const [paymentMode, setPaymentMode] = useState(offering.paymentMode);
    const [notes, setNotes] = useState(offering.notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update states when offering prop changes
    useEffect(() => {
        setDate(offering.date.split('T')[0]);
        setAmount(offering.amount.toString());
        setOfferType(offering.offerType);
        setPaymentMode(offering.paymentMode);
        setNotes(offering.notes || '');
    }, [offering]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updatedData = {
            date,
            amount: parseFloat(amount),
            offerType,
            paymentMode,
            notes: notes.trim() || null,
        };

        const success = await onUpdate(offering.id!, updatedData);

        if (success) {
            toast.success('Offering updated successfully!');
            onClose();
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-blue-900">Edit Offering - {offering.memberName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-date">Offering Date *</Label>
                            <Input
                                id="edit-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-amount">Amount (₹) *</Label>
                            <Input
                                id="edit-amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-offerType">Offer Type *</Label>
                            <Select value={offerType} onValueChange={setOfferType} required>
                                <SelectTrigger id="edit-offerType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tithe">Tithe</SelectItem>
                                    <SelectItem value="Thanksgiving">Thanksgiving</SelectItem>
                                    <SelectItem value="Building Fund">Building Fund</SelectItem>
                                    <SelectItem value="Mission">Mission</SelectItem>
                                    <SelectItem value="Special Offering">Special Offering</SelectItem>
                                    <SelectItem value="Pledge">Pledge</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-paymentMode">Payment Mode *</Label>
                            <Select value={paymentMode} onValueChange={setPaymentMode} required>
                                <SelectTrigger id="edit-paymentMode">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                    <SelectItem value="Card">Card</SelectItem>
                                    <SelectItem value="Cover">Cover</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-notes">Notes (Optional)</Label>
                        <textarea
                            id="edit-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                            placeholder="Add notes..."
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
