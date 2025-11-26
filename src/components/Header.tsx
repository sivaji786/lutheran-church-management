import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, LogIn, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import logoImage from 'figma:asset/cb62bf54b7de9505972ebdfad3d2079da122b5b8.png';
import lutheranRose from 'figma:asset/5792e856707a6a5bc581ec9f97e87706b70ae1d9.png';

type Page = 'home' | 'login' | 'about' | 'ministries' | 'contact' | 'sermons' | 'iamnew' | 'aelc' | 'lchyd' | 'sundayschool' | 'womensamaj' | 'youtheran' | 'events' | 'photos' | 'videos' | 'ticketDetail';

type HeaderProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [ministriesDropdownOpen, setMinistriesDropdownOpen] = useState(false);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const ministriesDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
      if (ministriesDropdownRef.current && !ministriesDropdownRef.current.contains(event.target as Node)) {
        setMinistriesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-elegant transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
          >
            <img src={logoImage} alt="Lutheran Church Logo" className="h-14 w-auto" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded transition-colors ${currentPage === 'home'
                  ? 'text-green-600'
                  : 'text-slate-700 hover:text-green-600'
                }`}
            >
              Home
            </button>

            {/* About Us Dropdown */}
            <div className="relative" ref={aboutDropdownRef}>
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`px-4 py-2 rounded transition-colors flex items-center gap-1 ${currentPage === 'about' || currentPage === 'aelc' || currentPage === 'lchyd' || currentPage === 'events' || currentPage === 'photos' || currentPage === 'videos'
                    ? 'text-green-600'
                    : 'text-slate-700 hover:text-green-600'
                  }`}
              >
                About Us
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {aboutDropdownOpen && (
                <div
                  className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] mt-1"
                >
                  <button
                    onClick={() => {
                      onNavigate('about');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    About Us
                  </button>
                  <a
                    href="https://lutheranchurchhyd.org/wp-content/uploads/2024/12/From_Conflict_to_Communion_EN_0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Reformation Day
                  </a>
                  <button
                    onClick={() => {
                      onNavigate('aelc');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    AELC
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('lchyd');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    LC HYD
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('events');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Events
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('photos');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Photos
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('videos');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Videos
                  </button>
                </div>
              )}
            </div>

            {/* Ministries Dropdown */}
            <div className="relative" ref={ministriesDropdownRef}>
              <button
                onClick={() => setMinistriesDropdownOpen(!ministriesDropdownOpen)}
                className={`px-4 py-2 rounded transition-colors flex items-center gap-1 ${currentPage === 'ministries' || currentPage === 'sundayschool' || currentPage === 'womensamaj' || currentPage === 'youtheran'
                    ? 'text-green-600'
                    : 'text-slate-700 hover:text-green-600'
                  }`}
              >
                Ministries
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${ministriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {ministriesDropdownOpen && (
                <div
                  className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[220px] mt-1"
                >
                  <button
                    onClick={() => {
                      onNavigate('ministries');
                      setMinistriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Ministries
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('sundayschool');
                      setMinistriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Sunday Schools Ministry
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('womensamaj');
                      setMinistriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Women's Samaj
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('youtheran');
                      setMinistriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Youtheran
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('iamnew')}
              className={`px-4 py-2 rounded transition-colors ${currentPage === 'iamnew'
                  ? 'text-green-600'
                  : 'text-slate-700 hover:text-green-600'
                }`}
            >
              i Am New
            </button>

            <a
              href="https://calendar.google.com/calendar/u/0/embed?src=lutheranhyderabad@gmail.com&ctz=Asia/Calcutta"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded text-slate-700 hover:text-green-600 transition-colors"
            >
              Calendar
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className={`px-4 py-2 rounded transition-colors ${currentPage === 'contact'
                  ? 'text-green-600'
                  : 'text-slate-700 hover:text-green-600'
                }`}
            >
              Contact Us
            </button>

            <button
              onClick={() => onNavigate('sermons')}
              className={`px-4 py-2 rounded transition-colors ${currentPage === 'sermons'
                  ? 'text-green-600'
                  : 'text-slate-700 hover:text-green-600'
                }`}
            >
              Sermons
            </button>
          </nav>

          {/* Login Button - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Watch Now Button */}
            <Button
              onClick={() => window.open('https://www.youtube.com/@lutheranchurchhyderabad9241/streams', '_blank')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 shadow-lg"
            >
              <Youtube className="w-4 h-4" />
              Watch Now
            </Button>

            {/* Login Button */}
            <Button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Button>

            {/* Lutheran Rose Logo */}
            <img
              src={lutheranRose}
              alt="Lutheran Rose"
              className="h-12 w-12"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t space-y-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded ${currentPage === 'home' ? 'bg-green-50 text-green-600' : 'text-slate-700'
                }`}
            >
              Home
            </button>

            {/* About Us Section */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded ${currentPage === 'about' ? 'bg-green-50 text-green-600' : 'text-slate-700'
                  }`}
              >
                About Us
              </button>
              <div className="pl-4 space-y-1">
                <button
                  onClick={() => {
                    onNavigate('aelc');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded text-sm ${currentPage === 'aelc' ? 'bg-green-50 text-green-600' : 'text-slate-600'
                    }`}
                >
                  • AELC
                </button>
                <button
                  onClick={() => {
                    onNavigate('lchyd');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded text-sm ${currentPage === 'lchyd' ? 'bg-green-50 text-green-600' : 'text-slate-600'
                    }`}
                >
                  • LC HYD
                </button>
                <button
                  onClick={() => {
                    onNavigate('events');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded text-sm ${currentPage === 'events' ? 'bg-green-50 text-green-600' : 'text-slate-600'
                    }`}
                >
                  • Events
                </button>
                <button
                  onClick={() => {
                    onNavigate('photos');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded text-sm ${currentPage === 'photos' ? 'bg-green-50 text-green-600' : 'text-slate-600'
                    }`}
                >
                  • Photos
                </button>
                <button
                  onClick={() => {
                    onNavigate('videos');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded text-sm ${currentPage === 'videos' ? 'bg-green-50 text-green-600' : 'text-slate-600'
                    }`}
                >
                  • Videos
                </button>
              </div>
            </div>

            {/* Ministries Section */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('ministries');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded ${currentPage === 'ministries' ? 'bg-green-50 text-green-600' : 'text-slate-700'
                  }`}
              >
                Ministries
              </button>
              <div className="pl-4 space-y-1">
                <button
                  onClick={() => {
                    onNavigate('sundayschool');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded text-sm ${currentPage === 'sundayschool' ? 'bg-green-50 text-green-600' : 'text-slate-600'
                    }`}
                >
                  • Sunday Schools Ministry
                </button>
                <button
                  onClick={() => {
                    onNavigate('womensamaj');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded text-sm ${currentPage === 'womensamaj' ? 'bg-green-50 text-green-600' : 'text-slate-600'
                    }`}
                >
                  • Women's Samaj
                </button>
                <button
                  onClick={() => {
                    onNavigate('youtheran');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded text-sm ${currentPage === 'youtheran' ? 'bg-green-50 text-green-600' : 'text-slate-600'
                    }`}
                >
                  • Youtheran
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('iamnew');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded ${currentPage === 'iamnew' ? 'bg-green-50 text-green-600' : 'text-slate-700'
                }`}
            >
              i Am New
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded ${currentPage === 'contact' ? 'bg-green-50 text-green-600' : 'text-slate-700'
                }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => {
                onNavigate('sermons');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded ${currentPage === 'sermons' ? 'bg-green-50 text-green-600' : 'text-slate-700'
                }`}
            >
              Sermons
            </button>

            {/* Watch Now Button - Mobile */}
            <Button
              onClick={() => {
                window.open('https://www.youtube.com/@lutheranchurchhyderabad9241/streams', '_blank');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-red-600 hover:bg-red-700 mt-4"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Watch Now
            </Button>

            {/* Login Button - Mobile */}
            <Button
              onClick={() => {
                onNavigate('login');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}