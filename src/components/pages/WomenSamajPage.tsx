import React from 'react';
import { Heart, Users, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function WomenSamajPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-pink-900 to-purple-900 text-white py-24 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(131, 24, 67, 0.85), rgba(88, 28, 135, 0.85)), url(https://images.unsplash.com/photo-1739301674016-45dddb02e2dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNodXJjaCUyMGZlbGxvd3NoaXB8ZW58MXx8fHwxNzYyODQwMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080)`,
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-pink-200 mb-2">Ministry</p>
          <h1 className="text-white">Women's Samaj</h1>
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
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/LWS.jpg"
                  alt="Lutheran Women's Samaj"
                  className="w-full h-80 sm:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Text Content */}
              <Card className="border-pink-100 shadow-xl">
                <CardContent className="p-8 lg:p-10">
                  <div className="space-y-6">
                    
                    {/* Main Content */}
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                      <p>
                        The Lutheran Church has always recognised the importance of the women of and in the Church and their role in the furtherance of the ministry of the Church to establish the spiritual growth of the Church.
                      </p>
                      
                      <p>
                        The women of the Church have always risen to the Occasion when ever there is need and have never failed to utilise the opportunity to the maximum and have efficiently served the Lord resulting in the development of the Church. They have always been recognised for their Hospitality, Fundraising, Decoration Ideas, and many more.
                      </p>
                      
                      <p>
                        The women Samaj meets on <span className="font-semibold text-pink-900">every Second and Fourth Sundays of the month</span> to cater their Spiritual needs. The Wives of the Pastorate do support the Women Samaj in their spiritual Journey and help encourage each other for the smoother coexistence.
                      </p>

                      <div className="pt-4 border-t border-pink-200">
                        <p className="font-semibold text-pink-900 mb-2">
                          The Major Motto:
                        </p>
                        <p>
                          The major Motto behind the Women Samaj is to pray for the development of the Church Holistically as well to intercede towards the needy and the sick.
                        </p>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Image - Desktop Only */}
              <div className="hidden lg:block">
                <ImageWithFallback
                  src="https://lutheranchurchhyd.org/wp-content/uploads/2025/01/LWS.jpg"
                  alt="Lutheran Women's Samaj"
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>

            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              
              <Card className="border-pink-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-pink-900 mb-2">Dedicated Service</h3>
                  <p className="text-slate-600 text-sm">
                    Women rising to every occasion with hospitality, fundraising, and creative decoration ideas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-pink-900 mb-2">Regular Fellowship</h3>
                  <p className="text-slate-600 text-sm">
                    Meeting every Second and Fourth Sunday to cater spiritual needs and encourage each other
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-pink-900 mb-2">Prayer & Intercession</h3>
                  <p className="text-slate-600 text-sm">
                    Praying for church development holistically and interceding for the needy and sick
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Quote/Highlight Section */}
            <div className="mt-16">
              <Card className="border-pink-100 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-pink-900 to-purple-900 text-white p-8 text-center">
                  <div className="max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white mb-4">Empowering Women in Ministry</h3>
                    <p className="text-pink-100 leading-relaxed">
                      "The women of the Church have always risen to the occasion whenever there is need and have never failed to utilize the opportunity to the maximum and have efficiently served the Lord."
                    </p>
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
