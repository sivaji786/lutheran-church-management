import React, { useState } from 'react';
import { Church, Cross, Heart, Users, Calendar, Shield, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { User } from '../App';
import { toast } from 'sonner';

type LandingPageProps = {
  onLogin: (user: User) => void;
};

export function LandingPage({ onLogin }: LandingPageProps) {
  const [adminPassword, setAdminPassword] = useState('');
  const [memberMobile, setMemberMobile] = useState('');
  const [memberCode, setMemberCode] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin@123') {
      onLogin({ type: 'admin' });
      toast.success('Welcome Admin!');
    } else {
      toast.error('Invalid admin password');
    }
  };

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: John Emmanuel - 9876543210, LCH001
    if (memberMobile === '9876543210' && memberCode === 'LCH001') {
      onLogin({ type: 'member', memberCode: 'LCH001' });
      toast.success('Welcome John Emmanuel!');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const loadAdminDemo = () => {
    setAdminPassword('admin@123');
    toast.info('Demo admin credentials loaded');
  };

  const loadMemberDemo = () => {
    setMemberMobile('9876543210');
    setMemberCode('LCH001');
    toast.info('Demo member credentials loaded');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Church className="w-12 h-12" />
            <div className="text-center">
              <h1 className="tracking-wide">Lutheran Church</h1>
              <p className="text-blue-200">Hyderabad - Lakdikapool</p>
            </div>
          </div>
          <p className="text-center text-blue-100 max-w-2xl mx-auto">
            "For where two or three gather in my name, there am I with them." - Matthew 18:20
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-blue-900 mb-4">Welcome to Our Community</h2>
              <p className="text-slate-600 mb-6">
                Join us in worship, fellowship, and service. The Lutheran Church Hyderabad has been
                serving the community at Lakdikapool with love, faith, and dedication.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-slate-700">Sunday Service</p>
                    <p className="text-slate-500">9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-slate-700">Bible Study</p>
                    <p className="text-slate-500">Wednesday 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1550541231-56ddb7f844ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBzdGFpbmVkJTIwZ2xhc3N8ZW58MXx8fHwxNzYyODM3MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Church Stained Glass"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-blue-900 mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-blue-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Cross className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-blue-900 mb-2">Faith</h3>
                  <p className="text-slate-600">
                    Grounded in Scripture and the Lutheran tradition, we grow together in faith.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-blue-900 mb-2">Love</h3>
                  <p className="text-slate-600">
                    We love and serve our community, reflecting God's love in all we do.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-blue-900 mb-2">Fellowship</h3>
                  <p className="text-slate-600">
                    Together we worship, learn, and support one another in Christ.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-blue-900 mb-2">Member Portal</h2>
            <p className="text-slate-600">Access your account to manage offerings and view details</p>
          </div>

          <Card className="shadow-xl border-blue-100">
            <CardHeader>
              <CardTitle className="text-center text-blue-900">Sign In</CardTitle>
              <CardDescription className="text-center">
                Choose your login type to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="admin" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </TabsTrigger>
                  <TabsTrigger value="member" className="gap-2">
                    <UserCircle className="w-4 h-4" />
                    Member
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="admin">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Admin Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Login as Admin
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={loadAdminDemo}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        Load Demo
                      </Button>
                    </div>
                    <p className="text-slate-500 text-center">
                      Demo: Password is <code className="bg-slate-100 px-2 py-1 rounded">admin@123</code>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="member">
                  <form onSubmit={handleMemberLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-mobile">Mobile Number</Label>
                      <Input
                        id="member-mobile"
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={memberMobile}
                        onChange={(e) => setMemberMobile(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-code">Member Code</Label>
                      <Input
                        id="member-code"
                        type="text"
                        placeholder="Enter your member code"
                        value={memberCode}
                        onChange={(e) => setMemberCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Login as Member
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={loadMemberDemo}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        Load Demo
                      </Button>
                    </div>
                    <p className="text-slate-500 text-center">
                      Demo: Mobile <code className="bg-slate-100 px-2 py-1 rounded">9876543210</code>
                      {' '} Code <code className="bg-slate-100 px-2 py-1 rounded">LCH001</code>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Church className="w-6 h-6" />
            <p>Lutheran Church Hyderabad</p>
          </div>
          <p className="text-blue-200 mb-2">Lakdikapool, Hyderabad</p>
          <p className="text-blue-300">Contact: info@lutheranchurchhyd.org</p>
        </div>
      </footer>
    </div>
  );
}