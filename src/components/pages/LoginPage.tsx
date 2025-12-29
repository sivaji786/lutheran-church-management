import { useState } from 'react';
import { Shield, UserCircle, LogIn, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User } from '../../App';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import loginLeftPic from '../../assets/login_leftpic.jpg';

type LoginPageProps = {
  onLogin: (user: User) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [memberIdentifier, setMemberIdentifier] = useState(''); // Can be mobile or member code
  const [memberPassword, setMemberPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { apiClient } = await import('../../services/api');
      const response = await apiClient.adminLogin(adminUsername, adminPassword);

      if (response.success) {
        onLogin({ type: 'admin' });
        toast.success('Welcome Admin!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { apiClient } = await import('../../services/api');

      // Auto-detect if it's a mobile number (all digits) or member code
      const isNumeric = /^\d+$/.test(memberIdentifier);
      const loginType = isNumeric ? 'mobile' : 'memberCode';

      const response = await apiClient.memberLogin(memberIdentifier, loginType, memberPassword);

      if (response.success) {
        onLogin({ type: 'member', memberCode: response.data.memberCode });
        toast.success(`Welcome ${response.data.name}!`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') === 'admin' ? 'admin' : 'member';
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3NjBWMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="container mx-auto px-4 text-center relative z-10">

          <h1 className="text-white mb-4"> ANDHRA EVANGELICAL LUTHERAN CHURCH (AELC) HYDERABAD</h1>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed text-lg">
            Member Portal
          </p>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">

              {/* Left Side - Image & Info */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant-lg">
                    <ImageWithFallback
                      src={loginLeftPic}
                      alt="Church Interior"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info Card Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-elegant">
                    <h3 className="text-blue-900 mb-3">Welcome to Lutheran Church</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Manage your membership, view offering history, and stay connected with our church community.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Forms */}
              <div>
                <Card className="border-blue-100 shadow-elegant-lg">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h2 className="text-blue-900 mb-2">Sign In</h2>
                      <p className="text-slate-600">Choose your login type to continue</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="member" className="gap-2" data-testid="tab-trigger-member">
                          <UserCircle className="w-4 h-4" />
                          Member
                        </TabsTrigger>
                        <TabsTrigger value="admin" className="gap-2" data-testid="tab-trigger-admin">
                          <Shield className="w-4 h-4" />
                          Admin
                        </TabsTrigger>
                      </TabsList>

                      {/* Member Login */}
                      <TabsContent value="member" className="space-y-6">
                        <form onSubmit={handleMemberLogin} className="space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="member-identifier" className="text-slate-700">
                              Mobile Number or Member Code
                            </Label>
                            <div className="relative">
                              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <Input
                                id="member-identifier"
                                type="text"
                                placeholder="Enter mobile number or member code"
                                value={memberIdentifier}
                                onChange={(e) => setMemberIdentifier(e.target.value.trim())}
                                className="pl-11 h-12"
                                required
                              />
                            </div>
                            <p className="text-xs text-slate-500">
                              You can use either your mobile number or member code to sign in
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="member-password" className="text-slate-700">
                              Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <Input
                                id="member-password"
                                type="password"
                                placeholder="Enter your password"
                                value={memberPassword}
                                onChange={(e) => setMemberPassword(e.target.value)}
                                className="pl-11 h-12"
                                required
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                            disabled={isLoading}
                          >
                            <LogIn className="w-5 h-5 mr-2" />
                            {isLoading ? 'Signing in...' : 'Sign In as Member'}
                          </Button>
                        </form>
                      </TabsContent>

                      {/* Admin Login */}
                      <TabsContent value="admin" className="space-y-6">
                        <form onSubmit={handleAdminLogin} className="space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="admin-username" className="text-slate-700">
                              Username
                            </Label>
                            <div className="relative">
                              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <Input
                                id="admin-username"
                                data-testid="admin-username-input"
                                type="text"
                                placeholder="Enter admin username"
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                className="pl-11 h-12"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="admin-password" className="text-slate-700">
                              Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <Input
                                id="admin-password"
                                data-testid="admin-password-input"
                                type="password"
                                placeholder="Enter admin password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="pl-11 h-12"
                                required
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            data-testid="admin-login-button"
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                            disabled={isLoading}
                          >
                            <Shield className="w-5 h-5 mr-2" />
                            {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                      <p className="text-slate-600 mb-2">Need to find a member?</p>
                      <a
                        href="#/lookup"
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        <UserCircle className="w-4 h-4" />
                        Go to Member Lookup
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div >
      </section >
    </div >
  );
}
