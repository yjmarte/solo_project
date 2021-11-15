import React from "react";
import Avatar from "../Avatar";
import { useDispatch, useSelector } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/global.types";
import { Button, Stack } from "react-bootstrap";
import avatarSVG from '../../images/person-circle.svg'

const Status = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  
  const avatar = auth.user.avatar ? auth.user.avatar : avatarSVG

  return (
    <Stack direction="horizontal" gap={5} className="mt-3 mx-5 status shadow">
      <Avatar src={avatar} classes="big-avatar ms-5"/>

      <Button
        className="flex-fill statusBtn me-5 ps-4"
        onClick={() => dispatch({ type: GLOBAL_TYPES.STATUS, payload: true })}
      >
        Post something...
      </Button>
    </Stack>
  );
};

export default Status;
