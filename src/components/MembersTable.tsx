import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import { Search, ChevronLeft, ChevronRight, FileDown, FileUp, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Settings2, Eye, EyeOff, IndianRupee } from 'lucide-react';
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
  search?: string;
  baptismStatus?: string;
  confirmationStatus?: string;
  maritalStatus?: string;
  residentialStatus?: string;
  occupation?: string;
  ward?: string;
  birthday?: string;
  age?: string;
  ageRelational?: string;
  ageValue?: number;
  memberStatus?: string;
  sortBy?: string;
  sortOrder?: string;
};

type MembersTableProps = {
  members: Member[];
  totalRecords: number;
  onMemberClick?: (member: Member) => void;
  onAddOffering?: (member: Member) => void;
  initialBirthdayFilter?: boolean;
  onFilterChange: (filters: MemberFilters) => void;
  isSuperAdmin?: boolean;
};

export function MembersTable({ members, totalRecords, onMemberClick, onAddOffering, initialBirthdayFilter, onFilterChange, isSuperAdmin = false }: MembersTableProps) {
  // Initialize state from localStorage or defaults
  const getInitialState = (key: string, defaultValue: any) => {
    const saved = storage.get('members_state') as any;
    return saved && saved[key] !== undefined ? saved[key] : defaultValue;
  };

  const [searchTerm, setSearchTerm] = useState(() => getInitialState('searchTerm', ''));
  const [currentPage, setCurrentPage] = useState(() => getInitialState('currentPage', 1));
  const [baptismFilter, setBaptismFilter] = useState<string>(() => getInitialState('baptismFilter', 'all'));
  const [confirmationFilter, setConfirmationFilter] = useState<string>(() => getInitialState('confirmationFilter', 'all'));
  const [maritalFilter, setMaritalFilter] = useState<string>(() => getInitialState('maritalFilter', 'all'));
  const [residentialFilter, setResidentialFilter] = useState<string>(() => getInitialState('residentialFilter', 'all'));
  const [occupationFilter, setOccupationFilter] = useState<string>(() => getInitialState('occupationFilter', 'all'));
  const [wardFilter, setWardFilter] = useState<string>(() => getInitialState('wardFilter', 'all'));
  const [birthdayFilter, setBirthdayFilter] = useState<string>(() => getInitialState('birthdayFilter', initialBirthdayFilter ? 'yes' : 'all'));
  const [ageFilter, setAgeFilter] = useState<string>(() => getInitialState('ageFilter', 'all'));
  const [ageRelationalFilter, setAgeRelationalFilter] = useState<string>(() => getInitialState('ageRelationalFilter', 'none'));
  const [ageValueFilter, setAgeValueFilter] = useState<number | ''>(() => getInitialState('ageValueFilter', ''));
  const [showFilters, setShowFilters] = useState(() => getInitialState('showFilters', initialBirthdayFilter || false));
  const [sortColumn, setSortColumn] = useState<string>(() => getInitialState('sortColumn', 'created_at'));
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(() => getInitialState('sortDirection', 'desc'));
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => getInitialState('visibleColumns', {
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
    age: true,
    remarks: true,
  }));
  const [pageSize, setPageSize] = useState(() => getInitialState('pageSize', 10));

  // Persist state to localStorage and notify parent whenever it changes
  useEffect(() => {
    storage.set('members_state', {
      searchTerm,
      currentPage,
      pageSize,
      baptismFilter,
      confirmationFilter,
      maritalFilter,
      residentialFilter,
      occupationFilter,
      wardFilter,
      birthdayFilter,
      ageFilter,
      ageRelationalFilter,
      ageValueFilter,
      showFilters,
      sortColumn,
      sortDirection,
      visibleColumns,
    });

    onFilterChange({
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      baptismStatus: baptismFilter,
      confirmationStatus: (confirmationFilter === 'confirmed' || confirmationFilter === 'not_confirmed') ? confirmationFilter : 'all',
      maritalStatus: maritalFilter,
      residentialStatus: residentialFilter,
      occupation: occupationFilter,
      ward: wardFilter,
      birthday: birthdayFilter,
      age: ageFilter,
      ageRelational: ageRelationalFilter,
      ageValue: ageValueFilter !== '' ? ageValueFilter : undefined,
      memberStatus: confirmationFilter === 'suspended' ? 'suspended' : 'all',
      sortBy: sortColumn,
      sortOrder: sortDirection,
    });
  }, [searchTerm, currentPage, pageSize, baptismFilter, confirmationFilter, maritalFilter, residentialFilter, occupationFilter, wardFilter, birthdayFilter, ageFilter, ageRelationalFilter, ageValueFilter, showFilters, sortColumn, sortDirection]);



  // Check if any filters are active
  const hasActiveFilters = baptismFilter !== 'all' || confirmationFilter !== 'all' ||
    maritalFilter !== 'all' || residentialFilter !== 'all' || occupationFilter !== 'all' || wardFilter !== 'all' ||
    (birthdayFilter !== 'all' && birthdayFilter !== 'no') || ageFilter !== 'all' || (ageRelationalFilter !== 'none' && ageValueFilter !== '') ||
    searchTerm !== '';

  // Clear all filters
  const clearFilters = () => {
    setBaptismFilter('all');
    setConfirmationFilter('all');
    setMaritalFilter('all');
    setResidentialFilter('all');
    setOccupationFilter('all');
    setWardFilter('all');
    setBirthdayFilter('all');
    setAgeFilter('all');
    setAgeRelationalFilter('none');
    setAgeValueFilter('');
    setSearchTerm('');
    setSearchTerm('');
    setCurrentPage(1);
    setSortColumn('created_at');
    setSortDirection('desc');
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + members.length;

  // Reset to page 1 when search or page size changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);



  // Export to CSV
  const handleExportCSV = async () => {
    try {
      toast.info('Preparing export...', { duration: 2000 });

      // Construct current filters
      const exportFilters: any = {
        limit: 10000, // Fetch up to 10k for export
        search: searchTerm,
        baptismStatus: baptismFilter === 'all' ? undefined : baptismFilter,
        confirmationStatus: confirmationFilter === 'all' ? undefined : confirmationFilter,
        maritalStatus: maritalFilter === 'all' ? undefined : maritalFilter,
        residentialStatus: residentialFilter === 'all' ? undefined : residentialFilter,
        occupation: occupationFilter === 'all' ? undefined : occupationFilter,
        ward: wardFilter === 'all' ? undefined : wardFilter,
        birthday: (birthdayFilter === 'yes') ? true : undefined,
        age: ageFilter === 'all' ? undefined : ageFilter,
        ageRelational: ageRelationalFilter === 'none' ? undefined : ageRelationalFilter,
        ageValue: ageValueFilter === '' ? undefined : ageValueFilter,
      };

      // Fetch all members for export with current filters
      // Note: We need access to apiClient here. Assuming it interprets this file as a component where apiClient is available or imported.
      // If apiClient is not imported, we need to import it. It seems specific API calls are passed as props, but for export we might need direct access or a new prop.
      // However, previous attempts used apiClient. Since it's not in props, let's assume we need to import it.
      // Checking imports.. 'apiClient' is not imported in this file currently. 
      // We should probably add `onExport` prop instead of direct API call if we want to keep it pure, 
      // OR import apiClient. Given the previous plan was to use apiClient, I will import it.

      const { apiClient } = await import('../services/api'); // Dynamic import to avoid circular dep if any, or just import at top. 
      // Actually standard import is better. I will add import at top later if needed. Use dynamic for now to be safe in this block.

      const response = await apiClient.getMembers(exportFilters);
      const membersToExport = response.success && response.data.members ? response.data.members : [];

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
        'Age',
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

      const csvData = membersToExport.map((member: Member) => [
        member.memberSerialNum ? member.memberSerialNum.toString().padStart(4, '0') : '',
        member.memberCode,
        member.name,
        member.occupation,
        member.dateOfBirth,
        member.age,
        member.baptismStatus ? 'Yes' : 'No',
        member.confirmationStatus ? 'Confirmed' : 'Not Confirmed',
        member.maritalStatus === 'married' ? 'Married' : member.maritalStatus === 'widow' ? 'Widow' : 'Unmarried',
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
        ...csvData.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(','))
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
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    }
  };

  // Export to Excel (.xlsx)
  const handleExportExcel = async () => {
    try {
      toast.info('Preparing export...', { duration: 2000 });

      const { apiClient } = await import('../services/api');

      // Construct current filters for export
      const exportFilters: any = {
        limit: 10000,
        search: searchTerm,
        baptismStatus: baptismFilter === 'all' ? undefined : baptismFilter,
        confirmationStatus: confirmationFilter === 'all' ? undefined : confirmationFilter,
        maritalStatus: maritalFilter === 'all' ? undefined : maritalFilter,
        residentialStatus: residentialFilter === 'all' ? undefined : residentialFilter,
        occupation: occupationFilter === 'all' ? undefined : occupationFilter,
        ward: wardFilter === 'all' ? undefined : wardFilter,
        birthday: (birthdayFilter === 'yes') ? true : undefined,
        age: ageFilter === 'all' ? undefined : ageFilter,
        ageRelational: ageRelationalFilter === 'none' ? undefined : ageRelationalFilter,
        ageValue: ageValueFilter === '' ? undefined : ageValueFilter,
      };

      const response = await apiClient.getMembers(exportFilters);
      const membersToExport = response.success && response.data.members ? response.data.members : [];

      if (membersToExport.length === 0) {
        toast.error('No members to export');
        return;
      }

      // Dynamic import of xlsx library
      const XLSX = await import('xlsx');

      // Prepare data for Excel
      const excelData = membersToExport.map((member: any) => ({
        'Serial No': member.memberSerialNum ? member.memberSerialNum.toString().padStart(4, '0') : '',
        'Member Code': member.memberCode,
        'Full Name': member.name,
        'Occupation': member.occupation,
        'Date of Birth': member.dateOfBirth,
        'Age': member.age,
        'Baptism Status': member.baptismStatus ? 'Yes' : 'No',
        'Confirmation Status': member.confirmationStatus ? 'Confirmed' : 'Not Confirmed',
        'Marital Status': member.maritalStatus === 'married' ? 'Married' : member.maritalStatus === 'widow' ? 'Widow' : 'Unmarried',
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
        { wch: 8 },  // Age
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
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export Excel file');
    }
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
    const source = members;
    const occupations = new Set(source.map(m => m.occupation).filter(Boolean));
    return Array.from(occupations).sort();
  }, [members]);

  // Get unique wards for filter
  const uniqueWards = React.useMemo(() => {
    const source = members;
    const wards = new Set(source.map(m => m.ward).filter(Boolean));
    return Array.from(wards).sort();
  }, [members]);

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
          {isSuperAdmin && (
            <>
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
            </>
          )}
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
              {[baptismFilter, confirmationFilter, maritalFilter, residentialFilter, occupationFilter, wardFilter, ageFilter].filter(f => f !== 'all').length +
                (birthdayFilter === 'yes' ? 1 : 0) +
                (ageRelationalFilter !== 'none' && ageValueFilter !== '' ? 1 : 0)}
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
                  setVisibleColumns(prev => ({ ...prev, age: !prev.age }));
                }}
              >
                <span>Age</span>
                {visibleColumns.age ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
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
                  <SelectItem value="suspended">Suspended</SelectItem>
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
                  <SelectItem value="widow">Widow</SelectItem>
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
              <Select value={birthdayFilter} onValueChange={setBirthdayFilter}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Filters */}
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Exact Age</Label>
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger className="w-24 bg-white">
                  <SelectValue placeholder="Age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(age => (
                    <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Age Filter</Label>
              <div className="flex gap-2">
                <Select value={ageRelationalFilter} onValueChange={setAgeRelationalFilter}>
                  <SelectTrigger className="w-20 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="<">{"<"}</SelectItem>
                    <SelectItem value=">">{">"}</SelectItem>
                    <SelectItem value="<=">{"<="}</SelectItem>
                    <SelectItem value=">=">{">="}</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Age"
                  value={ageValueFilter}
                  onChange={(e) => setAgeValueFilter(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-20 bg-white"
                />
              </div>
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
                {visibleColumns.age && (
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100 group transition-colors"
                    onClick={() => handleSort('age')}
                  >
                    <div className="flex items-center">
                      Age
                      {renderSortIcon('age')}
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
                    {visibleColumns.age && (
                      <TableCell className="font-medium text-blue-900">{member.age !== undefined && member.age !== null ? member.age : '-'}</TableCell>
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
                        {member.memberStatus === 'suspended' ? (
                          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                            Suspended
                          </Badge>
                        ) : (
                          <Badge variant={member.confirmationStatus ? "default" : "secondary"} className={member.confirmationStatus ? "bg-blue-100 text-blue-800" : ""}>
                            {member.confirmationStatus ? 'Confirmed' : 'Not Confirmed'}
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.marital && (
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          member.maritalStatus === 'married'
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : member.maritalStatus === 'widow'
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                        }>
                          {member.maritalStatus === 'married' ? 'Married' : member.maritalStatus === 'widow' ? 'Widow' : 'Unmarried'}
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
                    {onAddOffering && member.memberStatus !== 'suspended' && (
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
                    {onAddOffering && member.memberStatus === 'suspended' && (
                      <TableCell className="text-center">
                        <span className="text-xs text-slate-400 italic">No Actions</span>
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
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {totalPages > 1 && (
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 mr-2">Rows per page:</span>
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

              <div className="h-4 w-px bg-slate-300 mx-2" />

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
                onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
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
                onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
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
      </div>
    </div>
  );
}