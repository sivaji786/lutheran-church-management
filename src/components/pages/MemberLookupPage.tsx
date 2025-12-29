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

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            toast.error('Please enter a mobile number or member code');
            return;
        }

        setLoading(true);
        setMember(null);
        setFamilyMembers([]);
        setOfferings([]);
        setHasSearched(true);

        try {
            // First search for the member
            const memberRes = await apiClient.getMembers({
                search: searchTerm,
                limit: 1
            });

            if (memberRes.success && memberRes.data.members && memberRes.data.members.length > 0) {
                // We found a match (or partial match, use the first one)
                // Ideally the API should support exact match or we filter client side if needed
                const foundListMember = memberRes.data.members[0];

                // Now fetch full details for this member
                if (foundListMember.id) {
                    const detailRes = await apiClient.getMember(foundListMember.id);

                    if (detailRes.success && detailRes.data) {
                        const memberData = detailRes.data;
                        setMember(memberData);

                        // Set family members
                        if (memberData.familyMembers) {
                            setFamilyMembers(memberData.familyMembers);
                        }

                        // Fetch offerings
                        const offeringsRes = await apiClient.getMemberOfferings(memberData.id);
                        if (offeringsRes.success && offeringsRes.data.offerings) {
                            setOfferings(offeringsRes.data.offerings);
                        }
                    }
                }
            } else {
                toast.error('No member found with that details');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('An error occurred while searching');
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
                    <div className="text-center space-y-6">
                        <h1 className="text-3xl font-bold text-blue-900">Member Lookup</h1>
                        <div className="flex max-w-md mx-auto gap-2">
                            <Input
                                placeholder="Enter Mobile Number or Member Code"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="bg-white"
                            />
                            <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
                            </Button>
                            {(hasSearched || searchTerm) && (
                                <Button onClick={handleClear} variant="outline" className="border-slate-300 text-slate-500 hover:text-slate-700 hover:bg-slate-100" title="Clear Search">
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

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
                                            <p className="text-base text-slate-900">{member.mobile || 'N/A'}</p>
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
                                                        <TableCell>{fm.mobile || '-'}</TableCell>
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
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Payment Mode</TableHead>
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
                                                            <TableCell>{offering.offerType}</TableCell>
                                                            <TableCell>{offering.paymentMode}</TableCell>
                                                            <TableCell className="text-right font-bold text-green-700">
                                                                ₹{Number(offering.amount).toLocaleString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-6 text-slate-500">
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
