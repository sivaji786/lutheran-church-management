import React from 'react';
import { Users, Heart, BookOpen, Music, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

type MinistriesPageProps = {
  onNavigate: (page: 'sundayschool' | 'womensamaj' | 'youtheran') => void;
};

export function MinistriesPage({ onNavigate }: MinistriesPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-white">Our Ministries</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Serving God and our community through various ministries
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sunday Schools */}
            <Card className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-white border-b">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Sunday Schools Ministry</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4">
                  Our Sunday School program provides age-appropriate biblical teaching for children,
                  helping them grow in faith and understanding of God's Word.
                </p>
                <ul className="space-y-2 text-slate-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Biblical stories and lessons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Interactive activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Character development</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => onNavigate('sundayschool')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Women's Samaj */}
            <Card className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="bg-gradient-to-br from-pink-50 to-white border-b">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle className="text-blue-900">Women's Samaj</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4">
                  The Women's Samaj brings together women of all ages for fellowship, spiritual growth,
                  and service to the church and community.
                </p>
                <ul className="space-y-2 text-slate-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Weekly prayer meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Bible study groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Community outreach</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => onNavigate('womensamaj')}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Youtheran */}
            <Card className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="bg-gradient-to-br from-green-50 to-white border-b">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-blue-900">Youtheran Ministry</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4">
                  Youtheran is our youth ministry focused on building the next generation of faithful
                  Christian leaders through discipleship and fellowship.
                </p>
                <ul className="space-y-2 text-slate-600 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Youth worship services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Leadership training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Social activities</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => onNavigate('youtheran')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Music Ministry */}
            <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-br from-amber-50 to-white border-b">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-blue-900">Music Ministry</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4">
                  Our music ministry leads worship through song, helping the congregation connect
                  with God through meaningful worship music.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Choir practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Sunday worship leading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Special music events</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}