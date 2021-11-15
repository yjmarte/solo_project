import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";

import Menu from "./Menu";

const Navigation = () => {
  const { theme } = useSelector((state) => state);
  const variant = theme ? "dark" : "light";
  const text = theme ? "text-light" : "text-dark";
  return (
    <Navbar bg={variant} variant={variant} expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" className="ms-4">
          <strong
            className={`text-uppercase ${text}`}
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Inract
          </strong>
        </Navbar.Brand>

        {/* <Search /> */}

        <Menu />
      </Container>
    </Navbar>
  );
};

export default Navigation;
