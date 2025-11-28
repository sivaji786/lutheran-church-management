import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { toast } from 'sonner';

export type NonMemberOffering = {
    id?: string;
    donorName: string;
    donorMobile?: string;
    donorEmail?: string;
    donorAddress?: string;
    date: string;
    amount: number;
    offerType: string;
    paymentMode: string;
    chequeNumber?: string;
    transactionId?: string;
    notes?: string;
    receiptNumber?: string;
};

type NonMemberOfferingFormProps = {
    onAddOffering: (offering: NonMemberOffering) => Promise<boolean>;
};

export function NonMemberOfferingForm({ onAddOffering }: NonMemberOfferingFormProps) {
    const [donorName, setDonorName] = useState('');
    const [donorMobile, setDonorMobile] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [donorAddress, setDonorAddress] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [offerType, setOfferType] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!donorName.trim()) {
            toast.error('Donor name is required');
            setIsSubmitting(false);
            return;
        }

        const newOffering: NonMemberOffering = {
            donorName: donorName.trim(),
            donorMobile: donorMobile.trim() || undefined,
            donorEmail: donorEmail.trim() || undefined,
            donorAddress: donorAddress.trim() || undefined,
            date,
            amount: parseFloat(amount),
            offerType,
            paymentMode,
            chequeNumber: paymentMode === 'Cheque' ? chequeNumber : undefined,
            transactionId: (paymentMode === 'UPI' || paymentMode === 'Bank Transfer') ? transactionId : undefined,
            notes: notes.trim() || undefined,
        };

        const success = await onAddOffering(newOffering);

        if (success) {
            toast.success('Guest offering recorded successfully!');

            // Reset form
            setDonorName('');
            setDonorMobile('');
            setDonorEmail('');
            setDonorAddress('');
            setDate(new Date().toISOString().split('T')[0]);
            setAmount('');
            setOfferType('');
            setPaymentMode('');
            setChequeNumber('');
            setTransactionId('');
            setNotes('');
        }
        setIsSubmitting(false);
    };

    const handleClear = () => {
        setDonorName('');
        setDonorMobile('');
        setDonorEmail('');
        setDonorAddress('');
        setDate(new Date().toISOString().split('T')[0]);
        setAmount('');
        setOfferType('');
        setPaymentMode('');
        setChequeNumber('');
        setTransactionId('');
        setNotes('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donor Information Section */}
            <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Donor Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="donorName">Donor Name *</Label>
                        <Input
                            id="donorName"
                            type="text"
                            placeholder="Enter donor name"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="donorMobile">Mobile Number</Label>
                        <Input
                            id="donorMobile"
                            type="tel"
                            placeholder="Enter mobile number"
                            value={donorMobile}
                            onChange={(e) => setDonorMobile(e.target.value)}
                            maxLength={15}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="donorEmail">Email Address</Label>
                        <Input
                            id="donorEmail"
                            type="email"
                            placeholder="Enter email address"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="donorAddress">Address</Label>
                        <Input
                            id="donorAddress"
                            type="text"
                            placeholder="Enter address"
                            value={donorAddress}
                            onChange={(e) => setDonorAddress(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Offering Details Section */}
            <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Offering Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="date">Offering Date *</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="offerType">Offer Type *</Label>
                        <Select value={offerType} onValueChange={setOfferType} required>
                            <SelectTrigger id="offerType">
                                <SelectValue placeholder="Select offer type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tithe">Tithe</SelectItem>
                                <SelectItem value="Thanksgiving">Thanksgiving</SelectItem>
                                <SelectItem value="Building Fund">Building Fund</SelectItem>
                                <SelectItem value="Mission">Mission</SelectItem>
                                <SelectItem value="Special Offering">Special Offering</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentMode">Payment Mode *</Label>
                        <Select value={paymentMode} onValueChange={setPaymentMode} required>
                            <SelectTrigger id="paymentMode">
                                <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Cheque">Cheque</SelectItem>
                                <SelectItem value="Card">Card</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Conditional fields based on payment mode */}
                    {paymentMode === 'Cheque' && (
                        <div className="space-y-2">
                            <Label htmlFor="chequeNumber">Cheque Number</Label>
                            <Input
                                id="chequeNumber"
                                type="text"
                                placeholder="Enter cheque number"
                                value={chequeNumber}
                                onChange={(e) => setChequeNumber(e.target.value)}
                            />
                        </div>
                    )}

                    {(paymentMode === 'UPI' || paymentMode === 'Bank Transfer') && (
                        <div className="space-y-2">
                            <Label htmlFor="transactionId">Transaction ID</Label>
                            <Input
                                id="transactionId"
                                type="text"
                                placeholder="Enter transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Notes field - full width */}
                <div className="space-y-2 mt-6">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                        id="notes"
                        className="w-full min-h-[80px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional notes (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                >
                    Clear Form
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                    {isSubmitting ? 'Recording...' : 'Record Offering'}
                </Button>
            </div>
        </form>
    );
}
