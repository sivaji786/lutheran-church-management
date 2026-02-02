import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Combobox, ComboboxOption } from './ui/combobox';
import { Card } from './ui/card';
import { Member, Offering } from '../App';
import { toast } from 'sonner';

type OfferingFormProps = {
  members: Member[];
  onAddOffering: (offering: Offering) => Promise<boolean>;
  preSelectedMemberId?: string;
};

export function OfferingForm({ members, onAddOffering, preSelectedMemberId }: OfferingFormProps) {
  const [selectedMemberId, setSelectedMemberId] = useState(preSelectedMemberId || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [offerType, setOfferType] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update selectedMemberId when preSelectedMemberId prop changes
  useEffect(() => {
    if (preSelectedMemberId) {
      setSelectedMemberId(preSelectedMemberId);
    }
  }, [preSelectedMemberId]);

  // Convert members to combobox options for searchable dropdown
  // Filter to show only heads of family (where memberCode equals headOfFamily)
  const memberOptions: ComboboxOption[] = useMemo(() => {
    return members
      .filter((member) => member.memberCode === member.headOfFamily)
      .map((member) => ({
        value: member.id || '',
        label: `${member.name} (${member.memberCode})`,
        searchText: `${member.name} ${member.memberCode} ${member.mobile || ''}`,
      }));
  }, [members]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedMember = members.find((m) => m.id === selectedMemberId);
    if (!selectedMember) {
      toast.error('Please select a member');
      setIsSubmitting(false);
      return;
    }

    if (selectedMember.memberStatus === 'suspended') {
      toast.error(`Cannot record offering for ${selectedMember.name} (Member is Suspended)`);
      setIsSubmitting(false);
      return;
    }

    const newOffering: Offering = {
      memberId: selectedMemberId,
      memberName: selectedMember.name,
      memberCode: selectedMember.memberCode,
      date,
      amount: parseFloat(amount),
      offerType,
      paymentMode,
      notes: notes.trim() || undefined,
    };

    const success = await onAddOffering(newOffering);

    if (success) {
      toast.success('Offering recorded successfully!');

      // Reset form
      setSelectedMemberId('');
      setDate(new Date().toISOString().split('T')[0]);
      setAmount('');
      setOfferType('');
      setPaymentMode('');
      setNotes('');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50/50 to-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="member">Select Member *</Label>
            <Combobox
              options={memberOptions}
              value={selectedMemberId}
              onValueChange={setSelectedMemberId}
              placeholder="Search by name or member code..."
              searchPlaceholder="Type to search members..."
              emptyText="No members found. Try a different search."
            />
          </div>

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
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
                <SelectItem value="Pledge">Pledge</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              <SelectItem value="Cover">Cover</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or remarks..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedMemberId('');
              setDate(new Date().toISOString().split('T')[0]);
              setAmount('');
              setOfferType('');
              setPaymentMode('');
              setNotes('');
            }}
          >
            Clear Form
          </Button>
          <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
            {isSubmitting ? 'Recording...' : 'Record Offering'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
