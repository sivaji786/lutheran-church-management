import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function IAmNewPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3NjBWMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6">
            <p className="text-blue-200 mb-3 tracking-wide uppercase text-sm">Welcome To</p>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-white mb-0">i am</h1>
            </div>
            <h1 className="text-white mt-2" style={{ fontSize: '4rem', fontWeight: '700' }}>New</h1>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-slate-700 leading-relaxed mb-4 text-lg">
                  We are glad you decided to join us. We firmly believe that all followers of Christ should find a local church where they can get plugged into. We believe that Lutheran Church Hyderabad is a great place where the Word of God is taught as truth, and the members are striving to be dedicated followers of Christ.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4 text-lg">
                  Here are our standard events that happen weekly at Lutheran Church Hyderabad, and you can see more on the events page.
                </p>
                <p className="text-blue-900 text-lg">
                  All night prayer on every 4th Saturday
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[3/2] rounded-2xl overflow-hidden shadow-elegant-lg">
                  <ImageWithFallback
                    src="https://lutheranchurchhyd.org/wp-content/uploads/2024/12/CHR00167-1024x683.webp"
                    alt="Lutheran Church Community"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Events Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sunday Worship Card */}
              <Card className="border-blue-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1604443830970-05ac4193ada9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBjb25ncmVnYXRpb24lMjB3b3JzaGlwfGVufDF8fHx8MTc2Mjc5OTExM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Sunday Worship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-blue-50">
                    <h2 className="text-blue-900 mb-4">Sunday Worship</h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-slate-600">
                        <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>English service from 8 am - 10 am</span>
                      </li>
                      <li className="flex items-start gap-2 text-slate-600">
                        <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Telugu service from 10 am - 12 pm</span>
                      </li>
                      <li className="flex items-start gap-2 text-slate-600">
                        <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Telugu service from 06:30 pm - 8 pm</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Sunday School Card */}
              <Card className="border-green-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1713012633197-1426a345ca99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN1bmRheSUyMHNjaG9vbHxlbnwxfHx8fDE3NjI4MzEwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Sunday School"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-green-50">
                    <h2 className="text-blue-900 mb-4">Sunday school</h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-slate-600">
                        <ChevronRight className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>English from 8 am - 10 am</span>
                      </li>
                      <li className="flex items-start gap-2 text-slate-600">
                        <ChevronRight className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Telugu from 10 am to 12 pm</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Women's Samaj Card */}
              <Card className="border-pink-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1739301674016-45dddb02e2dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNodXJjaCUyMGdyb3VwfGVufDF8fHx8MTc2Mjg0MjkwMnww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Women's Samaj"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-pink-50">
                    <h2 className="text-blue-900 mb-4">Women's Samaj</h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-slate-600">
                        <ChevronRight className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>Every 2nd and 4th Saturday</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Youth Meeting Card */}
              <Card className="border-purple-100 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1726679402113-beb32b857a59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGNodXJjaCUyMG1lZXRpbmd8ZW58MXx8fHwxNzYyODQyOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Youth Meeting"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-purple-50">
                    <h2 className="text-blue-900 mb-4">Youth Meeting</h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-slate-600">
                        <ChevronRight className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span>Every Saturday</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
