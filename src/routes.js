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
import Barber from "views/Barber";
import Customer from "views/Customer";
import Dashboard from "views/Dashboard.js";
import Payment from "views/Payment";
import Service from "views/Service";

var routes = [
  {
    path: "/dashboard",
    name: "Home",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/customer",
    name: "Clientes",
    icon: "nc-icon nc-single-02",
    component: <Customer />,
    layout: "/admin",
  },
  {
    path: "/barber",
    name: "Barberos",
    icon: "nc-icon nc-scissors",
    component: <Barber />,
    layout: "/admin",
  },
  {
    path: "/service",
    name: "Servicios",
    icon: "nc-icon nc-bullet-list-67",
    component: <Service />,
    layout: "/admin",
  },
  {
    path: "/payment",
    name: "Pagos",
    icon: "nc-icon nc-credit-card",
    component: <Payment />,
    layout: "/admin",
  }
];
export default routes;
