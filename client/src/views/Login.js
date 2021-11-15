import React, { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/auth.action";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const initialState = { username: "", password: "" };
  const [user, setUser] = useState(initialState);
  const { username, password } = user;

  const { auth } = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();

  const [hiddenPassword, setHiddenPassword] = useState(true);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login(user));

    // const { username, password } = user;

    // if (username && password) {
    //   axios
    //     .post("http://localhost:8000/api/login", user, {
    //       withCredentials: true,
    //     })
    //     .then((res) => {
    //       console.log(res.data.message);
    //       setLoggedIn(res.data.user);
    //       history.push("/");
    //     });
    // } else {
    //   console.log("not posted.. invalid input");
    // }
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
              controlId="floatingInput"
              label="Username"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="username"
                onChange={handleChange}
                value={username}
                placeholder="Username"
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="position-relative">
            <FloatingLabel
              controlId="floatingInput"
              label="Password"
              className="mb-1"
            >
              <Form.Control
                type={hiddenPassword ? "password" : "text"}
                name="password"
                onChange={handleChange}
                value={password}
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

          <Form.Group className="d-flex justify-content-center my-4">
            <Button
              type="submit"
              variant="dark"
              className="w-25"
              disabled={username && password ? false : true}
            >
              Login
            </Button>
          </Form.Group>

          <p className="my-2">
            Don't have an account? <Link to="/register">Register now</Link>
          </p>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
