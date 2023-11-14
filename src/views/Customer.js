

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


export default function Customer() {
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalCustomer, setShowModalCustomer] = useState(false);
    const [id, setId] = useState();

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleOpenModalCustomer = () => setShowModalCustomer(true);
    const handleCloseModalCustomer = () => setShowModalCustomer(false);

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


    const [formClient, setFormClient] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        getCustomers();
        if (notification.show) {
            setTimeout(() => {
                setNotification(false, '', '');
            }, 3000);
        }
    }, [notification.show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let message = 'Cliente agregado';
        if (formClient.customerId != null) {
            message = 'Se actualizaron datos de cliente';
        }
        // Handle form submission logic here
        axios.post("https://dolphin-app-95jtj.ondigitalocean.app/customer", formClient)
            .then(() => {
                setShowModalCustomer(false);
                handleShowNotification(message, 'success');
                getCustomers();
            })
            .catch((error) => {
                handleShowNotification('Error: ' + error, 'danger');
            })
        console.log('Form submitted:', formClient);
    };

    function getCustomers() {
        axios.get("https://dolphin-app-95jtj.ondigitalocean.app/customers")
            .then((response) => {
                setCustomers(response.data);
            })
    }

    const customHeaders = ['ID', 'Nombre', 'Apellido', 'Correo', 'Telefono', 'Direccion', 'Fecha nacimiento'];

    const handleEdit = (rowData) => {
        setFormClient({
            customerId: rowData.customerId,
            firstName: rowData.firstName,
            lastName: rowData.lastName,
            email: rowData.email,
            phone: rowData.phone,
            address: rowData.address,
        });
        setShowModalCustomer(true);
    };

    const handleDelete = (rowData) => {
        // Implement your delete logic here
        setId(rowData.customerId);
        setShowModal(true);
    };

    const handleDeleteCustomer = () => {
        axios.delete("https://dolphin-app-95jtj.ondigitalocean.app/customer/" + id)
            .then(() => {
                setShowModal(false);
                getCustomers();
                handleShowNotification('Cliente eliminado', 'success');
            })
            .catch((error) => {
                handleShowNotification('Error: ' + error, 'danger');
            })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Using the functional form of state update
        setFormClient((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const openAddModal = (() => {
        setFormClient({
            customerId: null,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
        });
        setShowModalCustomer(true);
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
                                <TableCustom data={customers} headers={customHeaders} onEdit={handleEdit} onDelete={handleDelete} />
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
                        <span>¿Estas seguro de eliminar cliente?</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: '#3174ad' }} onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button style={{ backgroundColor: 'red' }} onClick={handleDeleteCustomer}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showModalCustomer} onHide={handleCloseModalCustomer} size="xl">
                    <Modal.Header >
                        <Modal.Title>Agregar cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md="10">
                                    <FormGroup>
                                        <Input name="customerId" hidden value={formClient.customerId} />
                                        <label>Nombre</label>
                                        <Input
                                            placeholder="Nombre"
                                            type="text"
                                            name="firstName"
                                            value={formClient.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-1" md="6">
                                    <FormGroup>
                                        <label>Appellido</label>
                                        <Input
                                            value={formClient.lastName}
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
                                            value={formClient.address}
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
                                            value={formClient.phone}
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
                                            value={formClient.email}
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
                                        onClick={handleCloseModalCustomer}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
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
        </>
    )
}