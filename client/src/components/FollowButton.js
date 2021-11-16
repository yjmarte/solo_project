import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { follow, unfollow } from "../redux/actions/profile.action";
import { Button } from "react-bootstrap";

const FollowButton = ({ user }) => {
  const [followed, setFollowed] = useState(false);

  const { auth, profile, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setFollowed(true);
    }

    return () => setFollowed(false);
  }, [auth.user.following, user._id]);

  const handleFollow = async () => {
    if (load) return;

    setFollowed(true);
    setLoad(true);
    await dispatch(follow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  const handleUnfollow = async () => {
    if (load) return;

    setFollowed(false);
    setLoad(true);
    await dispatch(unfollow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  return (
    <>
      {followed ? (
        <Button variant="" className="btn-outline-danger" onClick={handleUnfollow}>
          Unfollow
        </Button>
      ) : (
        <Button variant="" className="btn-outline-info" onClick={handleFollow}>
          Follow
        </Button>
      )}
    </>
  );
};

export default FollowButton;
