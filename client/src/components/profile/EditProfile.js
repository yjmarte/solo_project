import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkImage } from "../../redux/utilities/upload.image";
import { GLOBAL_TYPES } from "../../redux/actions/global.types";
import { updateProfileUser } from "../../redux/actions/profile.action";
import { toast } from "react-toastify";
import { Button, Col, Form, Modal } from "react-bootstrap";
import avatarSVG from "../../images/person-circle.svg";

const EditProfile = ({ setOnEdit }) => {
  const initialState = {
    name: "",
    bio: "",
  };
  const [userData, setUserData] = useState(initialState);
  const { name, bio } = userData;

  const [avatar, setAvatar] = useState("");

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(auth.user);
  }, [auth.user]);

  const avatarSwitch = auth.user.avatar ? auth.user.avatar : avatarSVG;
  const changeAvatar = (e) => {
    const file = e.target.files[0];

    const err = checkImage(file);
    if (err)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.message) },
      });

    setAvatar(file);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileUser({userData, avatar, auth}));
  };

  return (
    <Modal show={setOnEdit}>
      <Modal.Header closeButton onHide={() => setOnEdit(false)}>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="position-relative my-5 py-5">
            <Col
              lg={{ span: 4, offset: 4 }}
              className="d-flex-column align-items-center justify-content-center"
            >
              <img
                src={avatar ? URL.createObjectURL(avatar) : avatarSwitch}
                alt="avatar"
                className="huge-avatar position-absolute top-50 start-50 translate-middle"
              />
                <Form.Control
                  type="file"
                  name="file"
                  id="file_up"
                  accept="image/*"
                  onChange={changeAvatar}
                  className="position-absolute top-50 start-0 w-100 h-100 opacity-0 py-5"
                />
            </Col>
          </Form.Group>

          <Form.Group className="mt-5">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={handleInput}
            />
            <small className={ name.length > 30 ? "text-danger" : "text-success"}>
              {name.length} / 30
            </small>
          </Form.Group>

          <Form.Group className="mt-5">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              value={bio}
              onChange={handleInput}
            />
            <small className={ bio.length > 150 ? "text-danger" : "text-success"}>
              {bio.length} / 150
            </small>
          </Form.Group>
          <Form.Group className="mt-5">
          <Button variant="secondary" className="w-100" type="submit">
            Post
          </Button>
        </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfile;
