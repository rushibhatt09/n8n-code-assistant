---
title: Google Calendar
category: integrations
tags: [google-calendar, calendar, events, oauth]
summary: Create calendar events and trigger workflows on new Google Calendar events from n8n.
---

The **Google Calendar node** in n8n can create, update, or delete calendar events, while the **Google Calendar Trigger** node starts a workflow whenever an event is created or updated — useful for reminders or syncing appointments to other tools.

## How to connect it

1. Create a new credential of type **Google Calendar OAuth2 API**.
2. Click **Sign in with Google** and approve calendar access (requires Google Cloud OAuth credentials configured in n8n beforehand).
3. Save the credential — it becomes available in both the Google Calendar node and trigger.

## Example use case: create an event when a booking form is submitted

1. Add a **Form Trigger** (or Webhook) node to capture booking details.
2. Add a **Google Calendar** node, select your credential, set **Resource** to `Event`, **Operation** to `Create`.
3. Choose the **Calendar** from the dropdown, then set **Start Time** and **End Time** using expressions from the form data, and **Summary** (event title).

```
Start Time: {{ $json.appointmentDate }}
Summary: Consultation with {{ $json.customerName }}
```

4. Optionally add **Attendees** (comma-separated emails) so invites go out automatically.

To trigger a workflow on new events instead, use the **Google Calendar Trigger** node, select the **Calendar**, and set **Trigger On** to `Event Created` (or `Event Updated`/`Event Cancelled`). Set **Poll Times** to control how often n8n checks (e.g. every 5 minutes).

```json
{
  "summary": "Consultation with Jane Doe",
  "start": { "dateTime": "2026-07-10T14:00:00-05:00" },
  "end": { "dateTime": "2026-07-10T14:30:00-05:00" }
}
```

**Common mistake:** Forgetting to set the correct timezone in start/end times — Google Calendar interprets datetime strings literally, so an event meant for 2pm local time can appear at the wrong hour if the timezone offset is missing or wrong. Always include an explicit timezone offset or use n8n's `$now`/Luxon expressions with the right zone.
