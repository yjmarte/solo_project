import React, { useEffect, useState } from "react";

import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import Saved from "../../components/profile/Saved";

import { useDispatch, useSelector } from "react-redux";
import LoadingIcon from "../../images/loading.gif";
import { getProfileUsers } from "../../redux/actions/profile.action";
import { useParams } from "react-router-dom";
import { Button, Nav, Row } from "react-bootstrap";

const Profile = () => {
  const { profile, auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [saveTab, setSaveTab] = useState(false);

  useEffect(() => {
    if (profile.ids.every((item) => item !== id)) {
      dispatch(getProfileUsers({ id, auth }));
    }
  }, [id, auth, dispatch, profile.ids]);

  return (
    <Row>
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

      {auth.user._id === id && (
        <Row>
            <Nav variant="pills" className="justify-content-center" defaultActiveKey="0">
                <Nav.Item>
                    <Nav.Link eventKey="0" onClick={() => setSaveTab(false)}>Posts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="1" onClick={() => setSaveTab(true)}>Saved</Nav.Link>
                </Nav.Item>
            </Nav>
        </Row>
      )}

      {profile.loading ? (
        <img src={LoadingIcon} className="d-block mx-auto" alt="loading" />
      ) : (
        <Row className="my-4">
          {saveTab ? (
            <Saved auth={auth} dispatch={dispatch} />
          ) : (
            <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
          )}
        </Row>
      )}
    </Row>
  );
};

export default Profile;
