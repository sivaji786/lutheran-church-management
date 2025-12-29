import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import { DollarSign, Filter, Search, Download, ChevronLeft, ChevronRight, FileDown, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Offering } from '../App';
import { toast } from 'sonner';

export type OfferingFilters = {
  page: number;
  limit: number;
  search: string;
  offerType: string;
  paymentMode: string;
  startDate?: string;
  endDate?: string;
};

type DateFilterPreset = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

type OfferingsTableProps = {
  offerings: Offering[];
  totalRecords: number;
  onFilterChange: (filters: OfferingFilters) => void;
};

export function OfferingsTable({ offerings, totalRecords, onFilterChange }: OfferingsTableProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPaymentMode, setFilterPaymentMode] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dateFilterPreset, setDateFilterPreset] = useState<DateFilterPreset>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    const saved: any = storage.get('offerings_state');
    if (saved) {
      setFilterType(saved.filterType ?? 'all');
      setFilterPaymentMode(saved.filterPaymentMode ?? 'all');
      setSearchTerm(saved.searchTerm ?? '');
      setCurrentPage(saved.currentPage ?? 1);
      setDateFilterPreset(saved.dateFilterPreset ?? 'all');
      setFromDate(saved.fromDate ?? '');
      setToDate(saved.toDate ?? '');
      setPageSize(saved.pageSize ?? 10);
    }
  }, []);

  // Persist state to localStorage and notify parent whenever it changes
  useEffect(() => {
    storage.set('offerings_state', {
      filterType,
      filterPaymentMode,
      searchTerm,
      currentPage,
      dateFilterPreset,
      fromDate,
      toDate,
      pageSize,
    });

    const { from, to } = getDateRange(dateFilterPreset);

    onFilterChange({
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      offerType: filterType,
      paymentMode: filterPaymentMode,
      startDate: from ? from.toISOString().split('T')[0] : undefined,
      endDate: to ? to.toISOString().split('T')[0] : undefined,
    });
  }, [filterType, filterPaymentMode, searchTerm, currentPage, dateFilterPreset, fromDate, toDate, pageSize]);

  const getDateRange = (preset: DateFilterPreset) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (preset) {
      case 'today':
        return { from: today, to: new Date(today.getTime() + 86400000 - 1) };
      case 'week': {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return { from: weekStart, to: weekEnd };
      }
      case 'month': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { from: monthStart, to: monthEnd };
      }
      case 'year': {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { from: yearStart, to: yearEnd };
      }
      case 'custom':
        return {
          from: fromDate ? new Date(fromDate) : null,
          to: toDate ? new Date(toDate + 'T23:59:59') : null,
        };
      default:
        return { from: null, to: null };
    }
  };

  // Calculate pagination
  const totalPages: number = Math.ceil(totalRecords / pageSize);
  const startIndex: number = (currentPage - 1) * pageSize;
  const endIndex: number = startIndex + offerings.length;

  // Reset to page 1 when filters or search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterPaymentMode, searchTerm, dateFilterPreset, fromDate, toDate, pageSize]);

  const totalAmount: number = offerings.reduce((sum: number, offering: Offering) => sum + Number(offering.amount), 0);

  // Export to CSV
  const handleExportCSV = () => {
    if (offerings.length === 0) {
      toast.error('No offerings to export');
      return;
    }

    const headers = ['Date', 'Member Code', 'Member Name', 'Offer Type', 'Amount (₹)', 'Payment Mode'];
    const csvData = offerings.map(offering => [
      new Date(offering.date).toLocaleDateString('en-IN'),
      offering.memberCode || '',
      offering.memberName,
      offering.offerType,
      offering.amount.toString(),
      offering.paymentMode
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `offerings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${offerings.length} offerings to CSV`);
  };

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    if (offerings.length === 0) {
      toast.error('No offerings to export');
      return;
    }

    // Dynamic import of xlsx library
    import('xlsx').then((XLSX) => {
      // Prepare data for Excel
      const excelData = offerings.map(offering => ({
        'Date': new Date(offering.date).toLocaleDateString('en-IN'),
        'Member Code': offering.memberCode || '',
        'Member Name': offering.memberName,
        'Offer Type': offering.offerType,
        'Amount (₹)': offering.amount,
        'Payment Mode': offering.paymentMode
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      worksheet['!cols'] = [
        { wch: 12 }, // Date
        { wch: 12 }, // Member Code
        { wch: 25 }, // Member Name
        { wch: 20 }, // Offer Type
        { wch: 15 }, // Amount
        { wch: 15 }  // Payment Mode
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Offerings');

      // Generate Excel file
      XLSX.writeFile(workbook, `offerings_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success(`Exported ${offerings.length} offerings to Excel`);
    }).catch((error) => {
      console.error('Error loading xlsx library:', error);
      toast.error('Failed to export Excel file');
    });
  };

  if (offerings.length === 0 && !searchTerm && filterType === 'all' && filterPaymentMode === 'all' && dateFilterPreset === 'all') {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-white">
        <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">No offering records yet</p>
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
              placeholder="Search by member, type, amount, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11"
            />
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <Button
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
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
            <Label htmlFor="filter-type" className="text-slate-600">Type:</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Tithe">Tithe</SelectItem>
                <SelectItem value="Thanksgiving">Thanksgiving</SelectItem>
                <SelectItem value="Building Fund">Building Fund</SelectItem>
                <SelectItem value="Mission">Mission</SelectItem>
                <SelectItem value="Special Offering">Special Offering</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="filter-payment" className="text-slate-600">Payment:</Label>
            <Select value={filterPaymentMode} onValueChange={setFilterPaymentMode}>
              <SelectTrigger id="filter-payment" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="filter-date" className="text-slate-600">Date:</Label>
            <Select value={dateFilterPreset} onValueChange={setDateFilterPreset}>
              <SelectTrigger id="filter-date" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateFilterPreset === 'custom' && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-40"
              />
              <span className="text-slate-500">to</span>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-40"
              />
              <Button
                onClick={() => setDateFilterPreset('all')}
                variant="outline"
                className="text-slate-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="ml-auto">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Total: ₹{totalAmount.toLocaleString('en-IN')}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of{' '}
            {totalRecords} offerings
          </span>
        </div>
      </div>

      {/* Table */}
      {offerings.length === 0 ? (
        <div className="p-12 text-center bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
          <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">No offerings found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterPaymentMode('all');
              setDateFilterPreset('all');
              setFromDate('');
              setToDate('');
            }}
            variant="outline"
            className="mt-4"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Member Code</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Offer Type</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offerings.map((offering, index) => (
                  <TableRow key={offering.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="text-slate-500">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(offering.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{offering.memberCode}</TableCell>
                    <TableCell className="text-slate-900">{offering.memberName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {offering.offerType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {offering.paymentMode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-700">
                      ₹{offering.amount.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Total Badge and Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        {/* Pagination - Bottom Left/Center */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Rows per page:</span>
              <Select value={pageSize.toString()} onValueChange={(value: string) => setPageSize(Number(value))}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                First
              </Button>

              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>

              {/* Page Numbers */}
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
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Last
              </Button>
            </div>
          </div>
        )}

        {/* Total Badge - Bottom Right (under Amount column) */}
        <div className="ml-auto">
          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 text-base shadow-lg">
            <DollarSign className="w-4 h-4 mr-2" />
            Total: ₹{totalAmount.toLocaleString('en-IN')}
          </Badge>
        </div>
      </div>
    </div>
  );
}