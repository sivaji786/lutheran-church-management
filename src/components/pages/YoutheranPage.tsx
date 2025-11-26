import React from 'react';
import { Users, Heart, Music, Globe } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';

export function YoutheranPage() {
  const activities = [
    "Church decorations for special occasions",
    "Regular Bible Study sessions",
    "Organizing retreats on holidays",
    "Representing AELC on global platforms",
    "Active participation in Choir",
    "Leading Praise and Worship in services"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-24 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(234, 88, 12, 0.85), rgba(220, 38, 38, 0.85)), url(https://images.unsplash.com/photo-1617080090911-91409e3496ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGNodXJjaCUyMGZlbGxvd3NoaXB8ZW58MXx8fHwxNzYyODQwNDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080)`,
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-orange-200 mb-2">Ministry</p>
          <h1 className="text-white">Youtheran</h1>
          <p className="text-orange-100 mt-4 max-w-2xl mx-auto">
            Youth Fellowship of Lutheran Church Hyderabad "A-1" Parish
          </p>
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
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/IMG-20250104-WA0037.jpg"
                  alt="Youtheran Youth Fellowship"
                  className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Text Content */}
              <Card className="border-orange-100 shadow-xl">
                <CardContent className="p-8 lg:p-10">
                  <div className="space-y-6">
                    
                    {/* Introduction */}
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                      <p>
                        The Youth Fellowship of the Lutheran Church, Hyderabad "A-1" Parish was able to come up with a unique name for their Fellowship and have coined the term <span className="font-semibold text-orange-600">"Youtheran."</span>
                      </p>
                      
                      <p>
                        Since the day of the inception of the Lutheran Church in Hyderabad the youth fellowship has been an integral part of the Church ministry and have played an pivotal role in the formation of the youth community in Christian Faith.
                      </p>
                    </div>

                    {/* Milestone Badges */}
                    <div className="flex flex-wrap gap-3 py-4">
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2">
                        2001: 21 Confirmants
                      </Badge>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2">
                        2024: 35 Confirmants
                      </Badge>
                    </div>

                    {/* Records */}
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                      <p>
                        The year <span className="font-semibold text-orange-900">2001</span> marked the highest number of Confirmants into the Congregation of Christian world by conducting the Confirmation order for 21 members since the day of inception of the Lutheran Church.
                      </p>
                      
                      <p>
                        Breaking the same record the <span className="font-semibold text-orange-900">2024</span> marked the highest number of 35 Confirmants on the Palm Sunday. The Ministry of the Youtheran has been exceptional through their Outreach Programs. One among such outreach programs was the ministry at Gudur, a village in now the Telangana State at a distance of 30 KM from Hyderabad towards the Srisailam Dam.
                      </p>
                    </div>

                    {/* Closing Statement */}
                    <div className="pt-4 border-t border-orange-200">
                      <p className="text-slate-700 leading-relaxed">
                        The Youtheran takes pride in serving the needs of the Church by participating in the decorations of the Church in occasions, Bible Study, organising retreats on holidays, representing the AELC in various global platforms and stages, participation in Choir, leading the Praise and Worship in regular Worship Services and many more. <span className="font-semibold text-orange-900">The Church takes pride in the Youtheran.</span>
                      </p>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Image - Desktop Only */}
              <div className="hidden lg:block">
                <ImageWithFallback
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/IMG-20250104-WA0037.jpg"
                  alt="Youtheran Youth Fellowship"
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>

            </div>

            {/* Activities Section */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <h2 className="text-orange-900 mb-4">Our Activities</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Youtheran actively serves the church through various ministries and activities
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity, index) => (
                  <Card key={index} className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-slate-700 text-sm">
                          {activity}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-4 gap-6 mt-16">
              
              <Card className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-orange-900 mb-2">Fellowship</h3>
                  <p className="text-slate-600 text-sm">
                    Building strong Christian youth community
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-orange-900 mb-2">Outreach</h3>
                  <p className="text-slate-600 text-sm">
                    Ministry programs like Gudur village outreach
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-orange-900 mb-2">Worship</h3>
                  <p className="text-slate-600 text-sm">
                    Leading praise, worship and choir ministry
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-orange-900 mb-2">Global</h3>
                  <p className="text-slate-600 text-sm">
                    Representing AELC on global platforms
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Quote Section */}
            <div className="mt-16">
              <Card className="border-orange-100 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-8 text-center">
                  <div className="max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white mb-4">The Pride of the Church</h3>
                    <p className="text-orange-100 leading-relaxed text-lg">
                      "The Church takes pride in the Youtheran"
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/20">
                      <p className="text-orange-100 text-sm">
                        An integral part of the Church ministry since inception, playing a pivotal role in the formation of the youth community in Christian Faith.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
