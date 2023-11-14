import axios from "axios";
import Notification from "components/Notification/Notification";
import moment from "moment";
import 'moment/locale/es';
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'react-datetime/css/react-datetime.css';
import Select from 'react-select'
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

const localizer = momentLocalizer(moment);
function CalendarNote() {
  moment.locale('es');
  const [events, setEvents] = useState([]);
  const [eventsArr, setEventsArr] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalAppointment, setShowModalAppointment] = useState(false);
  const [showModalCustomer, setShowModalCustomer] = useState(false);
  const [description, setDescription] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOpenModalAppointment = () => setShowModalAppointment(true);
  const handleCloseModalAppointment = () => setShowModalAppointment(false);
  const handleOpenModalCustomer = () => setShowModalCustomer(true);
  const handleCloseModalCustomer = () => setShowModalCustomer(false);
  const [formClient, setFormClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: 'success',
  });

  const handleShowNotification = (message, variant) => {
    setNotification({ show: true, message, variant });
  };

  const handleCloseNotification = () => {
    setNotification({ show: false, message: '', variant: 'success' });
  };


  useEffect(() => {
    if (notification.show) {
      setTimeout(() => {
        setNotification(false, '', '');
      }, 3000);
    }
    // You can fetch events from an API or another data source here.
    axios
      .get("https://dolphin-app-95jtj.ondigitalocean.app/appointments")
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
  }, [notification.show]);

  function onCLickDate(event) {
    setDescription(event.notes);
    setShowModal(true);
  }

  function onClickAddAppointment() {
    getBarbers();
    getServices();
    getCustomers();
    setShowModalAppointment(true);
  }

  function getBarbers() {
    axios.get("https://dolphin-app-95jtj.ondigitalocean.app/barbers")
      .then((response) => {
        const data = response.data;
        const newArray = [];
        data.forEach((item) => {
          const newBarber = {
            value: item.barberId,
            label: item.firstName + ' ' + item.lastName,
          };
          newArray.push(newBarber);

          setBarbers(newArray);
        });
      })
  }

  function getServices() {
    axios.get("https://dolphin-app-95jtj.ondigitalocean.app/services")
      .then((response) => {
        const data = response.data;
        const newArray = [];
        data.forEach((item) => {
          const newService = {
            value: item.serviceId,
            label: item.serviceName,
          };
          newArray.push(newService);
        });

        setServices(newArray);
      })
  }

  function getCustomers() {
    axios.get("https://dolphin-app-95jtj.ondigitalocean.app/customers")
      .then((response) => {
        const data = response.data;
        const newArray = [];
        data.forEach((item) => {
          const newCustomer = {
            value: item.customerId,
            label: item.firstName + ' ' + item.lastName,
          };
          newArray.push(newCustomer);
        });

        setCustomers(newArray);

      })
  }

  function onClickAddCustomer() {
    setShowModalAppointment(false);
    setShowModalCustomer(true);
  }

  // Handler for input changes using the useState hook
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Using the functional form of state update
    setFormClient((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };







  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    axios.post("https://dolphin-app-95jtj.ondigitalocean.app/customer", formClient)
      .then((respone) => {
        setShowModalCustomer(false);
        getCustomers();
        setShowModalAppointment(true);
        handleShowNotification("Se guardo cliente", 'success');
      })
    console.log('Form submitted:', formClient);
  };

  const handleSubmitAppointment = (e) => {
    e.preventDefault();
    const date = e.target.date.value;
    const time = e.target.time.value;
    const barberId = e.target.barberId.value;
    const serviceId = e.target.serviceId.value;
    const customerId = e.target.customerId.value;
    const dateTimeString = `${date} ${convert12HourTo24Hour(time)}`;

    const body = {
      barberId: barberId,
      customerId: customerId,
      serviceId: serviceId,
      date: dateTimeString,
    }

    e.preventDefault();
    // Handle form submission logic here
    axios.post("https://dolphin-app-95jtj.ondigitalocean.app/appointment", body)
      .then((respone) => {
        setShowModalAppointment(false);
        getBarbers();
        handleShowNotification('Se guardo cita', 'success');
      })
  };


  function convert12HourTo24Hour(time12HourFormat) {
    const [time, period] = time12HourFormat.split(' ');
    const [hours, minutes] = time.split(':');

    let convertedHours = parseInt(hours, 10);
    if (period === 'PM' && convertedHours !== 12) {
      convertedHours += 12;
    } else if (period === 'AM' && convertedHours === 12) {
      convertedHours = 0;
    }

    return `${convertedHours.toString().padStart(2, '0')}:${minutes}`;
  }




  return (
    <div>
      {notification.show && (
        <Notification
          message={notification.message}
          variant={notification.variant}
          onClose={handleCloseNotification}
        />
      )}
      <div style={{ textAlign: 'end' }}>
        <Button style={{ backgroundColor: '#3174ad' }} onClick={onClickAddAppointment}>Agregar cita</Button>{' '}
      </div>
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
      <Modal show={showModal} onHide={handleCloseModal} >
        <Modal.Header >
          <Modal.Title>Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Eliminar
          </Button>
          <Button variant="success" onClick={handleCloseModal}>
            Editar
          </Button>
          <Button style={{ backgroundColor: '#3174ad' }} onClick={handleCloseModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalAppointment} onHide={handleCloseModalAppointment} size="xl">
        <Modal.Header >
          <Modal.Title>Agendar cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAppointment}>
            <Row>
              <Col md="12">
                <Label hidden>Cliente</Label>
                <FormGroup>
                  <Label for="exampleSelect">Cliente</Label>

                  <Select placeholder="Elige cleinte" options={customers} name="customerId" />
                  <Button style={{ backgroundColor: '#3174ad' }} onClick={onClickAddCustomer}>Nuevo cliente</Button>{' '}
                </FormGroup>
              </Col>

            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label for="exampleSelect">Barbero</Label>

                  <Select placeholder="Elige barbero" options={barbers} name="barberId" />
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="exampleSelect">Tipo de servicio</Label>

                  <Select placeholder="Elige servicio" options={services} name="serviceId" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Dia</Label>
                  <Input type="date" name="date" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Hora</Label>
                  <Input type="time" name="time" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <div className="update ml-auto mr-auto">
                <Button onClick={handleCloseModalAppointment}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Guardar cita
                </Button>
              </div>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>

      <Modal show={showModalCustomer} onHide={handleCloseModalCustomer} size="xl">
        <Modal.Header >
          <Modal.Title>Agregar cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Nombre</label>
                  <Input
                    placeholder="Nombre"
                    type="text"
                    name="firstName"
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col className="pr-1" md="6">
                <FormGroup>
                  <label>Appellido</label>
                  <Input
                    placeholder="Apellido"
                    type="text"
                    name="lastName"
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <label>Direccion</label>
                  <Input
                    placeholder="Direccion"
                    type="text"
                    name="address"
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col className="pr-1" md="4">
                <FormGroup>
                  <label>Telefono</label>
                  <Input
                    placeholder="Telefono"
                    type="text"
                    name="phone"
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col className="pr-1" md="4">
                <FormGroup>
                  <label>Email</label>
                  <Input
                    placeholder="email"
                    type="text"
                    name="email"
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <div className="update ml-auto mr-auto">
                <Button onClick={handleCloseModalCustomer}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  style={{ backgroundColor: '#3174ad' }}
                  type="submit"
                >
                  Guardar cliente
                </Button>
              </div>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default CalendarNote;
