import React, { useEffect, useState } from "react";
import Avatar from "../Avatar";
import EditProfile from "./EditProfile";
import FollowButton from "../FollowButton";
import Followers from "./Followers";
import Following from "./Following";
import { GLOBAL_TYPES } from "../../redux/actions/global.types";
import { Button, Col, Row } from "react-bootstrap";
import avatarSVG from "../../images/person-circle.svg";

const Info = ({ auth, dispatch, id, profile }) => {
  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const avatar = auth.user.avatar ? auth.user.avatar : avatarSVG;

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
  }, [auth, dispatch, id, profile.users]);

  useEffect(() => {
    if (showFollowers || showFollowing || onEdit) {
      dispatch({ type: GLOBAL_TYPES.MODAL, payload: true });
    } else {
      dispatch({ type: GLOBAL_TYPES.MODAL, payload: false });
    }
  }, [showFollowers, showFollowing, onEdit, dispatch]);

  return (
    <Row className="d-flex mt-5">
      {userData.map((user) => (
        <Row key={user._id} className="d-flex-inline">
          <Col
            lg={{ span: 1, offset: 2 }}
            className="d-flex align-items-center"
          >
            <Avatar src={avatar} classes="huge-avatar" />
          </Col>

          <Col lg={{ span: 5, offset: 1 }}>
            <h2>{user.name}</h2>

            <Row className="mt-3">
              <Col lg={{ span: 2, offset: 1 }}>
                <span
                  onClick={() => setShowFollowers(true)}
                  className="text-primary"
                >
                  <strong>{user.followers.length}</strong> Followers
                </span>
              </Col>

              <Col lg={{ span: 3, offset: 2 }}>
                <span
                  onClick={() => setShowFollowing(true)}
                  className="text-primary"
                >
                  <strong>{user.following.length}</strong> Following
                </span>
              </Col>
            </Row>
          </Col>

          <Col>
            {user._id === auth.user._id ? (
              <Button
                onClick={() => setOnEdit(true)}
                variant="dark"
                className="w-25"
              >
                Edit Profile
              </Button>
            ) : (
              <FollowButton user={user} />
            )}
          </Col>

          <Row className="mt-4">
            <Col lg={{ span: 6, offset: 2 }}>
              <h6>{user.name}</h6>
              <p>{user.bio}</p>
            </Col>
          </Row>

          {onEdit && <EditProfile setOnEdit={setOnEdit} />}

          {showFollowers && (
            <Followers
              users={user.followers}
              setShowFollowers={setShowFollowers}
            />
          )}

          {showFollowing && (
            <Following
              users={user.following}
              setShowFollowing={setShowFollowing}
            />
          )}
        </Row>
      ))}
    </Row>
  );
};

export default Info;
