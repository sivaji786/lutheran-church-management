import React, { useState, useEffect } from 'react';
import { HandCoins, Download, FileDown, Search, Filter, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { NonMemberOfferingForm, NonMemberOffering } from './NonMemberOfferingForm';
import { apiClient } from '../services/api';
import { toast } from 'sonner';

type NonMemberOfferingsPageProps = {
    onBack: () => void;
    isSuperAdmin?: boolean;
};

type NonMemberOfferingsView = 'list' | 'add';

export function NonMemberOfferingsPage({ onBack, isSuperAdmin = false }: NonMemberOfferingsPageProps) {
    const [currentView, setCurrentView] = useState<NonMemberOfferingsView>('list');
    const [offerings, setOfferings] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [offerType, setOfferType] = useState('all');
    const [paymentMode, setPaymentMode] = useState('all');
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchOfferings = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getNonMemberOfferings({
                page,
                limit,
                search,
                startDate,
                endDate,
                offerType: offerType !== 'all' ? offerType : undefined,
                paymentMode: paymentMode !== 'all' ? paymentMode : undefined,
            });

            if (response.success) {
                setOfferings(response.data.offerings || []);
                setTotalRecords(response.data.pagination.totalRecords);
            }
        } catch (error) {
            toast.error('Failed to fetch guest offerings');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await apiClient.getNonMemberOfferingStatistics();
            if (response.success) {
                setStatistics(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    useEffect(() => {
        fetchOfferings();
        fetchStatistics();
    }, [page, search, startDate, endDate, offerType, paymentMode]);

    const handleAddOffering = async (offering: NonMemberOffering): Promise<boolean> => {
        try {
            const response = await apiClient.createNonMemberOffering(offering);
            if (response.success) {
                toast.success('Guest offering recorded successfully');
                fetchOfferings();
                fetchStatistics();
                setCurrentView('list');
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error(error.message || 'Failed to add guest offering');
            return false;
        }
    };

    const totalPages = Math.ceil(totalRecords / limit);
    const totalAmount = statistics?.totalAmount || 0;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + offerings.length;

    // Export to CSV
    const handleExportCSV = () => {
        if (offerings.length === 0) {
            toast.error('No offerings to export');
            return;
        }

        const headers = ['Date', 'Donor Name', 'Mobile', 'Address', 'Offer Type', 'Amount (₹)', 'Payment Mode'];
        const csvData = offerings.map(offering => [
            new Date(offering.date).toLocaleDateString('en-IN'),
            offering.donorName,
            offering.donorMobile || '',
            offering.donorAddress || '',
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
        link.setAttribute('download', `guest_offerings_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${offerings.length} offerings to CSV`);
    };

    // Export to Excel
    const handleExportExcel = () => {
        if (offerings.length === 0) {
            toast.error('No offerings to export');
            return;
        }

        import('xlsx').then((XLSX) => {
            const excelData = offerings.map(offering => ({
                'Date': new Date(offering.date).toLocaleDateString('en-IN'),
                'Donor Name': offering.donorName,
                'Mobile': offering.donorMobile || '',
                'Address': offering.donorAddress || '',
                'Offer Type': offering.offerType,
                'Amount (₹)': offering.amount,
                'Payment Mode': offering.paymentMode
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            worksheet['!cols'] = [
                { wch: 12 },
                { wch: 25 },
                { wch: 15 },
                { wch: 30 },
                { wch: 20 },
                { wch: 15 },
                { wch: 15 }
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Guest Offerings');
            XLSX.writeFile(workbook, `guest_offerings_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success(`Exported ${offerings.length} offerings to Excel`);
        }).catch((error) => {
            console.error('Error loading xlsx library:', error);
            toast.error('Failed to export Excel file');
        });
    };

    return (
        <div className="space-y-6">
            {currentView === 'list' && (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-blue-900 mb-2">All Guest Offerings</h1>
                            <p className="text-slate-600">View and manage all guest offering records with filters and export options.</p>
                        </div>
                        <Button
                            onClick={() => setCurrentView('add')}
                            className="bg-green-600 hover:bg-green-700 shadow-lg"
                        >
                            <HandCoins className="w-4 h-4 mr-2" />
                            Add New Offering
                        </Button>
                    </div>

                    <Card className="border-amber-100 shadow-elegant-lg">
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                {/* Toolbar */}
                                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                    {/* Search */}
                                    <div className="w-full lg:w-96">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search by name, mobile, or date..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-11 h-11"
                                            />
                                        </div>
                                    </div>

                                    {/* Export Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        {isSuperAdmin && (
                                            <>
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
                                            </>
                                        )}
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
                                            <Select value={offerType} onValueChange={setOfferType}>
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
                                            <Select value={paymentMode} onValueChange={setPaymentMode}>
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
                                                    <SelectItem value="Cover">Cover</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="filter-date" className="text-slate-600">Date:</Label>
                                            <Select value="all">
                                                <SelectTrigger id="filter-date" className="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Dates</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

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
                                        <HandCoins className="w-4 h-4" />
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
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-slate-50">
                                                        <TableHead className="w-12">#</TableHead>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Donor Name</TableHead>
                                                        <TableHead>Address</TableHead>
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
                                                            <TableCell>
                                                                <div className="text-slate-900">{offering.donorName}</div>
                                                                {offering.donorMobile && (
                                                                    <div className="text-xs text-slate-500">{offering.donorMobile}</div>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-slate-600">
                                                                {offering.donorAddress || '-'}
                                                            </TableCell>
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
                                                                ₹{Number(offering.amount).toLocaleString('en-IN')}
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
                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <div className="text-sm text-slate-600">
                                                Page {page} of {totalPages}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => setPage(1)}
                                                    disabled={page === 1}
                                                    variant="outline"
                                                    size="sm"
                                                    className="hidden sm:inline-flex"
                                                >
                                                    First
                                                </Button>

                                                <Button
                                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                                    disabled={page === 1}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Previous
                                                </Button>

                                                {/* Page Numbers */}
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (page <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (page >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = page - 2 + i;
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                onClick={() => setPage(pageNum)}
                                                                variant={page === pageNum ? 'default' : 'outline'}
                                                                size="sm"
                                                                className={page === pageNum ? 'bg-blue-600' : ''}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>

                                                <Button
                                                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={page === totalPages}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Next
                                                </Button>

                                                <Button
                                                    onClick={() => setPage(totalPages)}
                                                    disabled={page === totalPages}
                                                    variant="outline"
                                                    size="sm"
                                                    className="hidden sm:inline-flex"
                                                >
                                                    Last
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Total Badge - Bottom Right */}
                                    <div className="ml-auto">
                                        <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 text-base shadow-lg">
                                            <HandCoins className="w-4 h-4 mr-2" />
                                            Total: ₹{totalAmount.toLocaleString('en-IN')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {currentView === 'add' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setCurrentView('list')}
                            variant="outline"
                            className="border-slate-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Guest Offerings
                        </Button>
                    </div>
                    <div>
                        <h1 className="text-blue-900 mb-2">Record New Guest Offering</h1>
                        <p className="text-slate-600">Add a new offering from a guest or visitor.</p>
                    </div>
                    <Card className="border-green-100 shadow-elegant-lg">
                        <CardContent className="pt-6">
                            <NonMemberOfferingForm onAddOffering={handleAddOffering} />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
