
import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import { Ticket, Search, Filter, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle, MessageSquare, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Ticket as TicketType } from '../App';
import { toast } from 'sonner';

export type TicketFilters = {
  page: number;
  limit: number;
  search: string;
  status: string;
  priority: string;
  category: string;
};

type AdminTicketsTableProps = {
  tickets: TicketType[];
  totalRecords: number;
  onUpdateTicket: (ticketId: string, status: TicketType['status'], adminNotes?: string) => Promise<void>;
  onViewTicket: (ticket: TicketType) => void;
  onFilterChange: (filters: TicketFilters) => void;
};

export function AdminTicketsTable({ tickets, totalRecords, onUpdateTicket, onViewTicket, onFilterChange }: AdminTicketsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Load persisted state from localStorage on mount
  useEffect(() => {
    const saved: any = storage.get('tickets_state');
    if (saved) {
      setStatusFilter(saved.statusFilter ?? 'all');
      setPriorityFilter(saved.priorityFilter ?? 'all');
      setCategoryFilter(saved.categoryFilter ?? 'all');
      setSearchTerm(saved.searchTerm ?? '');
      setCurrentPage(saved.currentPage ?? 1);
    }
  }, []);

  // Persist state to localStorage and notify parent whenever it changes
  useEffect(() => {
    storage.set('tickets_state', {
      statusFilter,
      priorityFilter,
      categoryFilter,
      searchTerm,
      currentPage,
    });

    onFilterChange({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      status: statusFilter === 'all' ? '' : statusFilter,
      priority: priorityFilter === 'all' ? '' : priorityFilter,
      category: categoryFilter === 'all' ? '' : categoryFilter,
    });
  }, [statusFilter, priorityFilter, categoryFilter, searchTerm, currentPage]);

  // Calculate pagination
  const totalPages: number = Math.ceil(totalRecords / itemsPerPage);
  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const endIndex: number = startIndex + tickets.length;

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, categoryFilter, searchTerm]);

  // Helper to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-amber-100 text-amber-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Helper to get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (tickets.length === 0 && !searchTerm && statusFilter === 'all' && priorityFilter === 'all' && categoryFilter === 'all') {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-white">
        <Ticket className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">No tickets found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="w-full lg:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by subject, description, or ticket #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700">Filters:</span>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="filter-status" className="text-slate-600">Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="filter-status" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="filter-priority" className="text-slate-600">Priority:</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger id="filter-priority" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="filter-category" className="text-slate-600">Category:</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="filter-category" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Profile Update">Profile Update</SelectItem>
                <SelectItem value="Suggestion">Suggestion</SelectItem>
                <SelectItem value="Request">Request</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
            <Button
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
                setSearchTerm('');
              }}
              variant="ghost"
              size="sm"
              className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4" />
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of{' '}
            {totalRecords} tickets
          </span>
        </div>
      </div>

      {/* Table */}
      {tickets.length === 0 ? (
        <div className="p-12 text-center bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
          <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">No tickets found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[100px]">Ticket #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-mono text-slate-500">
                      {ticket.ticketNumber}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {ticket.createdDate && !isNaN(new Date(ticket.createdDate).getTime()) ? new Date(ticket.createdDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{ticket.memberName}</div>
                      <div className="text-xs text-slate-500">{ticket.memberCode}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="font-medium text-slate-900 truncate">{ticket.subject}</div>
                      <div className="text-xs text-slate-500 truncate">{ticket.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-200 text-slate-700">
                        {ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority || 'low')}>
                        {ticket.priority || 'Low'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTicket(ticket)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    className={currentPage === pageNum ? 'bg-blue-600' : ''}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}