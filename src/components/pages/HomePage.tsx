import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

type HomePageProps = {
  onNavigate: (page: any) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1567707873679-18844b507a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBpbnRlcmlvciUyMHdvcnNoaXB8ZW58MXx8fHwxNzYyNzYwMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1608569569089-5d2e3e644ea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjcxOTczOXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1695938746747-ec185ea81325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBjb21tdW5pdHklMjB3b3JzaGlwfGVufDF8fHx8MTc2MjgwNzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1648003613198-929682b62eec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBhbHRhciUyMGNyb3NzfGVufDF8fHx8MTc2Mjg0MTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1550541231-56ddb7f844ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBzdGFpbmVkJTIwZ2xhc3N8ZW58MXx8fHwxNzYyODM3MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  const galleryImages = [
    "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/HDP_4065-qzjmk79eis962tdkks6ilsh8emhrxuld54jcjlat9c.webp",
    "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/003A3431-scaled-r4i4lkpvz7ogkixmsmvgblzbnm0uxtxjqteo2v2izk.jpg",
    "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/DCM00710-scaled-rc5y3mv89aagz5cjfks6raz7sl14edj3jqqq0qieg0.jpg",
    "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/DCM00669-scaled-rc5y3bl5z9v13tsx9fwnxdtonykpu0abi6ww9ez4io.jpg",
    "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/CHR00171-qzjmk79eis962tdkks6ilsh8emhrxuld54jcjlat9c.webp",
    "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/DCM00771-scaled-rc5y2yffbld0lac1ea7vyh58ckdku8u2sds3jjimxs.jpg",
    "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/003A3481-scaled-r4i4lv242e2m48im49ccl1de6ulwai2lg8l0cwn734.jpg",
    "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/DCM00726-scaled-rc5y2n5d1kxkpysf85cd4jzp7xx69vlaqty9s7zd0g.jpg"
  ];

  // Auto-play slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="bg-white">
      {/* Hero Slideshow Section */}
      <section className="relative h-[400px] md:h-[480px] lg:h-[520px] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
          </div>
        ))}
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-white mb-4 drop-shadow-2xl">
              Welcome to Lutheran Church Hyderabad
            </h1>
            <p className="text-white/95 text-lg md:text-xl mb-8 drop-shadow-lg">
              A community of faith, hope, and love
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => onNavigate('iamnew')}
                className="bg-green-600 hover:bg-green-700 shadow-xl"
                size="lg"
              >
                I'm New Here
              </Button>
              <Button 
                onClick={() => onNavigate('contact')}
                variant="outline" 
                className="bg-white/90 hover:bg-white border-white text-blue-900 shadow-xl"
                size="lg"
              >
                Visit Us
              </Button>
            </div>
          </div>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-10' : 'bg-white/60 w-1.5 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            <Card 
              className="border-none shadow-elegant hover:shadow-elegant-hover transition-all duration-500 cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 text-white group overflow-hidden"
              onClick={() => window.open('https://lutheranchurchhyd.org/pastors/', '_blank')}
            >
              <CardContent className="pt-10 pb-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h2 className="text-white mb-4 relative z-10">Our Pastors</h2>
                <div className="flex items-center justify-center gap-2 text-blue-100 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-none shadow-elegant hover:shadow-elegant-hover transition-all duration-500 cursor-pointer bg-gradient-to-br from-green-600 to-green-700 text-white group overflow-hidden"
              onClick={() => onNavigate('sermons')}
            >
              <CardContent className="pt-10 pb-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h2 className="text-white mb-4 relative z-10">Sermons</h2>
                <div className="flex items-center justify-center gap-2 text-green-100 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-none shadow-elegant hover:shadow-elegant-hover transition-all duration-500 cursor-pointer bg-gradient-to-br from-amber-600 to-amber-700 text-white group overflow-hidden"
              onClick={() => onNavigate('events')}
            >
              <CardContent className="pt-10 pb-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h2 className="text-white mb-4 relative z-10">Events</h2>
                <div className="flex items-center justify-center gap-2 text-amber-100 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* AELC Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://lutheranchurchhyd.org/wp-content/uploads/2025/04/003A3423-scaled.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-green-400 mb-2 uppercase tracking-wider text-sm">aelc</p>
            <h2 className="text-white mb-6">
              ANDHRA EVANGELICAL LUTHERAN CHURCH <span className="text-green-400">(AELC)</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              The AELC was founded as a mission field of the then United Lutheran Church in America (ULCA) by John Christian Frederick Heyer (known as Father Heyer) on 31 July 1842. "Father" Heyer was deployed by the Ministerium of Pennsylvania, the oldest synod in North America. Work started by the North German Missionary Society in 1845 was turned over to the American Lutherans in 1850.
            </p>
            <Button 
              onClick={() => onNavigate('aelc')}
              className="bg-green-600 hover:bg-green-700"
            >
              Read More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome & Services Section */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            
            {/* Welcome Card */}
            <Card className="border-green-100 shadow-xl">
              <CardContent className="p-8 lg:p-10">
                <h2 className="text-blue-900 mb-4">
                  Welcome<span className="text-green-600">!</span>
                </h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  At Lutheran Church Hyderabad, we know you will find friendly people, relevant messages, and great Christian education opportunities for all ages. Best of all, however, you will find the message of Jesus Christ our Savior.
                </p>
                <Button 
                  onClick={() => onNavigate('lchyd')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card className="border-blue-100 shadow-xl">
              <CardContent className="p-8 lg:p-10">
                <h2 className="text-blue-900 mb-4">
                  Sunday Worship <span className="text-slate-800">Services</span>
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 text-slate-700">
                    <span className="text-green-600 mt-1">1.</span>
                    <p>Hindi Service 06:30 A.M</p>
                  </div>
                  <div className="flex items-start gap-3 text-slate-700">
                    <span className="text-green-600 mt-1">2.</span>
                    <p>English Service 08:00 A.M</p>
                  </div>
                  <div className="flex items-start gap-3 text-slate-700">
                    <span className="text-green-600 mt-1">3.</span>
                    <p>Telugu Service 10:00 A.M</p>
                  </div>
                  <div className="flex items-start gap-3 text-slate-700">
                    <span className="text-green-600 mt-1">4.</span>
                    <p>Evening Telugu Service 06:30 P.M</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <p className="text-slate-900 mb-4"><strong>MINISTERIAL FELLOWSHIPS</strong></p>
                  
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>1. Sunday School-Hindi 06:45 A.M Every Sunday</p>
                    <p>2. Sunday School-English 08:30 A.M Every Sunday</p>
                    <p>3. Sunday School-Telugu 10:30 A.M Every Sunday</p>
                    <p>4. Women Samaj Fellowship 12:30 P.M Every Month 2nd and 4th Sunday</p>
                    <p>5. Senior Citizen Fellowship 12:30 P.M Every Month 3rd Sunday</p>
                    <p>6. Youtheran Bible Study-English 09:30 A.M Every Sunday</p>
                    <p>7. Youtheran Bible Study-Telugu 11:30 A.M Every Sunday</p>
                    <p>8. Lutheran Choir Practice 05:00 P.M Every Friday</p>
                    <p>9. Fasting Prayer 06:30 P.M Every Friday</p>
                    <p>10. Youtheran Fellowship 06:30 P.M Every Saturday</p>
                    <p>11. All Night Prayer 10:30 P.M Every Month 4th Saturday</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-green-100 shadow-xl overflow-hidden">
              <CardContent className="p-8 lg:p-10">
                <h2 className="text-blue-900 mb-4">
                  Location<span className="text-green-600">.</span>
                </h2>
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700 leading-relaxed">
                    We are located at<br />
                    Saifabad, Lakdikapool,<br />
                    Hyderabad – 500004
                  </p>
                </div>
                
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md">
                  <iframe 
                    src="https://maps.google.com/maps?q=Lutheran+Church+Saifabad+Lakdikapool+Hyderabad+500004&t=m&z=15&output=embed&iwloc=near"
                    title="Lutheran Church Hyderabad Location"
                    className="w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-600 uppercase tracking-wider text-sm mb-2">church</p>
            <p className="text-slate-500 mb-2">Lutheran church</p>
            <h2 className="text-blue-900">Ministries</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Sunday School Ministry Card */}
            <Card 
              className="border-none shadow-xl hover:shadow-2xl transition-all group cursor-pointer overflow-hidden"
              onClick={() => onNavigate('sundayschool')}
            >
              <div className="relative h-80 overflow-hidden">
                <ImageWithFallback
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/ss.jpeg"
                  alt="Sunday School Ministry"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-white mb-3">Sunday School Ministry</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Jesus loves the little children and so does Lutheran Church Hyderabad. We offer a structured, but fun, Bible-centered class that children enjoy very much.
                    </p>
                  </div>
                </div>
                {/* Title overlay when not hovered */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white">Sunday School Ministry</h3>
                  </div>
                </div>
              </div>
            </Card>

            {/* Youtheran Ministry Card */}
            <Card 
              className="border-none shadow-xl hover:shadow-2xl transition-all group cursor-pointer overflow-hidden"
              onClick={() => onNavigate('youtheran')}
            >
              <div className="relative h-80 overflow-hidden">
                <ImageWithFallback
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/IMG-20250104-WA0037.jpg"
                  alt="Youtheran Ministry"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-white mb-3">Youtheran Ministry</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Youtheran (Lutheran Church youth ministry) is more than just another program, it's a group of friends who gather together to have fun and learn about God! Our events are a safe place to hang out with other Lutherans, doing the things that you love to do.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white">Youtheran Ministry</h3>
                  </div>
                </div>
              </div>
            </Card>

            {/* Women's Samaj Card */}
            <Card 
              className="border-none shadow-xl hover:shadow-2xl transition-all group cursor-pointer overflow-hidden"
              onClick={() => onNavigate('womensamaj')}
            >
              <div className="relative h-80 overflow-hidden">
                <ImageWithFallback
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/LWS.jpg"
                  alt="Women's Samaj"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-white mb-3">Women's Samaj</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      All women who attend Lutheran Church Hyderabad are considered members of Women's Samaj and are invited to participate in the church activities and events.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white">Women's Samaj</h3>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-600 uppercase tracking-wider text-sm mb-2">Photos</p>
            <p className="text-slate-500 mb-2">Lutheran church</p>
            <h2 className="text-blue-900">Gallery</h2>
          </div>

          {/* Gallery Grid - Desktop */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer"
              >
                <ImageWithFallback
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
              </div>
            ))}
          </div>

          {/* Gallery Horizontal Scroll - Mobile */}
          <div className="md:hidden relative max-w-sm mx-auto">
            {/* Gallery Image */}
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <ImageWithFallback
                src={galleryImages[currentGalleryIndex]}
                alt={`Gallery ${currentGalleryIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentGalleryIndex((prev) => 
                prev === 0 ? galleryImages.length - 1 : prev - 1
              )}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>

            <button
              onClick={() => setCurrentGalleryIndex((prev) => 
                prev === galleryImages.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-slate-800" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full z-10">
              <p className="text-white text-sm">
                {currentGalleryIndex + 1} / {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Lutheran Church Hyderabad. All rights reserved.
          </p>
          <p className="text-slate-500 mt-2">
            A-1 Parish, Lakdikapool, Hyderabad - 500004
          </p>
        </div>
      </footer>
    </div>
  );
}