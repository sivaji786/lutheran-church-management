import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Twitter, Youtube } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3NjBWMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-elegant flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-blue-200 mb-3 tracking-wide uppercase text-sm">Get In Touch</p>
          <h1 className="mb-4 text-white">Contact Us</h1>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed text-lg">
            We'd love to hear from you. Reach out to us for any queries or assistance.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Map */}
            <Card className="border-green-100 shadow-elegant-lg overflow-hidden mb-12">
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://maps.google.com/maps?q=Lutheran+Church+Saifabad+Lakdikapool+Hyderabad+500004&t=m&z=15&output=embed&iwloc=near"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lutheran Church Location"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="border-blue-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-blue-900 mb-3">Address</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Lutheran Church<br />
                        Saifabad, Lakdikapool,<br />
                        Hyderabad – 500004<br />
                        Telangana, India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-blue-900 mb-3">Email</h3>
                      <a 
                        href="mailto:lutheranchurchhyda1@gmail.com"
                        className="text-slate-600 hover:text-green-600 transition-colors block mb-2"
                      >
                        lutheranchurchhyda1@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-blue-900 mb-3">WhatsApp</h3>
                      <a 
                        href="https://wa.me/919160687066"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-green-600 transition-colors block mb-2"
                      >
                        +91 9160687066
                      </a>
                      <p className="text-slate-500 text-sm">
                        Click to chat with us
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Times Card */}
            <Card className="border-pink-100 shadow-elegant mb-12">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-900 mb-4">Sunday Worship Services</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-slate-600">Hindi Service</p>
                        <p className="text-blue-900">06:30 AM</p>
                      </div>
                      <div>
                        <p className="text-slate-600">English Service</p>
                        <p className="text-blue-900">08:00 AM</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Telugu Service</p>
                        <p className="text-blue-900">10:00 AM</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Evening Telugu</p>
                        <p className="text-blue-900">06:30 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="border-purple-100 shadow-elegant-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-blue-900 mb-2">Connect With Us</h2>
                  <p className="text-slate-600">Follow us on social media for updates and inspiration</p>
                </div>
                <div className="flex justify-center items-center gap-6 flex-wrap">
                  <a
                    href="https://www.facebook.com/lutheranchurchlakdikapoolhyd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-elegant group-hover:shadow-elegant-lg group-hover:scale-110 transition-all duration-300">
                      <Facebook className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-slate-600 group-hover:text-blue-600 transition-colors text-sm">Facebook</span>
                  </a>
                  
                  <a
                    href="https://twitter.com/lutheranch_hyd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-elegant group-hover:shadow-elegant-lg group-hover:scale-110 transition-all duration-300">
                      <Twitter className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-slate-600 group-hover:text-sky-600 transition-colors text-sm">Twitter</span>
                  </a>
                  
                  <a
                    href="http://www.youtube.com/@lutheranchurchhyderabad9241"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-elegant group-hover:shadow-elegant-lg group-hover:scale-110 transition-all duration-300">
                      <Youtube className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-slate-600 group-hover:text-red-600 transition-colors text-sm">YouTube</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}