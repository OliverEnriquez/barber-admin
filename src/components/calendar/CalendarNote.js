import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = momentLocalizer(moment);
function CalendarNote() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [eventsArr, setEventsArr] = useState([]);

  useEffect(() => {
    // You can fetch events from an API or another data source here.
    axios
      .get("https://sea-turtle-app-ocnii.ondigitalocean.app/appointments")
      .then((response) => {
        const responseData = response.data;
        if (Array.isArray(responseData)) {
          const newEventsArray = responseData.map((item) => {
            const start = new Date(item.appointmentDateTime);
            const end = new Date(start);
            end.setHours(end.getHours() + 1); // Add one hour to the end time

            return {
              start,
              end,
              title:
                item.customer.firstName +
                " " +
                item.customer.lastName +
                " " +
                item.service.serviceName,
              notes: `Barber: ${item.barber.firstName} ${item.barber.lastName}\nCliente: ${item.customer.firstName} ${item.customer.lastName}\nServicio: ${item.service.description}`,
            };
          });

          setEvents(newEventsArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // For this example, we'll use a sample event.
  }, [events, eventsArr]);

  function setEventsArray(
    year,
    mont,
    day,
    hour,
    min,
    service,
    description,
    barber,
    customer
  ) {
    const descriptionServie =
      "Barber: " +
      barber +
      "\n" +
      "Cliente: " +
      customer +
      "\n" +
      "Servicio: " +
      description;
    const sampleEvent = {
      start: new Date(year, mont, day, hour, min),
      end: new Date(year, mont, day, hour + 1, min),
      title: service,
      notes: descriptionServie,
    };
    setEventsArr((prevData) => [...prevData, sampleEvent]);
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => {
          // You can display the notes when an event is clicked here.
          alert(`Notes: ${event.notes}`);
        }}
      />
    </div>
  );
}
export default CalendarNote;
