import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function SundaySchoolPage() {
  const features = [
    "Christ-centered lessons they can identify with and apply to their lives.",
    "Age-appropriate artwork to help them grasp Biblical concepts.",
    "Fun and engaging activities that make learning enjoyable.",
    "A unified, Biblical theme for all age levels.",
    "A wide variety of activities, games, music, and videos that support Bible lessons and encourage students in their personal relationship with Christ."
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 58, 138, 0.85)), url(https://images.unsplash.com/photo-1713012633197-1426a345ca99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN1bmRheSUyMHNjaG9vbHxlbnwxfHx8fDE3NjI4MzEwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080)`,
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-blue-200 mb-2">Ministry</p>
          <h1 className="text-white">Sunday Schools</h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Image - Mobile Only */}
              <div className="lg:hidden">
                <ImageWithFallback
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/6323343_162-scaled.jpg"
                  alt="Sunday School Children"
                  className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Text Content */}
              <Card className="border-green-100 shadow-xl">
                <CardContent className="p-8 lg:p-10">
                  <div className="space-y-6">
                    
                    {/* Introduction */}
                    <div className="space-y-4">
                      <p className="text-slate-700 leading-relaxed">
                        Jesus loves the little children and so does Lutheran Church Hyderabad. We offer a structured, but fun, Bible-centered class that children enjoy very much.
                      </p>
                      
                      <p className="text-slate-700 leading-relaxed">
                        Sunday School is offered year round for all ages on Sunday morning during English and Telugu services.
                      </p>
                      
                      <p className="text-slate-700 leading-relaxed font-semibold text-blue-900">
                        Our Sunday School curriculum is kid-friendly and creative offering:
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 group">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center group-hover:from-green-200 group-hover:to-blue-200 transition-colors">
                              <ArrowRight className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Closing Statement */}
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-slate-700 leading-relaxed">
                        At every level, this interactive Sunday School program helps students; both young and high school age make a solid connection between God's word and everyday life.
                      </p>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Image - Desktop Only */}
              <div className="hidden lg:block">
                <ImageWithFallback
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/6323343_162-scaled.jpg"
                  alt="Sunday School Children"
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>

            </div>

            {/* Additional Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              
              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-blue-900 mb-2">Bible-Centered</h3>
                  <p className="text-slate-600 text-sm">
                    Christ-centered lessons that children can identify with and apply to their lives
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-blue-900 mb-2">Fun & Engaging</h3>
                  <p className="text-slate-600 text-sm">
                    Activities, games, music, and videos that make learning enjoyable
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-blue-900 mb-2">All Ages</h3>
                  <p className="text-slate-600 text-sm">
                    Year-round program for all ages during English and Telugu services
                  </p>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
