import React from "react";
import { Heart, HeartFill } from "react-bootstrap-icons";

const LikeButton = ({ isLike, handleLike, handleUnlike }) => {
  return (
    <>
      {isLike ? (
        <HeartFill className="text-danger" onClick={handleUnlike} />
      ) : (
        <Heart onClick={handleLike} />
      )}
    </>
  );
};

export default LikeButton;
