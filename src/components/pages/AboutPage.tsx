import React from 'react';
import { Church, Heart, Users, Book, ArrowRight, Calendar, Camera, Video } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

type AboutPageProps = {
  onNavigate: (page: 'aelc' | 'lchyd' | 'events' | 'photos' | 'videos') => void;
};

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-white">About Us</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Learn about our history, mission, and the values that guide our community
          </p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 bg-gradient-to-br from-slate-50 to-white border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-blue-900 mb-4 text-center">Explore More</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Button
              onClick={() => onNavigate('aelc')}
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 hover:border-blue-400 h-auto py-4 flex flex-col gap-2"
            >
              <Church className="w-6 h-6 text-blue-600" />
              <span className="text-sm">AELC</span>
            </Button>
            <Button
              onClick={() => onNavigate('lchyd')}
              variant="outline"
              className="border-green-200 hover:bg-green-50 hover:border-green-400 h-auto py-4 flex flex-col gap-2"
            >
              <Heart className="w-6 h-6 text-green-600" />
              <span className="text-sm">LC HYD</span>
            </Button>
            <Button
              onClick={() => onNavigate('events')}
              variant="outline"
              className="border-amber-200 hover:bg-amber-50 hover:border-amber-400 h-auto py-4 flex flex-col gap-2"
            >
              <Calendar className="w-6 h-6 text-amber-600" />
              <span className="text-sm">Events</span>
            </Button>
            <Button
              onClick={() => onNavigate('photos')}
              variant="outline"
              className="border-pink-200 hover:bg-pink-50 hover:border-pink-400 h-auto py-4 flex flex-col gap-2"
            >
              <Camera className="w-6 h-6 text-pink-600" />
              <span className="text-sm">Photos</span>
            </Button>
            <Button
              onClick={() => onNavigate('videos')}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50 hover:border-purple-400 h-auto py-4 flex flex-col gap-2"
            >
              <Video className="w-6 h-6 text-purple-600" />
              <span className="text-sm">Videos</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-blue-900 mb-6">Our History</h2>
            <p className="text-slate-600 mb-6">
              Lutheran Church Hyderabad has been a beacon of faith and service in the Lakdikapool community
              for many years. Our church is part of the Andhra Evangelical Lutheran Church (AELC), committed
              to spreading the Gospel and serving our community with love and compassion.
            </p>

            <h2 className="text-blue-900 mb-6 mt-12">Our Beliefs</h2>
            <p className="text-slate-600 mb-6">
              We follow the Lutheran tradition, grounded in Scripture and the teachings of Martin Luther.
              Our faith is centered on God's grace through Jesus Christ, and we believe in the power of
              the Word and Sacraments to transform lives.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="border-green-100">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Church className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-blue-900 mb-2">Worship</h3>
                      <p className="text-slate-600">
                        Gathering together to praise God and receive His Word through Scripture and Sacrament.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-blue-900 mb-2">Service</h3>
                      <p className="text-slate-600">
                        Serving our community and those in need, reflecting Christ's love in action.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-blue-900 mb-2">Fellowship</h3>
                      <p className="text-slate-600">
                        Building meaningful relationships within our church family and community.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Book className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-blue-900 mb-2">Teaching</h3>
                      <p className="text-slate-600">
                        Growing in faith through biblical teaching and discipleship.
                      </p>
                    </div>
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