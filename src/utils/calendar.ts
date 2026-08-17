export function generateIcsFile(): void {
  const eventDetails = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Moshe Dora and Priya Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:wedding-moshe-priya-20260903@velnati.com',
    'DTSTAMP:20260817T100000Z',
    'DTSTART:20260903T043000Z', // 10:00 AM IST = 04:30 UTC
    'DTEND:20260903T083000Z',   // 02:00 PM IST = 08:30 UTC
    'SUMMARY:Wedding of Moshe Dora & Priya',
    'DESCRIPTION:Holy Matrimony & Royal Wedding Feast of Moshe Dora & Priya (Velnati Family). Ceremony at 10:00 AM IST followed by lunch reception.',
    'LOCATION:Vedika Function Hall, Main Road, Yeleswaram, Andhra Pradesh 533429',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Moshe Dora & Priya Wedding Tomorrow at 10:00 AM',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([eventDetails], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Moshe_Dora_and_Priya_Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(): string {
  const title = encodeURIComponent("Moshe Dora & Priya's Royal Wedding");
  const details = encodeURIComponent("Join us in celebrating the holy matrimony and royal reception of Moshe Dora & Priya (Velnati Family). Ceremony begins at 10:00 AM IST.");
  const location = encodeURIComponent("Vedika Function Hall, Main Road, Yeleswaram, Andhra Pradesh 533429");
  // 2026-09-03 10:00 IST to 14:00 IST -> 20260903T043000Z to 20260903T083000Z
  const dates = "20260903T043000Z/20260903T083000Z";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function getOutlookCalendarUrl(): string {
  const title = encodeURIComponent("Moshe Dora & Priya's Royal Wedding");
  const details = encodeURIComponent("Holy Matrimony and Reception of Moshe Dora & Priya. Venue: Vedika Function Hall, Yeleswaram.");
  const location = encodeURIComponent("Vedika Function Hall, Yeleswaram, Andhra Pradesh 533429");
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&location=${location}&startdt=2026-09-03T04:30:00Z&enddt=2026-09-03T08:30:00Z`;
}

export function getYahooCalendarUrl(): string {
  const title = encodeURIComponent("Moshe Dora & Priya Wedding");
  const details = encodeURIComponent("Holy Matrimony of Moshe Dora & Priya at Vedika Function Hall, Yeleswaram.");
  const location = encodeURIComponent("Vedika Function Hall, Yeleswaram");
  return `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=20260903T043000Z&et=20260903T083000Z&desc=${details}&in_loc=${location}`;
}
