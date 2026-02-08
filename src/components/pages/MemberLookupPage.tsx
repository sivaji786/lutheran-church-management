import { useState } from 'react';
import { apiClient } from '../../services/api';
import { Member, Offering } from '../../App';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Loader2, User, Users, Receipt, X } from 'lucide-react';
import { toast } from 'sonner';
import churchLogo from '../../assets/church_logo_new.png';

export function MemberLookupPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [member, setMember] = useState<Member | null>(null);
    const [familyMembers, setFamilyMembers] = useState<Member[]>([]);
    const [offerings, setOfferings] = useState<Offering[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Utility function to mask mobile number - show only last 4 digits
    const maskMobileNumber = (mobile: string | undefined) => {
        if (!mobile) return 'N/A';
        if (mobile.length < 4) return mobile;
        const lastFour = mobile.slice(-4);
        const masked = 'X'.repeat(mobile.length - 4);
        return masked + lastFour;
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            toast.error('Please enter a member code');
            return;
        }

        setLoading(true);
        setMember(null);
        setFamilyMembers([]);
        setOfferings([]);
        setHasSearched(true);

        try {
            // Use the new lookup API that searches only by member_code
            const detailRes = await apiClient.lookupMemberByCode(searchTerm.trim());

            if (detailRes.success && detailRes.data) {
                const memberData = detailRes.data;
                setMember(memberData);

                // Set family members
                if (memberData.familyMembers) {
                    setFamilyMembers(memberData.familyMembers);
                }

                // Determine if head of family
                const isHeadOfFamily = memberData.isHeadOfFamily === "1" ||
                    memberData.isHeadOfFamily === true ||
                    (memberData as any).is_head_of_family === true ||
                    (memberData as any).is_head_of_family === 1 ||
                    (memberData as any).is_head_of_family === "1";

                // Fetch offerings (include family ONLY if head of family)
                const offeringsRes = await apiClient.getMemberOfferings(memberData.id, { includeFamily: isHeadOfFamily });
                if (offeringsRes.success && offeringsRes.data.offerings) {
                    setOfferings(offeringsRes.data.offerings);
                }
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('No member found with that member code');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setMember(null);
        setFamilyMembers([]);
        setOfferings([]);
        setHasSearched(false);
        setLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-200">
                <div className="px-4 lg:px-6 h-20 flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <img src={churchLogo} alt="Lutheran Church Logo" className="h-12 w-auto" />
                        <div>
                            <h2 className="text-blue-900 text-lg font-semibold leading-tight">Andhra Evangelical Lutheran Church Hyderabad</h2>
                            <p className="text-slate-600 text-xs font-medium uppercase tracking-wider">Member Verification Portal</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header & Search */}
                    {!member && !hasSearched ? (
                        // Initial state - centered and prominent
                        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-blue-900">Member Lookup</h1>
                                <p className="text-slate-600 text-lg">Enter member code to search</p>
                            </div>
                            <div className="flex max-w-2xl w-full gap-3 px-4">
                                <Input
                                    placeholder="Enter Member Code"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="bg-white h-14 text-lg px-6 border-2 border-slate-300 focus:border-blue-500"
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 h-14 w-24 border-1 border-blue-600 px-8 text-lg"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Go'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Search with results or after search
                        <div className="text-center space-y-6">
                            <h1 className="text-3xl font-bold text-blue-900">Member Lookup</h1>
                            <div className="flex max-w-xl mx-auto gap-2">
                                <Input
                                    placeholder="Enter Mobile Number or Member Code"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="bg-white h-12 text-base border-2 border-slate-300 focus:border-blue-500"
                                />
                                <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700 h-12">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
                                </Button>
                                {(hasSearched || searchTerm) && (
                                    <Button onClick={handleClear} variant="outline" className="border-slate-300 text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-12" title="Clear Search">
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {member ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* 1. Member Profile Details */}
                            <Card className="shadow-md border-blue-100 overflow-hidden">
                                <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                                    <CardTitle className="flex items-center text-blue-800">
                                        <User className="w-5 h-5 mr-2" />
                                        Member Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Full Name</p>
                                            <p className="text-lg font-semibold text-slate-900">{member.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Member Code</p>
                                            <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                                                {member.memberCode}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Mobile</p>
                                            <p className="text-base text-slate-900 font-mono">{maskMobileNumber(member.mobile)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Status</p>
                                            <Badge
                                                className={`mt-1 ${member.memberStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                                            >
                                                {member.memberStatus?.toUpperCase() || 'UNKNOWN'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Serial Number</p>
                                            <p className="text-base text-slate-900">{member.memberSerialNum || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Occupation</p>
                                            <p className="text-base text-slate-900">{member.occupation || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Date of Birth</p>
                                            <p className="text-base text-slate-900">{member.dateOfBirth || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Area</p>
                                            <p className="text-base text-slate-900">{member.area || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Aadhar Number</p>
                                            <p className="text-base text-slate-900 font-mono">{member.aadharNumber || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Ward</p>
                                            <p className="text-base text-slate-900">{member.ward || 'N/A'}</p>
                                        </div>
                                        <div className="md:col-span-2 lg:col-span-3">
                                            <p className="text-sm font-medium text-slate-500">Address</p>
                                            <p className="text-base text-slate-900">{member.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 2. Family Details */}
                            <Card className="shadow-md border-purple-100 overflow-hidden">
                                <CardHeader className="bg-purple-50/50 border-b border-purple-100">
                                    <CardTitle className="flex items-center text-purple-800">
                                        <Users className="w-5 h-5 mr-2" />
                                        Family Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50">
                                                <TableHead>Member Code</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Relationship</TableHead>
                                                <TableHead>Mobile</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {familyMembers.length > 0 ? (
                                                familyMembers.map((fm) => (
                                                    <TableRow key={fm.id}>
                                                        <TableCell className="font-medium text-slate-700">{fm.memberCode}</TableCell>
                                                        <TableCell>{fm.name}</TableCell>
                                                        <TableCell>
                                                            {/* Logic to guess relationship or just show order if available */}
                                                            {fm.id === member.id ? (
                                                                <Badge variant="outline" className="border-blue-200 text-blue-600">Self</Badge>
                                                            ) : (
                                                                <span className="text-slate-500 text-sm">Family Member</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{maskMobileNumber(fm.mobile)}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                                                        No family members found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* 3. Offering Details */}
                            <Card className="shadow-md border-green-100 overflow-hidden">
                                <CardHeader className="bg-green-50/50 border-b border-green-100">
                                    <CardTitle className="flex items-center text-green-800">
                                        <Receipt className="w-5 h-5 mr-2" />
                                        Recent Offerings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-[400px] overflow-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50/50">
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Given By</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Payment Mode</TableHead>
                                                    <TableHead>Notes</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {offerings.length > 0 ? (
                                                    offerings.map((offering) => (
                                                        <TableRow key={offering.id}>
                                                            <TableCell className="font-medium text-slate-700">
                                                                {new Date(offering.date).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="font-medium">{offering.memberName}</span>
                                                                <br />
                                                                <span className="text-xs text-slate-500">{offering.memberCode}</span>
                                                            </TableCell>
                                                            <TableCell>{offering.offerType}</TableCell>
                                                            <TableCell>{offering.paymentMode}</TableCell>
                                                            <TableCell className="text-slate-600 text-sm">{offering.notes || '-'}</TableCell>
                                                            <TableCell className="text-right font-bold text-green-700">
                                                                ₹{Number(offering.amount).toLocaleString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                                                            No offerings recorded
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    ) : (
                        hasSearched && !loading && (
                            <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-dashed border-slate-300">
                                <p>No member found. Please check the details and try again.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
