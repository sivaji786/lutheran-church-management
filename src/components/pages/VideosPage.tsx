import React from 'react';
import { Video, Play, ExternalLink, Youtube } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export function VideosPage() {
  const videos = [
    {
      id: 1,
      videoId: '67apVkF0P4E',
      url: 'https://www.youtube.com/watch?v=67apVkF0P4E',
      title: 'Sunday Worship Service',
      description: 'Join us for our Sunday worship service filled with prayer, music, and the Word of God.'
    },
    {
      id: 2,
      videoId: '_ElJz4X3NhM',
      url: 'https://www.youtube.com/watch?v=_ElJz4X3NhM',
      title: 'Special Sermon Series',
      description: 'A powerful message from our pastor about faith, hope, and Christian living.'
    },
    {
      id: 3,
      videoId: 'LKDtIKGwkQM',
      url: 'https://www.youtube.com/watch?v=LKDtIKGwkQM',
      title: 'Youth Ministry Program',
      description: 'Watch highlights from our Youtheran ministry events and activities.'
    },
    {
      id: 4,
      videoId: '4KNX0G2Ddpg',
      url: 'https://www.youtube.com/watch?v=4KNX0G2Ddpg',
      title: 'Church Community Event',
      description: 'Experience the fellowship and community spirit at Lutheran Church Hyderabad.'
    },
    {
      id: 5,
      videoId: 'dQw4w9WgXcQ',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Christmas Celebration',
      description: 'Celebrate the birth of Jesus Christ with our church family during this special service.'
    },
    {
      id: 6,
      videoId: 'jNQXAC9IVRw',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      title: 'Easter Service',
      description: 'Rejoice in the resurrection of our Lord during this blessed Easter worship.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3NjBWMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-elegant flex items-center justify-center">
              <Video className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-blue-200 mb-3 tracking-wide uppercase text-sm">Watch & Learn</p>
          <h1 className="text-white mb-4">Video Gallery</h1>
          <p className="text-blue-100 mt-4 max-w-2xl mx-auto leading-relaxed text-lg">
            Watch our sermons, worship services, and special events from Lutheran Church Hyderabad
          </p>
        </div>
      </section>

      {/* Live Stream CTA */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-red-100 shadow-elegant-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-6 p-8 lg:p-10 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
                    <Youtube className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-white mb-2">Watch Live Streams</h2>
                  <p className="text-red-100 leading-relaxed">
                    Join us live on YouTube for worship services, special events, and more!
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
      </section>

      {/* Video Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-green-600 mb-2 uppercase tracking-wider text-sm">Our Content</p>
              <h2 className="text-blue-900 mb-4">Recent Videos</h2>
              <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Browse our latest sermons, worship services, and church events
              </p>
            </div>

            {/* Videos Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <Card 
                  key={video.id} 
                  className="border-blue-100 shadow-elegant hover:shadow-elegant-hover transition-all duration-300 overflow-hidden group"
                >
                  <CardContent className="p-0">
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-6 bg-white">
                      <h3 className="text-blue-900 mb-2 group-hover:text-green-600 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        {video.description}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => window.open(video.url, '_blank')}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch
                        </Button>
                        <Button
                          onClick={() => window.open(video.url, '_blank')}
                          variant="outline"
                          className="border-blue-200 hover:border-blue-300"
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* YouTube Channel Link */}
            <div className="mt-16 text-center">
              <Card className="max-w-2xl mx-auto border-green-100 shadow-elegant">
                <CardContent className="p-8">
                  <Youtube className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-blue-900 mb-3">Visit Our YouTube Channel</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Subscribe to our channel for more sermons, worship services, and updates from Lutheran Church Hyderabad
                  </p>
                  <Button
                    onClick={() => window.open('https://www.youtube.com/@lutheranchurchhyderabad9241', '_blank')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Youtube className="w-5 h-5 mr-2" />
                    Subscribe on YouTube
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
