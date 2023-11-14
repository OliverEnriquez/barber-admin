/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import axios from "axios";
import Calendar from "components/calendar/CalendarNote";
import { useEffect, useState } from "react";
// react plugin used to create charts
// reactstrap components
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
// core components

function Dashboard() {

  const [countAppointment, setCountAppointment] = useState(0);
  const [countCustomers, setCountCustomer] = useState(0);
  const [countBarbers, setBarbers] = useState(0);

  useEffect(() => {
    getAppointments();
    getCustomers();
    getBarbers();

  })

  function getAppointments() {
    axios.get("https://sea-turtle-app-ocnii.ondigitalocean.app/appointments")
      .then((response) => {
        setCountAppointment(response.data.length);
      })
  }

  function getBarbers() {
    axios.get("https://sea-turtle-app-ocnii.ondigitalocean.app/barbers")
      .then((response) => {
        setBarbers(response.data.length);
      })
  }

  function getCustomers() {
    axios.get("https://sea-turtle-app-ocnii.ondigitalocean.app/customers")
      .then((response) => {
        setCountCustomer(response.data.length);
      })
  }
  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-calendar-60 text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Citas</p>
                      <CardTitle tag="p">{countAppointment}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  {/* <i className="fas fa-sync-alt" /> Update Now */}
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-02 text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Clientes</p>
                      <CardTitle tag="p">{countCustomers}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  {/* <i className="far fa-calendar" /> Last day */}
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-scissors text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Barberos</p>
                      <CardTitle tag="p">{countBarbers}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  {/* <i className="far fa-clock" /> In the last hour */}
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <CardTitle tag="p">+45K</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Calendario</CardTitle>
              </CardHeader>
              <CardBody>
                <Calendar />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">

                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
