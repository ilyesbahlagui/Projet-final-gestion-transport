import { CSSProperties, ReactNode } from "react";
import { Logo } from "./logo";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AppContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export interface NavRoute {
  path: string;
  element: ReactNode;
}

interface NavMenuProps {
  onLogout: () => void;
}

const routesPerArea = new Map<string, NavRoute[]>([
  [
    "collaborateur",
    [
      { path: "/collaborateur/reservations", element: "Vos réservations" },
      { path: "/collaborateur/annonces", element: "Vos annonces" },
      { path: "/collaborateur/statistiques", element: "Statistiques" },
    ],
  ],
  [
    "chauffeur",
    [
      { path: "/chauffeur/planning", element: "Planning" },
      { path: "/chauffeur/occupation", element: "Occupation" },
    ],
  ],
  [
    "admin",
    [
      { path: "/admin/chauffeurs", element: "Chauffeurs" },
      { path: "/admin/vehicules", element: "Véhicules" },
    ],
  ],
]);

export const NavMenu = (props: NavMenuProps) => {
  const location = useLocation();
  const area = location.pathname.split("/")[1];
  const routes = routesPerArea.get(area) ?? [];

  const employe = AppContext.services.authentication.employe;
  const nom = employe?.lastName || "";
  const prenom = employe?.firstName || "";

  // STYLE CSS
  const linkStyle: CSSProperties = {
    margin: "1rem",
    textDecoration: "none",
    color: "black",
  };

  return (
    <Navbar bg="light" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <Link to="/">
            <Logo maxHeight="50px"/>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {routes.map(route => (
              <Link key={route.path} style={linkStyle} to={route.path}>
                {route.element}
              </Link>
            ))}
          </Nav>
          <Navbar.Collapse className="d-flex  justify-content-end col-4">
            <Nav className="me-4">
              <Navbar.Text>
                <FontAwesomeIcon icon={faUser} className="me-2" /> {"Bonjour,"} {nom}{" "}
                {prenom}
              </Navbar.Text>
            </Nav>
            <Button variant="danger" onClick={props.onLogout}>
              Se déconnecter
            </Button>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
