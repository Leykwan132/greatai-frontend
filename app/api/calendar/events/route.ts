import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'node:path';
import process from 'node:process';
import { authenticate } from '@google-cloud/local-auth';

// The scope for reading calendar events.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
console.log('CREDENTIALS_PATH', CREDENTIALS_PATH)
export async function GET(req: NextRequest) {
  try {
    // Authenticate with Google and get an authorized client.
    const auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    console.log('Authentication successful');
    // Create a new Calendar API client.
    const calendar = google.calendar({ version: 'v3', auth });
    console.log('Calendar API client created');

    // Get the list of events.
    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = result.data.items;

    if (!events || events.length === 0) {
      return NextResponse.json({ message: 'No upcoming events found.' });
    }

    // Format the events to include only necessary information
    const formattedEvents = events.map((event) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      attendees: event.attendees,
      htmlLink: event.htmlLink,
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.error();
  }
}
