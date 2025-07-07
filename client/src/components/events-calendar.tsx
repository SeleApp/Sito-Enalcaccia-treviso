import { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/it';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Target, Fish, Dog, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Competition } from '@shared/schema';

// Setup moment localizer per italiano
moment.locale('it');
const localizer = momentLocalizer(moment);

// Traduzioni per il calendario
const messages = {
  allDay: 'Tutto il giorno',
  previous: 'Precedente',
  next: 'Successivo',
  today: 'Oggi',
  month: 'Mese',
  week: 'Settimana',
  day: 'Giorno',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Ora',
  event: 'Evento',
  noEventsInRange: 'Nessun evento in questo periodo',
  showMore: (total: number) => `+ Altri ${total}`
};

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    type: 'competition' | 'course' | 'meeting' | 'other';
    description: string;
    location: string;
    maxParticipants?: number;
    currentParticipants?: number;
    registrationDeadline?: Date;
    price?: number;
    competition?: Competition;
  };
}

export function EventsCalendar() {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Fetch competitions from API
  const { data: competitions = [] } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  // Sample events data - in real app, this would come from API
  const sampleEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Add competitions from API
    competitions.forEach(comp => {
      events.push({
        id: comp.id,
        title: comp.title,
        start: new Date(comp.date),
        end: new Date(comp.date),
        resource: {
          type: 'competition',
          description: comp.description,
          location: comp.location,
          maxParticipants: comp.maxParticipants,
          currentParticipants: comp.currentParticipants,
          registrationDeadline: new Date(comp.registrationDeadline),
          price: comp.price,
          competition: comp
        }
      });
    });

    // Add sample courses and meetings
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    events.push(
      {
        id: 1001,
        title: 'Corso Base Caccia',
        start: new Date(now.getFullYear(), now.getMonth(), 15, 9, 0),
        end: new Date(now.getFullYear(), now.getMonth(), 15, 17, 0),
        resource: {
          type: 'course',
          description: 'Corso base per ottenimento licenza di caccia. Include teoria e pratica.',
          location: 'Sede ENAL Caccia Treviso',
          maxParticipants: 20,
          currentParticipants: 12,
          registrationDeadline: new Date(now.getFullYear(), now.getMonth(), 10),
          price: 150
        }
      },
      {
        id: 1002,
        title: 'Riunione Direttivo',
        start: new Date(now.getFullYear(), now.getMonth(), 20, 20, 30),
        end: new Date(now.getFullYear(), now.getMonth(), 20, 22, 30),
        resource: {
          type: 'meeting',
          description: 'Riunione mensile del direttivo per discussione attività e bilanci.',
          location: 'Sala Riunioni - Sede Principale',
          maxParticipants: 15,
          currentParticipants: 8
        }
      },
      {
        id: 1003,
        title: 'Corso Cinofilia Avanzato',
        start: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5, 8, 0),
        end: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5, 16, 0),
        resource: {
          type: 'course',
          description: 'Corso avanzato di addestramento cani da caccia con istruttori qualificati.',
          location: 'Campo Addestramento Cani',
          maxParticipants: 12,
          currentParticipants: 7,
          registrationDeadline: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1),
          price: 200
        }
      },
      {
        id: 1004,
        title: 'Gara Pesca Sportiva',
        start: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 12, 6, 0),
        end: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 12, 18, 0),
        resource: {
          type: 'competition',
          description: 'Gara provinciale di pesca sportiva alle carpe.',
          location: 'Lago di Revine',
          maxParticipants: 50,
          currentParticipants: 23,
          registrationDeadline: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 8),
          price: 25
        }
      }
    );

    return events;
  }, [competitions]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'competition':
        return Target;
      case 'course':
        return GraduationCap;
      case 'meeting':
        return Users;
      default:
        return CalendarIcon;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'competition':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'course':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'meeting':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const type = event.resource.type;
    let backgroundColor = '#3174ad';
    
    switch (type) {
      case 'competition':
        backgroundColor = '#dc2626';
        break;
      case 'course':
        backgroundColor = '#16a34a';
        break;
      case 'meeting':
        backgroundColor = '#2563eb';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendario Eventi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={view === Views.MONTH ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView(Views.MONTH)}
            >
              Mese
            </Button>
            <Button
              variant={view === Views.WEEK ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView(Views.WEEK)}
            >
              Settimana
            </Button>
            <Button
              variant={view === Views.DAY ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView(Views.DAY)}
            >
              Giorno
            </Button>
            <Button
              variant={view === Views.AGENDA ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView(Views.AGENDA)}
            >
              Lista
            </Button>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Gare</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Corsi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Riunioni</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <div style={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={sampleEvents}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              messages={messages}
              formats={{
                dateFormat: 'DD',
                dayFormat: (date: Date) => moment(date).format('DD/MM'),
                monthHeaderFormat: (date: Date) => moment(date).format('MMMM YYYY'),
                dayHeaderFormat: (date: Date) => moment(date).format('dddd DD/MM'),
                dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => 
                  `${moment(start).format('DD MMMM')} - ${moment(end).format('DD MMMM YYYY')}`
              }}
              culture="it"
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent && (() => {
                const Icon = getEventIcon(selectedEvent.resource.type);
                return <Icon className="w-5 h-5" />;
              })()}
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              Dettagli evento
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <Badge className={getEventColor(selectedEvent.resource.type)}>
                {selectedEvent.resource.type === 'competition' && 'Gara'}
                {selectedEvent.resource.type === 'course' && 'Corso'}
                {selectedEvent.resource.type === 'meeting' && 'Riunione'}
                {selectedEvent.resource.type === 'other' && 'Evento'}
              </Badge>
              
              <p className="text-sm text-muted-foreground">
                {selectedEvent.resource.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {moment(selectedEvent.start).format('DD MMMM YYYY - HH:mm')}
                    {!moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && 
                      ` - ${moment(selectedEvent.end).format('DD MMMM YYYY - HH:mm')}`
                    }
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEvent.resource.location}</span>
                </div>
                
                {selectedEvent.resource.maxParticipants && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {selectedEvent.resource.currentParticipants}/{selectedEvent.resource.maxParticipants} partecipanti
                    </span>
                  </div>
                )}
                
                {selectedEvent.resource.price && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-center">€</span>
                    <span>Costo: €{selectedEvent.resource.price}</span>
                  </div>
                )}
                
                {selectedEvent.resource.registrationDeadline && (
                  <div className="text-xs text-amber-600">
                    Scadenza iscrizioni: {moment(selectedEvent.resource.registrationDeadline).format('DD MMMM YYYY')}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button size="sm" className="flex-1">
                  Iscriviti
                </Button>
                <Button variant="outline" size="sm">
                  Condividi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}