import React from 'react';
import { Calendar, Clock, MapPin, Users, CalendarPlus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Sunday Worship Service",
      date: "Every Sunday",
      time: "Multiple Timings",
      location: "Main Church Hall",
      description: "Join us for worship in Hindi (6:30 AM), English (8:00 AM), Telugu (10:00 AM), and Evening Telugu (6:30 PM) services.",
      type: "Worship",
      recurring: true,
      // For recurring events, we'll use next Sunday's date
      startDate: getNextDayOfWeek(0), // 0 = Sunday
      startTime: "06:30",
      endTime: "19:00",
      duration: 90 // in minutes
    },
    {
      id: 2,
      title: "Women's Samaj Fellowship",
      date: "2nd & 4th Sunday",
      time: "12:30 PM",
      location: "Fellowship Hall",
      description: "Women's fellowship meeting for prayer, spiritual growth, and community building.",
      type: "Fellowship",
      recurring: true,
      startDate: getNextDayOfWeek(0),
      startTime: "12:30",
      duration: 120
    },
    {
      id: 3,
      title: "Youtheran Fellowship",
      date: "Every Saturday",
      time: "6:30 PM",
      location: "Youth Center",
      description: "Youth fellowship gathering for fun, learning, and growing together in faith.",
      type: "Youth",
      recurring: true,
      startDate: getNextDayOfWeek(6), // 6 = Saturday
      startTime: "18:30",
      duration: 120
    },
    {
      id: 4,
      title: "All Night Prayer",
      date: "4th Saturday of Every Month",
      time: "10:30 PM",
      location: "Main Church Hall",
      description: "Monthly all-night prayer meeting for intercession and spiritual renewal.",
      type: "Prayer",
      recurring: true,
      startDate: getNextDayOfWeek(6),
      startTime: "22:30",
      duration: 480 // 8 hours
    },
    {
      id: 5,
      title: "Lutheran Choir Practice",
      date: "Every Friday",
      time: "5:00 PM",
      location: "Music Room",
      description: "Weekly choir practice for those who wish to serve through music ministry.",
      type: "Music",
      recurring: true,
      startDate: getNextDayOfWeek(5), // 5 = Friday
      startTime: "17:00",
      duration: 90
    },
    {
      id: 6,
      title: "Fasting Prayer",
      date: "Every Friday",
      time: "6:30 PM",
      location: "Prayer Room",
      description: "Weekly fasting and prayer service for spiritual discipline and seeking God's guidance.",
      type: "Prayer",
      recurring: true,
      startDate: getNextDayOfWeek(5),
      startTime: "18:30",
      duration: 90
    }
  ];

  // Helper function to get next occurrence of a day of week
  function getNextDayOfWeek(dayOfWeek: number): Date {
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
    return targetDate;
  }

  // Format date to Google Calendar format (YYYYMMDDTHHMMSS)
  const formatDateForGoogle = (date: Date, time: string): string => {
    const [hours, minutes] = time.split(':');
    const eventDate = new Date(date);
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    const hour = String(eventDate.getHours()).padStart(2, '0');
    const minute = String(eventDate.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}T${hour}${minute}00`;
  };

  // Calculate end time based on start time and duration
  const calculateEndTime = (startDate: Date, startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':');
    const eventDate = new Date(startDate);
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    eventDate.setMinutes(eventDate.getMinutes() + durationMinutes);
    
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    const hour = String(eventDate.getHours()).padStart(2, '0');
    const minute = String(eventDate.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}T${hour}${minute}00`;
  };

  // Generate Google Calendar URL
  const generateGoogleCalendarUrl = (event: any) => {
    const startDateTime = formatDateForGoogle(event.startDate, event.startTime);
    const endDateTime = calculateEndTime(event.startDate, event.startTime, event.duration);
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startDateTime}/${endDateTime}`,
      details: event.description,
      location: `Lutheran Church Hyderabad, ${event.location}, Saifabad, Lakdikapool, Hyderabad - 500004`,
      recur: event.recurring ? getRecurrenceRule(event) : ''
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Get recurrence rule for recurring events
  const getRecurrenceRule = (event: any) => {
    if (!event.recurring) return '';
    
    // Determine frequency based on event date pattern
    if (event.date.includes('Every Sunday')) {
      return 'RRULE:FREQ=WEEKLY;BYDAY=SU';
    } else if (event.date.includes('Every Saturday')) {
      return 'RRULE:FREQ=WEEKLY;BYDAY=SA';
    } else if (event.date.includes('Every Friday')) {
      return 'RRULE:FREQ=WEEKLY;BYDAY=FR';
    } else if (event.date.includes('2nd & 4th Sunday')) {
      return 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=SU';
    } else if (event.date.includes('4th Saturday')) {
      return 'RRULE:FREQ=MONTHLY;BYDAY=4SA';
    }
    
    return '';
  };

  const handleAddToCalendar = (event: any) => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Worship':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'Fellowship':
        return 'bg-pink-100 text-pink-700 hover:bg-pink-200';
      case 'Youth':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      case 'Prayer':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      case 'Music':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      default:
        return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
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
              <Calendar className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-blue-200 mb-3 tracking-wide uppercase text-sm">Stay Connected</p>
          <h1 className="text-white mb-4">Church Events</h1>
          <p className="text-blue-100 mt-4 max-w-2xl mx-auto leading-relaxed text-lg">
            Join us for worship, fellowship, and community activities throughout the week
          </p>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-green-600 mb-2 uppercase tracking-wider text-sm">Our Schedule</p>
              <h2 className="text-blue-900 mb-4">Regular Events & Programs</h2>
              <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Our church hosts various events and programs throughout the week. Everyone is welcome to join us!
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      {event.recurring && (
                        <Badge variant="outline" className="text-xs">
                          Recurring
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-blue-900 mb-4">{event.title}</h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3 text-slate-600 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{event.date}</span>
                      </div>

                      <div className="flex items-start gap-3 text-slate-600 text-sm">
                        <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>

                      <div className="flex items-start gap-3 text-slate-600 text-sm">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {event.description}
                    </p>

                    <Button
                      onClick={() => handleAddToCalendar(event)}
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                    >
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Add to Google Calendar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Calendar Integration Card */}
            <div className="mt-16">
              <Card className="border-green-100 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8 text-center">
                  <div className="max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white mb-4">View Full Calendar</h3>
                    <p className="text-green-100 leading-relaxed mb-6">
                      For a complete schedule of all church events, services, and activities, visit our Google Calendar. You can also subscribe to stay updated automatically.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="https://calendar.google.com/calendar/u/0/embed?src=lutheranhyderabad@gmail.com&ctz=Asia/Calcutta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Open Church Calendar
                      </a>
                      <a
                        href="https://calendar.google.com/calendar/u/0/r?cid=lutheranhyderabad@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white/10 backdrop-blur-sm text-white border-2 border-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <CalendarPlus className="w-4 h-4 inline mr-2" />
                        Subscribe to Calendar
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Additional Info Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              
              <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-blue-900 mb-2">All Welcome</h3>
                  <p className="text-slate-600 text-sm">
                    Everyone is welcome to attend our events and services, regardless of background
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-blue-900 mb-2">Easy to Find</h3>
                  <p className="text-slate-600 text-sm">
                    Located at Saifabad, Lakdikapool, Hyderabad - 500004
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-blue-900 mb-2">Regular Updates</h3>
                  <p className="text-slate-600 text-sm">
                    Check our calendar regularly for special events and schedule changes
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
