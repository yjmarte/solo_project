import React, { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/actions/auth.action";

const Registration = () => {
  const { auth, alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);

  useEffect(() => {
    if (auth.token) history.push("/");
  }, [auth.token, history]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(register(user));
  };
  return (
    <Row className="mt-5">
      <Col
        xs={{ span: 4, offset: 4 }}
        md={{ span: 4, offset: 4 }}
        lg={{ span: 4, offset: 4 }}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <FloatingLabel
              controlId="floatingFullName"
              label="Full Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="name"
                onChange={handleChange}
                value={user.name}
                placeholder="Full Name"
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group>
            <small className="form-text text-danger">
              {alert.name ? alert.name : ""}
            </small>
          </Form.Group>

          <Form.Group>
            <FloatingLabel
              controlId="floatingInput"
              label="Username"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="username"
                onChange={handleChange}
                value={user.username}
                placeholder="Username"
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="position-relative mb-3">
            <FloatingLabel
              controlId="floatingInput"
              label="Password"
              className="mb-1"
            >
              <Form.Control
                type={hiddenPassword ? "password" : "text"}
                name="password"
                onChange={handleChange}
                value={user.password}
                placeholder="Password"
              />
            </FloatingLabel>

            <small
              onClick={() => setHiddenPassword(!hiddenPassword)}
              className="position-absolute top-50 end-0 translate-middle opacity-75 text-dark"
            >
              {hiddenPassword ? "Show" : "Hide"}
            </small>
          </Form.Group>

          <Form.Group className="position-relative">
            <FloatingLabel
              controlId="floatingInput"
              label="Confirm Password"
              className="mb-1"
            >
              <Form.Control
                type={hiddenConfirmPassword ? "password" : "text"}
                name="confirmPassword"
                onChange={handleChange}
                value={user.confirmPassword}
                placeholder="Confirm Password"
              />
            </FloatingLabel>

            <small
              onClick={() => setHiddenConfirmPassword(!hiddenConfirmPassword)}
              className="position-absolute top-50 end-0 translate-middle opacity-75 text-dark"
            >
              {hiddenConfirmPassword ? "Show" : "Hide"}
            </small>
          </Form.Group>

          <Form.Group className="d-flex justify-content-center my-4">
            <Button
              type="submit"
              variant="dark"
              className="w-25"
              disabled={
                user.name &&
                user.username &&
                user.password &&
                user.password === user.confirmPassword
                  ? false
                  : true
              }
            >
              Register
            </Button>
          </Form.Group>

          <p className="my-2">
            Have an account? <Link to="/">Login here</Link>
          </p>
        </Form>
      </Col>
    </Row>
  );
};

export default Registration;
