import React from "react";
import UserCard from "../UserCard";
import FollowButton from "../FollowButton";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";

const Followers = ({ users, setShowFollowers }) => {
  const { auth } = useSelector((state) => state);

  return (
    <Modal>
      <Modal.Header closeButton onHide={() => setShowFollowers(false)}>
        <h5>Followers</h5>
      </Modal.Header>

      <hr />

      <Modal.Body>
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            setShowFollowers={setShowFollowers}
          >
            {auth.user._id !== user._id && <FollowButton user={user} />}
          </UserCard>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default Followers;
