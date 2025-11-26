import React from 'react';
import { MapPin, Mail, Phone, MessageCircle, Facebook, Twitter, Youtube, ChevronRight } from 'lucide-react';

type Page = 'home' | 'login' | 'about' | 'ministries' | 'contact' | 'sermons' | 'iamnew' | 'aelc' | 'lchyd' | 'sundayschool' | 'womensamaj' | 'youtheran' | 'events' | 'photos' | 'videos' | 'ticketDetail';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-white mb-6">Lutheran Church Hyderabad</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              A place where the Word of God is taught as truth, and members strive to be dedicated followers of Christ.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/lutheranchurchlakdikapoolhyd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://twitter.com/lutheranch_hyd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-sky-500 transition-all duration-300 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="http://www.youtube.com/@lutheranchurchhyderabad9241"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300 group"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ministries')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Ministries</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('iamnew')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>I Am New</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sermons')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Sermons</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Ministries Links */}
          <div>
            <h3 className="text-white mb-6">Ministries</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('sundayschool')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Sunday Schools</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('womensamaj')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Women's Samaj</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('youtheran')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Youtheran</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Events</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('photos')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Photos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('videos')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Videos</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div className="text-slate-300 text-sm leading-relaxed">
                  Lutheran Church<br />
                  Saifabad, Lakdikapool,<br />
                  Hyderabad – 500004<br />
                  Telangana, India
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <a
                  href="mailto:lutheranchurchhyda1@gmail.com"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  lutheranchurchhyda1@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <a
                  href="https://wa.me/919160687066"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  +91 9160687066
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service Times Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-blue-200 text-sm mb-1">Hindi Service</p>
              <p className="text-white">06:30 AM</p>
            </div>
            <div className="hidden sm:block w-px bg-white/20"></div>
            <div>
              <p className="text-blue-200 text-sm mb-1">English Service</p>
              <p className="text-white">08:00 AM</p>
            </div>
            <div className="hidden sm:block w-px bg-white/20"></div>
            <div>
              <p className="text-blue-200 text-sm mb-1">Telugu Service</p>
              <p className="text-white">10:00 AM</p>
            </div>
            <div className="hidden sm:block w-px bg-white/20"></div>
            <div>
              <p className="text-blue-200 text-sm mb-1">Evening Telugu</p>
              <p className="text-white">06:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-950 border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} Lutheran Church Hyderabad. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
