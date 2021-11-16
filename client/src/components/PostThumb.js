import React from "react";
import { Link } from "react-router-dom";
import { Chat, Heart } from "react-bootstrap-icons";
import SendSVG from "../images/send.svg";
import { Col, Row } from "react-bootstrap";

const PostThumb = ({ posts, result }) => {
  if (result === 0)
    return <h2 className="text-center text-danger">No Posts</h2>;

  return (
    <Row className="mt-5">
      <Col>
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <Row>
            {post.images[0].url.match(/video/i) ? (
              <video
                controls
                src={post.images[0].url}
                alt={post.images[0].url}
              />
            ) : (
              <img src={post.images[0].url} alt={post.images[0].url} />
            )}

            <Row>
              <Heart size={24} />
              {post.likes.length}
              <Chat size={24} />
              <img src={SendSVG} alt="send" />
            </Row>
          </Row>
        </Link>
      ))}
      </Col>
    </Row>
  );
};

export default PostThumb;
