import React from 'react';
import { Play, Youtube } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export function SermonsPage() {
  const sermons = [
    {
      id: 1,
      videoId: '67apVkF0P4E',
      url: 'https://www.youtube.com/watch?v=67apVkF0P4E',
      title: 'Sunday Worship Service',
      description: 'Join us for our Sunday worship service filled with prayer and the Word of God.'
    },
    {
      id: 2,
      videoId: '_ElJz4X3NhM',
      url: 'https://www.youtube.com/watch?v=_ElJz4X3NhM',
      title: 'Faith and Hope',
      description: 'A powerful message about faith, hope, and Christian living.'
    },
    {
      id: 3,
      videoId: 'LKDtIKGwkQM',
      url: 'https://www.youtube.com/watch?v=LKDtIKGwkQM',
      title: 'Walking in Grace',
      description: 'Understanding God\'s grace in our daily walk with Christ.'
    },
    {
      id: 4,
      videoId: '4KNX0G2Ddpg',
      url: 'https://www.youtube.com/watch?v=4KNX0G2Ddpg',
      title: 'Community Fellowship',
      description: 'Experience the fellowship and community spirit at Lutheran Church.'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3NjBWMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-elegant flex items-center justify-center">
              <Play className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-blue-200 mb-3 tracking-wide uppercase text-sm">Grow in Faith</p>
          <h1 className="text-white mb-4">Sermons</h1>
          <p className="text-blue-100 mt-4 max-w-2xl mx-auto leading-relaxed text-lg">
            Watch our latest sermons and grow in your faith journey
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-green-600 mb-2 uppercase tracking-wider text-sm">Latest Messages</p>
              <h2 className="text-blue-900 mb-4">Recent Sermons</h2>
              <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Explore our collection of inspiring sermons and messages from our church
              </p>
            </div>

            {/* Sermons Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {sermons.map((sermon) => (
                <Card key={sermon.id} className="border-blue-100 shadow-elegant hover:shadow-elegant-hover transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="aspect-video w-full bg-slate-900">
                      <iframe
                        src={`https://www.youtube.com/embed/${sermon.videoId}`}
                        title={sermon.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="text-blue-900 mb-2 group-hover:text-green-600 transition-colors">{sermon.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        {sermon.description}
                      </p>
                      <Button
                        onClick={() => window.open(sermon.url, '_blank')}
                        variant="outline"
                        className="w-full border-blue-200 hover:border-green-600 hover:text-green-600"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch on YouTube
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Live Stream CTA */}
            <Card className="border-red-100 shadow-elegant-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center gap-6 p-8 lg:p-10 bg-gradient-to-r from-red-600 to-red-700 text-white">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
                      <Youtube className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-white mb-2">Watch Live Services</h2>
                    <p className="text-red-100 leading-relaxed">
                      Join us live on YouTube for worship services, prayer meetings, and special events!
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => window.open('https://www.youtube.com/@lutheranchurchhyderabad9241/streams', '_blank')}
                      className="bg-white text-red-600 hover:bg-red-50 shadow-lg"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Live Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}