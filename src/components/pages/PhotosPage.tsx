import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function PhotosPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    // Church Images from Gallery
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/HDP_4065-qzjmk79eis962tdkks6ilsh8emhrxuld54jcjlat9c.webp",
      title: "Church Worship Service",
      category: "Worship"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/003A3431-scaled-r4i4lkpvz7ogkixmsmvgblzbnm0uxtxjqteo2v2izk.jpg",
      title: "Congregation Gathering",
      category: "Community"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/DCM00710-scaled-rc5y3mv89aagz5cjfks6raz7sl14edj3jqqq0qieg0.jpg",
      title: "Church Interior",
      category: "Building"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/DCM00669-scaled-rc5y3bl5z9v13tsx9fwnxdtonykpu0abi6ww9ez4io.jpg",
      title: "Prayer Meeting",
      category: "Worship"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/CHR00171-qzjmk79eis962tdkks6ilsh8emhrxuld54jcjlat9c.webp",
      title: "Church Celebration",
      category: "Events"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/DCM00771-scaled-rc5y2yffbld0lac1ea7vyh58ckdku8u2sds3jjimxs.jpg",
      title: "Fellowship Time",
      category: "Community"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/003A3481-scaled-r4i4lv242e2m48im49ccl1de6ulwai2lg8l0cwn734.jpg",
      title: "Church Event",
      category: "Events"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/elementor/thumbs/DCM00726-scaled-rc5y2n5d1kxkpysf85cd4jzp7xx69vlaqty9s7zd0g.jpg",
      title: "Sunday Service",
      category: "Worship"
    },
    // Hero Images
    {
      url: "https://images.unsplash.com/photo-1567707873679-18844b507a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBpbnRlcmlvciUyMHdvcnNoaXB8ZW58MXx8fHwxNzYyNzYwMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Church Interior Worship",
      category: "Building"
    },
    {
      url: "https://images.unsplash.com/photo-1608569569089-5d2e3e644ea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjcxOTczOXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Church Building Exterior",
      category: "Building"
    },
    {
      url: "https://images.unsplash.com/photo-1695938746747-ec185ea81325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBjb21tdW5pdHklMjB3b3JzaGlwfGVufDF8fHx8MTc2MjgwNzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Church Community Worship",
      category: "Worship"
    },
    {
      url: "https://images.unsplash.com/photo-1648003613198-929682b62eec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBhbHRhciUyMGNyb3NzfGVufDF8fHx8MTc2Mjg0MTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Church Altar Cross",
      category: "Building"
    },
    {
      url: "https://images.unsplash.com/photo-1550541231-56ddb7f844ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBzdGFpbmVkJTIwZ2xhc3N8ZW58MXx8fHwxNzYyODM3MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Church Stained Glass",
      category: "Building"
    },
    // Ministry Images
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/2025/01/ss.jpeg",
      title: "Sunday School Ministry",
      category: "Ministries"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/2025/01/IMG-20250104-WA0037.jpg",
      title: "Youtheran Ministry",
      category: "Ministries"
    },
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/2025/01/LWS.jpg",
      title: "Women's Samaj",
      category: "Ministries"
    },
    // Background Image
    {
      url: "https://lutheranchurchhyd.org/wp-content/uploads/2025/04/003A3423-scaled.jpg",
      title: "Church Historic Photo",
      category: "History"
    }
  ];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3NjBWMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-elegant flex items-center justify-center">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-blue-200 mb-3 tracking-wide uppercase text-sm">Memories & Moments</p>
          <h1 className="text-white mb-4">Photo Gallery</h1>
          <p className="text-blue-100 mt-4 max-w-2xl mx-auto leading-relaxed text-lg">
            Experience the vibrant life of our church community through these captured moments
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-green-600 mb-2 uppercase tracking-wider text-sm">Explore</p>
              <h2 className="text-blue-900 mb-4">Church Photo Collection</h2>
              <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Browse through our collection of {galleryImages.length} photos capturing worship services, events, ministries, and community life
              </p>
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <Card 
                  key={index}
                  className="border-none shadow-elegant hover:shadow-elegant-hover transition-all duration-300 cursor-pointer overflow-hidden group"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-sm text-green-400 mb-1">{image.category}</p>
                        <h3 className="text-white text-sm">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[selectedImage].url}
              alt={galleryImages[selectedImage].title}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <p className="text-green-400 text-sm mb-1">{galleryImages[selectedImage].category}</p>
              <h3 className="text-white text-xl">{galleryImages[selectedImage].title}</h3>
              <p className="text-white/70 text-sm mt-2">Photo {selectedImage + 1} of {galleryImages.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
