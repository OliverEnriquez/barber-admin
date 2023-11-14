
import TableCustom from "components/table/TableCustom";
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import axios from "axios";
import { Button, Modal } from 'react-bootstrap';
import Notification from "components/Notification/Notification";

export default function Barber() {
    const [barbers, setBarbers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalBarber, setShowModalBarber] = useState(false);
    const [id, setId] = useState();

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleOpenModalBarber = () => setShowModalBarber(true);
    const handleCloseModalBarber = () => setShowModalBarber(false);

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


    const [formBarber, setFormBarber] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        getBarbers();
        if (notification.show) {
            setTimeout(() => {
                setNotification(false, '', '');
            }, 3000);
        }
    }, [notification.show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let message = 'Barbero agregado';
        if (formBarber.barberId != null) {
            message = 'Se actualizaron datos de barbero';
        }
        // Handle form submission logic here
        axios.post("https://dolphin-app-95jtj.ondigitalocean.app/barber", formBarber)
            .then(() => {
                setShowModalBarber(false);
                handleShowNotification(message, 'success');
                getBarbers();
            })
            .catch((error) => {
                setShowModalBarber(false);
                handleShowNotification("Error: " + error, 'danger');
            })
        console.log('Form submitted:', formBarber);
    };

    function getBarbers() {
        axios.get("https://dolphin-app-95jtj.ondigitalocean.app/barbers")
            .then((response) => {
                setBarbers(response.data);
            })
    }

    const customHeaders = ['ID', 'Nombre', 'Apellido', 'Correo', 'Telefono', 'Direccion'];

    const handleEdit = (rowData) => {
        setFormBarber({
            barberId: rowData.barberId,
            firstName: rowData.firstName,
            lastName: rowData.lastName,
            email: rowData.email,
            phone: rowData.phone,
            address: rowData.address,
        });
        setShowModalBarber(true);
    };

    const handleDelete = (rowData) => {
        // Implement your delete logic here
        setId(rowData.barberId);
        setShowModal(true);
    };

    const handleDeleteBarber = () => {
        axios.delete("https://dolphin-app-95jtj.ondigitalocean.app/barber/" + id)
            .then(() => {
                setShowModal(false);
                getBarbers();
                handleShowNotification('Barbero eliminado', 'success');
            })
            .catch((error) => {
                handleShowNotification('Error: ' + error, 'danger');
            })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Using the functional form of state update
        setFormBarber((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const openAddModal = (() => {
        setFormBarber({
            barberId: null,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
        });
        setShowModalBarber(true);
    })


    return (
        <>
            <div className="content">
                {notification.show && (
                    <Notification
                        message={notification.message}
                        variant={notification.variant}
                        onClose={handleCloseNotification}
                    />
                )}
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h5">Clientes</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div style={{ textAlign: 'end' }}>
                                    <Button style={{ backgroundColor: '#3174ad' }} onClick={openAddModal}>Agregar cliente</Button>{' '}
                                </div>
                                <TableCustom data={barbers} headers={customHeaders} onEdit={handleEdit} onDelete={handleDelete} />
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">

                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header >
                        <Modal.Title>Eliminar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span>¿Estas seguro de eliminar barbero?</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: '#3174ad' }} onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button style={{ backgroundColor: 'red' }} onClick={handleDeleteBarber}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showModalBarber} onHide={handleCloseModalBarber} size="xl">
                    <Modal.Header >
                        <Modal.Title>Agendar cita</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md="10">
                                    <FormGroup>
                                        <Input name="barberId" hidden value={formBarber.barberId} />
                                        <label>Nombre</label>
                                        <Input
                                            placeholder="Nombre"
                                            type="text"
                                            name="firstName"
                                            value={formBarber.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-1" md="6">
                                    <FormGroup>
                                        <label>Appellido</label>
                                        <Input
                                            value={formBarber.lastName}
                                            placeholder="Apellido"
                                            type="text"
                                            name="lastName"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="4">
                                    <FormGroup>
                                        <label>Direccion</label>
                                        <Input
                                            value={formBarber.address}
                                            placeholder="Direccion"
                                            type="text"
                                            name="address"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-1" md="4">
                                    <FormGroup>
                                        <label>Telefono</label>
                                        <Input
                                            value={formBarber.phone}
                                            placeholder="Telefono"
                                            type="text"
                                            name="phone"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-1" md="4">
                                    <FormGroup>
                                        <label>Email</label>
                                        <Input
                                            value={formBarber.email}
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
                                    <Button
                                        variant="secondary"
                                        onClick={handleCloseModalBarber}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                    >
                                        Guardar Barbero
                                    </Button>
                                </div>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}