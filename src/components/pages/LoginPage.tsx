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
  const [memberCode, setMemberCode] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2FA State
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUserId, setPendingUserId] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { apiClient } = await import('../../services/api');
      const response = await apiClient.adminLogin(adminUsername, adminPassword);

      console.log('Admin login response:', response);

      if (response.success) {
        if (response.data.requires2FA) {
          console.log('Transitioning to 2FA screen');
          setRequires2FA(true);
          setPendingUserId(response.data.userId);
          toast.info(response.data.message || 'Verification code sent to your email.');
        } else if (response.data.token) {
          onLogin({
            type: 'admin',
            token: response.data.token,
            isSuperadmin: response.data.isSuperadmin
          });
          toast.success('Welcome Admin!');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { apiClient } = await import('../../services/api');
      const response = await apiClient.verifyAdmin2FA(pendingUserId, twoFactorCode);

      if (response.success && response.data.token) {
        onLogin({
          type: 'admin',
          token: response.data.token,
          isSuperadmin: response.data.isSuperadmin
        });
        toast.success('Verify successful! Welcome Admin!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { apiClient } = await import('../../services/api');

      // Always use memberCode as the identifier type
      const response = await apiClient.memberLogin(memberCode, 'memberCode', memberPassword);

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
                            <Label htmlFor="member-code" className="text-slate-700">
                              Member Code
                            </Label>
                            <div className="relative">
                              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <Input
                                id="member-code"
                                type="text"
                                placeholder="Enter your member code"
                                value={memberCode}
                                onChange={(e) => setMemberCode(e.target.value.trim().toUpperCase())}
                                className="pl-11 h-12"
                                required
                              />
                            </div>
                            <p className="text-xs text-slate-500">
                              Use your assigned member code to sign in
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
                        {!requires2FA ? (
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
                        ) : (
                          <form onSubmit={handleVerify2FA} className="space-y-5">
                            <div className="text-center mb-4">
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2">
                                <Shield className="w-6 h-6" />
                              </div>
                              <h3 className="text-lg font-semibold text-blue-900">Two-Step Verification</h3>
                              <p className="text-sm text-slate-600">Enter the 6-digit code sent to your email</p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="2fa-code" className="text-slate-700">
                                Verification Code
                              </Label>
                              <Input
                                id="2fa-code"
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                className="h-12 text-center text-2xl tracking-[0.5em] font-bold"
                                required
                                autoFocus
                              />
                            </div>

                            <Button
                              type="submit"
                              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                              disabled={isLoading || twoFactorCode.length !== 6}
                            >
                              {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                            </Button>

                            <button
                              type="button"
                              onClick={() => setRequires2FA(false)}
                              className="w-full text-sm text-slate-500 hover:text-blue-600 transition-colors"
                            >
                              Back to Login
                            </button>
                          </form>
                        )}
                      </TabsContent>
                    </Tabs>


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
