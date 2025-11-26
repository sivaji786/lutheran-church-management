import React from 'react';
import { Ticket as TicketIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Ticket } from '../App';

type MyTicketsProps = {
  tickets: Ticket[];
};

const getStatusColor = (status: Ticket['status']) => {
  switch (status) {
    case 'Open':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Updated':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Done':
      return 'bg-green-100 text-green-800 border-green-200';
  }
};

const getStatusIcon = (status: Ticket['status']) => {
  switch (status) {
    case 'Open':
      return <AlertCircle className="w-4 h-4" />;
    case 'In Progress':
      return <Clock className="w-4 h-4" />;
    case 'Updated':
      return <Clock className="w-4 h-4" />;
    case 'Done':
      return <CheckCircle2 className="w-4 h-4" />;
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

export function MyTickets({ tickets }: MyTicketsProps) {
  if (tickets.length === 0) {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-white">
        <TicketIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">No tickets yet</p>
        <p className="text-slate-400 text-sm mt-1">Your submitted tickets will appear here</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600">
        {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} total
      </div>
      
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="border-slate-200 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="border-slate-300">
                      {ticket.ticketNumber}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(ticket.category)}>
                      {ticket.category}
                    </Badge>
                  </div>
                  <h3 className="text-slate-900">{ticket.subject}</h3>
                </div>
                
                <div className="flex items-start gap-2">
                  <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1`}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {/* Admin Notes */}
              {ticket.adminNotes && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-sm text-blue-900">Admin Response</span>
                  </div>
                  <p className="text-sm text-blue-800">{ticket.adminNotes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Created: {new Date(ticket.createdDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated: {new Date(ticket.updatedDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
