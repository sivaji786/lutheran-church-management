import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import { User, Search, Download, Upload, ChevronLeft, ChevronRight, FileDown, FileUp, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Settings2, Eye, EyeOff, IndianRupee } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Member } from '../App';
import { toast } from 'sonner';

export type MemberFilters = {
  page: number;
  limit: number;
  search: string;
  baptismStatus: string;
  confirmationStatus: string;
  maritalStatus: string;
  residentialStatus: string;
  occupation: string;
  ward: string;
  birthday: boolean;
  sortBy: string;
  sortOrder: string;
};

type MembersTableProps = {
  members: Member[];
  allMembers?: Member[];
  totalRecords: number;
  onImportMembers?: (members: Member[]) => void;
  onMemberClick?: (member: Member) => void;
  onAddOffering?: (member: Member) => void;
  initialBirthdayFilter?: boolean;
  onFilterChange: (filters: MemberFilters) => void;
};

export function MembersTable({ members, allMembers, totalRecords, onImportMembers, onMemberClick, onAddOffering, initialBirthdayFilter, onFilterChange }: MembersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [baptismFilter, setBaptismFilter] = useState<string>('all');
  const [confirmationFilter, setConfirmationFilter] = useState<string>('all');
  const [maritalFilter, setMaritalFilter] = useState<string>('all');
  const [residentialFilter, setResidentialFilter] = useState<string>('all');
  const [occupationFilter, setOccupationFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [birthdayFilter, setBirthdayFilter] = useState<boolean>(initialBirthdayFilter || false);
  const [showFilters, setShowFilters] = useState(initialBirthdayFilter || false);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serialNo: true,
    memberCode: true,
    fullName: true,
    occupation: true,
    dob: true,
    baptism: true,
    confirmation: true,
    marital: true,
    residential: true,
    aadhar: true,
    mobile: true,
    ward: true,
    remarks: true,
  });
  const itemsPerPage = 10;

  // Load persisted state from localStorage on mount
  useEffect(() => {
    const saved: any = storage.get('members_state');
    if (saved) {
      setSearchTerm(saved.searchTerm ?? '');
      setCurrentPage(saved.currentPage ?? 1);
      setBaptismFilter(saved.baptismFilter ?? 'all');
      setConfirmationFilter(saved.confirmationFilter ?? 'all');
      setMaritalFilter(saved.maritalFilter ?? 'all');
      setResidentialFilter(saved.residentialFilter ?? 'all');
      setOccupationFilter(saved.occupationFilter ?? 'all');
      setWardFilter(saved.wardFilter ?? 'all');
      setBirthdayFilter(saved.birthdayFilter ?? false);
      setShowFilters(saved.showFilters ?? false);
      setSortColumn(saved.sortColumn ?? 'created_at');
      setSortDirection(saved.sortDirection ?? 'desc');
      if (saved.visibleColumns) {
        setVisibleColumns(saved.visibleColumns);
      }
    }
  }, []);

  // Persist state to localStorage and notify parent whenever it changes
  useEffect(() => {
    storage.set('members_state', {
      searchTerm,
      currentPage,
      baptismFilter,
      confirmationFilter,
      maritalFilter,
      residentialFilter,
      occupationFilter,
      wardFilter,
      birthdayFilter,
      showFilters,
      sortColumn,
      sortDirection,
      visibleColumns,
    });

    onFilterChange({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      baptismStatus: baptismFilter,
      confirmationStatus: confirmationFilter,
      maritalStatus: maritalFilter,
      residentialStatus: residentialFilter,
      occupation: occupationFilter,
      ward: wardFilter,
      birthday: birthdayFilter,
      sortBy: sortColumn,
      sortOrder: sortDirection,
    });
  }, [searchTerm, currentPage, baptismFilter, confirmationFilter, maritalFilter, residentialFilter, occupationFilter, wardFilter, birthdayFilter, showFilters, sortColumn, sortDirection]);

  // Check if any filters are active
  const hasActiveFilters = baptismFilter !== 'all' || confirmationFilter !== 'all' ||
    maritalFilter !== 'all' || residentialFilter !== 'all' || occupationFilter !== 'all' || wardFilter !== 'all' || birthdayFilter || searchTerm !== '';

  // Clear all filters
  const clearFilters = () => {
    setBaptismFilter('all');
    setConfirmationFilter('all');
    setMaritalFilter('all');
    setResidentialFilter('all');
    setOccupationFilter('all');
    setWardFilter('all');
    setBirthdayFilter(false);
    setSearchTerm('');
    setCurrentPage(1);
    setSortColumn('created_at');
    setSortDirection('desc');
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + members.length;

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Helper to filter members for export
  const getFilteredMembers = () => {
    const sourceMembers = allMembers || members;

    return sourceMembers.filter(member => {
      // Search Term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          member.name.toLowerCase().includes(searchLower) ||
          member.memberCode.toLowerCase().includes(searchLower) ||
          member.mobile.includes(searchTerm) ||
          member.name.toLowerCase().includes(searchLower) ||
          member.memberCode.toLowerCase().includes(searchLower) ||
          member.mobile.includes(searchTerm) ||
          member.occupation.toLowerCase().includes(searchLower) ||
          (member.memberSerialNum && member.memberSerialNum.toString().includes(searchTerm)) ||
          member.aadharNumber.includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Baptism Status
      if (baptismFilter !== 'all') {
        const isBaptized = baptismFilter === 'yes';
        if (member.baptismStatus !== isBaptized) return false;
      }

      // Confirmation Status
      if (confirmationFilter !== 'all') {
        const isConfirmed = confirmationFilter === 'confirmed';
        if (member.confirmationStatus !== isConfirmed) return false;
      }

      // Marital Status
      if (maritalFilter !== 'all') {
        const isMarried = maritalFilter === 'married';
        if (member.maritalStatus !== isMarried) return false;
      }

      // Residential Status
      if (residentialFilter !== 'all') {
        const isResident = residentialFilter === 'resident';
        if (member.residentialStatus !== isResident) return false;
      }

      // Occupation Filter
      if (occupationFilter !== 'all') {
        if (member.occupation !== occupationFilter) return false;
      }

      // Ward Filter
      if (wardFilter !== 'all') {
        if (member.ward !== wardFilter) return false;
      }

      // Birthday Filter
      if (birthdayFilter) {
        const today = new Date();
        const dob = new Date(member.dateOfBirth);
        if (dob.getMonth() !== today.getMonth() || dob.getDate() !== today.getDate()) return false;
      }

      return true;
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const membersToExport = getFilteredMembers();

    if (membersToExport.length === 0) {
      toast.error('No members to export');
      return;
    }

    const headers = [
      'Serial No',
      'Member Code',
      'Full Name',
      'Occupation',
      'Date of Birth',
      'Baptism Status',
      'Confirmation Status',
      'Marital Status',
      'Residential Status',
      'Aadhar Number',
      'Mobile Number',
      'Address',
      'Area',
      'Ward',
      'Registration Date',
      'Member Status',
      'Remarks'
    ];

    const csvData = membersToExport.map(member => [
      member.memberSerialNum ? member.memberSerialNum.toString().padStart(4, '0') : '',
      member.memberCode,
      member.name,
      member.occupation,
      member.dateOfBirth,
      member.baptismStatus ? 'Yes' : 'No',
      member.confirmationStatus ? 'Confirmed' : 'Not Confirmed',
      member.maritalStatus ? 'Married' : 'Unmarried',
      member.residentialStatus ? 'Resident' : 'Non-Resident',
      member.aadharNumber,
      member.mobile,
      member.address,
      member.area,
      member.ward,
      member.registrationDate,
      member.memberStatus,
      member.remarks
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `members_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${membersToExport.length} members to CSV`);
  };

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    const membersToExport = getFilteredMembers();

    if (membersToExport.length === 0) {
      toast.error('No members to export');
      return;
    }

    // Dynamic import of xlsx library
    import('xlsx').then((XLSX) => {
      // Prepare data for Excel
      const excelData = membersToExport.map(member => ({
        'Serial No': member.memberSerialNum ? member.memberSerialNum.toString().padStart(4, '0') : '',
        'Member Code': member.memberCode,
        'Full Name': member.name,
        'Occupation': member.occupation,
        'Date of Birth': member.dateOfBirth,
        'Baptism Status': member.baptismStatus ? 'Yes' : 'No',
        'Confirmation Status': member.confirmationStatus ? 'Confirmed' : 'Not Confirmed',
        'Marital Status': member.maritalStatus ? 'Married' : 'Unmarried',
        'Residential Status': member.residentialStatus ? 'Resident' : 'Non-Resident',
        'Aadhar Number': member.aadharNumber,
        'Mobile Number': member.mobile,
        'Address': member.address,
        'Area': member.area,
        'Ward': member.ward,
        'Registration Date': member.registrationDate,
        'Member Status': member.memberStatus,
        'Remarks': member.remarks
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      worksheet['!cols'] = [
        { wch: 10 }, // Serial No
        { wch: 15 }, // Member Code
        { wch: 25 }, // Full Name
        { wch: 20 }, // Occupation
        { wch: 15 }, // Date of Birth
        { wch: 15 }, // Baptism Status
        { wch: 18 }, // Confirmation Status
        { wch: 15 }, // Marital Status
        { wch: 18 }, // Residential Status
        { wch: 18 }, // Aadhar Number
        { wch: 15 }, // Mobile Number
        { wch: 30 }, // Address
        { wch: 15 }, // Area
        { wch: 10 }, // Ward
        { wch: 15 }, // Registration Date
        { wch: 15 }, // Member Status
        { wch: 30 }  // Remarks
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

      // Generate Excel file
      XLSX.writeFile(workbook, `members_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success(`Exported ${membersToExport.length} members to Excel`);
    }).catch((error) => {
      console.error('Error loading xlsx library:', error);
      toast.error('Failed to export Excel file');
    });
  };

  // Import from CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          toast.error('CSV file is empty or invalid');
          return;
        }

        // Parse CSV (skip header)
        const importedMembers: Member[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());

          if (values.length >= 11) {
            importedMembers.push({
              id: Date.now().toString() + i,
              memberCode: values[0],
              name: values[1],
              occupation: values[2],
              dateOfBirth: values[3],
              baptismStatus: values[4].toLowerCase() === 'yes',
              confirmationStatus: values[5].toLowerCase() === 'confirmed',
              maritalStatus: values[6].toLowerCase() === 'married',
              residentialStatus: values[7].toLowerCase() === 'resident',
              aadharNumber: values[8],
              mobile: values[9],
              remarks: values[10] || '',
              address: '',
              area: '',
              ward: '',
              registrationDate: new Date().toISOString().split('T')[0],
              memberStatus: 'unconfirmed'
            });
          }
        }

        if (importedMembers.length > 0 && onImportMembers) {
          onImportMembers(importedMembers);
          toast.success(`Imported ${importedMembers.length} members successfully`);
        } else {
          toast.error('No valid members found in CSV');
        }
      } catch (error) {
        toast.error('Error parsing CSV file');
        console.error(error);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 ml-1 text-slate-400 opacity-0 group-hover:opacity-50" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-4 h-4 ml-1 text-blue-600" />
      : <ArrowDown className="w-4 h-4 ml-1 text-blue-600" />;
  };

  // Get unique occupations for filter
  const uniqueOccupations = React.useMemo(() => {
    const source = allMembers || members;
    const occupations = new Set(source.map(m => m.occupation).filter(Boolean));
    return Array.from(occupations).sort();
  }, [allMembers, members]);

  // Get unique wards for filter
  const uniqueWards = React.useMemo(() => {
    const source = allMembers || members;
    const wards = new Set(source.map(m => m.ward).filter(Boolean));
    return Array.from(wards).sort();
  }, [allMembers, members]);

  // Helper to mask mobile number
  const maskMobileResult = (mobile: string): string => {
    // Toggle this to show/hide full mobile numbers
    const SHOW_FULL_MOBILE = false;

    if (!mobile) return '';
    if (SHOW_FULL_MOBILE) return mobile;

    if (mobile.length <= 4) return mobile;
    return '*'.repeat(mobile.length - 4) + mobile.slice(-4);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-blue-900">Members Directory</h3>
          <p className="text-slate-600 text-sm mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, totalRecords)} of {totalRecords} members
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Import Button - Hidden for now */}
          {/* {onImportMembers && (
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
                id="csv-import"
              />
              <label htmlFor="csv-import">
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer"
                  onClick={() => document.getElementById('csv-import')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </label>
            </div>
          )} */}

          {/* Export Buttons */}
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <FileUp className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Search Bar and Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by serial no, name, code, mobile, occupation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters || hasActiveFilters ? "border-blue-500 bg-blue-50 text-blue-700" : ""}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge className="ml-2 bg-blue-600 text-white">
              {[baptismFilter, confirmationFilter, maritalFilter, residentialFilter, occupationFilter, wardFilter].filter(f => f !== 'all').length + (birthdayFilter ? 1 : 0)}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 className="w-4 h-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, serialNo: !prev.serialNo }));
                }}
              >
                <span>Serial No</span>
                {visibleColumns.serialNo ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, memberCode: !prev.memberCode }));
                }}
              >
                <span>Member Code</span>
                {visibleColumns.memberCode ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, fullName: !prev.fullName }));
                }}
              >
                <span>Full Name</span>
                {visibleColumns.fullName ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, occupation: !prev.occupation }));
                }}
              >
                <span>Occupation</span>
                {visibleColumns.occupation ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, dob: !prev.dob }));
                }}
              >
                <span>Date of Birth</span>
                {visibleColumns.dob ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, baptism: !prev.baptism }));
                }}
              >
                <span>Baptism</span>
                {visibleColumns.baptism ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, confirmation: !prev.confirmation }));
                }}
              >
                <span>Confirmation</span>
                {visibleColumns.confirmation ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, marital: !prev.marital }));
                }}
              >
                <span>Marital Status</span>
                {visibleColumns.marital ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, residential: !prev.residential }));
                }}
              >
                <span>Residential Status</span>
                {visibleColumns.residential ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, aadhar: !prev.aadhar }));
                }}
              >
                <span>Aadhar Number</span>
                {visibleColumns.aadhar ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, ward: !prev.ward }));
                }}
              >
                <span>Ward</span>
                {visibleColumns.ward ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, mobile: !prev.mobile }));
                }}
              >
                <span>Mobile</span>
                {visibleColumns.mobile ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setVisibleColumns(prev => ({ ...prev, remarks: !prev.remarks }));
                }}
              >
                <span>Remarks</span>
                {visibleColumns.remarks ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Baptism Status</Label>
              <Select value={baptismFilter} onValueChange={setBaptismFilter}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Confirmation Status</Label>
              <Select value={confirmationFilter} onValueChange={setConfirmationFilter}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="not_confirmed">Not Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Marital Status</Label>
              <Select value={maritalFilter} onValueChange={setMaritalFilter}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="unmarried">Unmarried</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Residential Status</Label>
              <Select value={residentialFilter} onValueChange={setResidentialFilter}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="resident">Resident</SelectItem>
                  <SelectItem value="non_resident">Non-Resident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Occupation</Label>
              <Select value={occupationFilter} onValueChange={setOccupationFilter}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="no_data">NoData</SelectItem>
                  {uniqueOccupations.map(occupation => (
                    <SelectItem key={occupation} value={occupation}>{occupation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Ward</Label>
              <Select value={wardFilter} onValueChange={setWardFilter}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="no_data">NoData</SelectItem>
                  {uniqueWards.map(ward => (
                    <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Birthday Today</Label>
              <Select value={birthdayFilter ? 'yes' : 'no'} onValueChange={(value: string) => setBirthdayFilter(value === 'yes')}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                {visibleColumns.serialNo && (
                  <TableHead
                    className="w-[80px] cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('member_serial_num')}
                  >
                    <div className="flex items-center">
                      Serial No
                      {renderSortIcon('member_serial_num')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.memberCode && (
                  <TableHead
                    className="w-[100px] cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('member_code')}
                  >
                    <div className="flex items-center">
                      Member Code
                      {renderSortIcon('member_code')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.fullName && (
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Full Name
                      {renderSortIcon('name')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.occupation && (
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('occupation')}
                  >
                    <div className="flex items-center">
                      Occupation
                      {renderSortIcon('occupation')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.dob && (
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('date_of_birth')}
                  >
                    <div className="flex items-center">
                      Date of Birth
                      {renderSortIcon('date_of_birth')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.baptism && (
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('baptism_status')}
                  >
                    <div className="flex items-center justify-center">
                      Baptism
                      {renderSortIcon('baptism_status')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.confirmation && (
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('confirmation_status')}
                  >
                    <div className="flex items-center justify-center">
                      Confirmation
                      {renderSortIcon('confirmation_status')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.marital && (
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('marital_status')}
                  >
                    <div className="flex items-center justify-center">
                      Marital
                      {renderSortIcon('marital_status')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.residential && (
                  <TableHead
                    className="text-center cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('residential_status')}
                  >
                    <div className="flex items-center justify-center">
                      Residential
                      {renderSortIcon('residential_status')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.aadhar && (
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('aadhar_number')}
                  >
                    <div className="flex items-center">
                      Aadhar Number
                      {renderSortIcon('aadhar_number')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.ward && (
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('ward')}
                  >
                    <div className="flex items-center">
                      Ward
                      {renderSortIcon('ward')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.mobile && (
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('mobile')}
                  >
                    <div className="flex items-center">
                      Mobile
                      {renderSortIcon('mobile')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.remarks && <TableHead>Remarks</TableHead>}
                {onAddOffering && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => onMemberClick?.(member)}
                  >
                    {visibleColumns.serialNo && (
                      <TableCell className="font-medium text-slate-600">
                        {member.memberSerialNum ? member.memberSerialNum.toString().padStart(4, '0') : '-'}
                      </TableCell>
                    )}
                    {visibleColumns.memberCode && (
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {member.memberCode}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.fullName && <TableCell className="font-medium">{member.name}</TableCell>}
                    {visibleColumns.occupation && <TableCell>{member.occupation || <span className="text-slate-400 italic">NoData</span>}</TableCell>}
                    {visibleColumns.dob && (
                      <TableCell>{member.dateOfBirth && !isNaN(new Date(member.dateOfBirth).getTime()) ? new Date(member.dateOfBirth).toLocaleDateString('en-IN') : '-'}</TableCell>
                    )}
                    {visibleColumns.baptism && (
                      <TableCell className="text-center">
                        <Badge variant={member.baptismStatus ? "default" : "secondary"} className={member.baptismStatus ? "bg-green-100 text-green-800" : ""}>
                          {member.baptismStatus ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.confirmation && (
                      <TableCell className="text-center">
                        <Badge variant={member.confirmationStatus ? "default" : "secondary"} className={member.confirmationStatus ? "bg-blue-100 text-blue-800" : ""}>
                          {member.confirmationStatus ? 'Confirmed' : 'Not Confirmed'}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.marital && (
                      <TableCell className="text-center">
                        <Badge variant="outline" className={member.maritalStatus ? "bg-pink-50 text-pink-700 border-pink-200" : "bg-slate-50 text-slate-700 border-slate-200"}>
                          {member.maritalStatus ? 'Married' : 'Unmarried'}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.residential && (
                      <TableCell className="text-center">
                        <Badge variant="outline" className={member.residentialStatus ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                          {member.residentialStatus ? 'Resident' : 'Non-Resident'}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.aadhar && <TableCell className="font-mono text-sm">{member.aadharNumber || <span className="text-slate-400 italic">NoData</span>}</TableCell>}
                    {visibleColumns.ward && <TableCell>{member.ward || <span className="text-slate-400 italic">NoData</span>}</TableCell>}
                    {visibleColumns.mobile && <TableCell>{maskMobileResult(member.mobile) || <span className="text-slate-400 italic">NoData</span>}</TableCell>}
                    {visibleColumns.remarks && (
                      <TableCell className="max-w-[200px] truncate text-sm text-slate-600">
                        {member.remarks || <span className="text-slate-400 italic">NoData</span>}
                      </TableCell>
                    )}
                    {onAddOffering && (
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-200 text-amber-700 hover:bg-amber-50"
                          onClick={() => onAddOffering(member)}
                          title="Add Offering for this member"
                        >
                          <IndianRupee className="w-4 h-4 mr-1" />
                          Add Offering
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center py-8 text-slate-500">
                    {searchTerm ? 'No members found matching your search' : 'No members registered yet'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
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