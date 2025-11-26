import React, { useState } from 'react';
import { MessageSquarePlus, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Ticket } from '../App';
import { toast } from 'sonner';

type TicketFormProps = {
  memberCode: string;
  memberName: string;
  memberId: string;
  onAddTicket: (ticket: Ticket) => Promise<boolean>;
};

export function TicketForm({ memberCode, memberName, memberId, onAddTicket }: TicketFormProps) {
  const [category, setCategory] = useState<'Profile Update' | 'Suggestion' | 'Request' | 'Other'>('Profile Update');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!subject || !description) {
      toast.error('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // Generate ticket number
    const ticketNumber = `T${String(Date.now()).slice(-6)}`;

    const newTicket: Ticket = {
      ticketNumber,
      memberId,
      memberName,
      memberCode,
      category,
      subject,
      description,
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };

    const success = await onAddTicket(newTicket);

    if (success) {
      toast.success('Ticket submitted successfully!');

      // Reset form
      setCategory('Profile Update');
      setSubject('');
      setDescription('');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="border-blue-100 shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <MessageSquarePlus className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-blue-900">Raise a Ticket</h3>
              <p className="text-sm text-slate-600">Submit your request or suggestion</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Profile Update">Profile Update</SelectItem>
                  <SelectItem value="Suggestion">Suggestion</SelectItem>
                  <SelectItem value="Request">Request</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberCode">Member Code</Label>
              <Input
                id="memberCode"
                value={memberCode}
                disabled
                className="bg-slate-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your request"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your request..."
              className="min-h-32"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
