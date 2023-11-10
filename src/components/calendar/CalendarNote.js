import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { Button, Modal } from 'react-bootstrap';

const localizer = momentLocalizer(moment);
function CalendarNote() {
  const [events, setEvents] = useState([]);
  const [eventsArr, setEventsArr] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const htmlContent = '<p>This is some <strong>HTML</strong> content.</p>';



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
                item.service.serviceName +
                " - " +
                item.barber.firstName + " " + item.barber.lastName,
              notes: `<b>Barber:</b> ${item.barber.firstName} ${item.barber.lastName}<br/><b>Cliente: </b> ${item.customer.firstName} ${item.customer.lastName}<br/><b>Servicio: </b> ${item.service.description}
              <br/><b>Fecha: </b> ${item.appointmentDateTime}`,
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

  function onCLickDate(event) {
    setDescription(event.notes);
    setShowModal(true);
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
          onCLickDate(event)
        }}
      />
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default CalendarNote;
