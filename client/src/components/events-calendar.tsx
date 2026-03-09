import { useMemo, useState } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/it';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

moment.locale('it');
const localizer = momentLocalizer(moment);

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
  showMore: (total: number) => `+ Altri ${total}`,
};

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    description: string;
    location: string;
  };
}

export function EventsCalendar() {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const events = useMemo<CalendarEvent[]>(
    () => [
      {
        id: 180426,
        title: 'Evento programmato ENAL Caccia Treviso',
        start: new Date('2026-04-18T09:00:00'),
        end: new Date('2026-04-18T18:00:00'),
        resource: {
          description:
            'Evento ufficiale in programma il 18/04/2026. Per programma completo, modalita di partecipazione e dettagli operativi consulta la locandina ufficiale.',
          location: 'Provincia di Treviso',
        },
      },
    ],
    []
  );

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#dc2626',
      borderRadius: '5px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendario Eventi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant={view === Views.MONTH ? 'default' : 'outline'} size="sm" onClick={() => setView(Views.MONTH)}>
              Mese
            </Button>
            <Button variant={view === Views.WEEK ? 'default' : 'outline'} size="sm" onClick={() => setView(Views.WEEK)}>
              Settimana
            </Button>
            <Button variant={view === Views.DAY ? 'default' : 'outline'} size="sm" onClick={() => setView(Views.DAY)}>
              Giorno
            </Button>
            <Button variant={view === Views.AGENDA ? 'default' : 'outline'} size="sm" onClick={() => setView(Views.AGENDA)}>
              Lista
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4 text-sm">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Evento programmato</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div style={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={(event) => setSelectedEvent(event as CalendarEvent)}
              messages={messages}
              formats={{
                dateFormat: 'DD',
                dayFormat: (inputDate: Date) => moment(inputDate).format('DD/MM'),
                monthHeaderFormat: (inputDate: Date) => moment(inputDate).format('MMMM YYYY'),
                dayHeaderFormat: (inputDate: Date) => moment(inputDate).format('dddd DD/MM'),
                dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
                  `${moment(start).format('DD MMMM')} - ${moment(end).format('DD MMMM YYYY')}`,
              }}
              culture="it"
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md" aria-describedby="event-description">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription id="event-description">Dettagli evento</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <Badge className="bg-red-100 border-red-500 text-red-700">Evento ufficiale</Badge>

              <p className="text-sm text-muted-foreground">{selectedEvent.resource.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {moment(selectedEvent.start).format('DD MMMM YYYY - HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEvent.resource.location}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button className="w-full" asChild>
                  <a href="/attached_assets/Locandina 18-04-26.pdf" target="_blank" rel="noopener noreferrer">
                    Apri locandina ufficiale
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/contact">Richiedi informazioni</a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
