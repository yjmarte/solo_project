import React, { useEffect, useState } from "react";
import { Button, Card, Carousel, Col } from "react-bootstrap";

import Avatar from "./Avatar";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { GLOBAL_TYPES } from "../redux/actions/global.types";
import { deletePost } from "../redux/actions/post.action";
import { BASE_URL } from "../redux/utilities/config";
import avatarSVG from "../images/person-circle.svg";

import LikeButton from './LikeButton'
import { likePost, unlikePost, savePost, unsavePost } from "../redux/actions/post.action";
import { Bookmark, BookmarkFill } from "react-bootstrap-icons";

const PostCard = ({ post, theme }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [readMore, setReadMore] = useState(false);

  const history = useHistory();

  const avatar = post.user.avatar ? post.user.avatar : avatarSVG;

  const [isLike, setIsLike] = useState(false)
  const [loadLike, setLoadLike] = useState(false)

  const [isShare, setIsShare] = useState(false)

  const [saved, setSaved] = useState(false)
  const [saveLoad, setSaveLoad] = useState(false)

  // Likes
  useEffect(() => {
    if(post.likes.find(like => like._id === auth.user._id)) {
      setIsLike(true)
    } else {
      setIsLike(false)
    }
  }, [post.likes, auth.user._id])

  const handleLike = async () => {
    if (loadLike) return;

    setLoadLike(true)
    await dispatch(likePost({ post, auth, socket }))
    setLoadLike(false)
  }

  const handleUnlike = async () => {
    if (loadLike) return;

    setLoadLike(true)
    await dispatch(unlikePost({ post, auth, socket }))
    setLoadLike(false)
  }

  useEffect(() => {
    if(auth.user.saved.find(id => id === post._id)) {
      setSaved(true)
    } else {
      setSaved(false)
    }
  }, auth.user.saved, post._id)

  const handleSavePost = async () => {
    if (saveLoad) return;

    setSaveLoad(true);
    await dispatch(savePost({ post, auth }))
    setSaveLoad(false)
  }

  const handleUnsavePost = async () => {
    if (saveLoad) return;

    setSaveLoad(true);
    await dispatch(unsavePost({ post, auth }))
    setSaveLoad(false)
  }

  const handleEditPost = () => {
    dispatch({ type: GLOBAL_TYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost({ post, auth, socket }));
      return history.push("/");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
  };

  return (
    <Card className="mx-5 mt-5">
      <Card.Header className="d-flex">
        <Col lg={{ span: 1}}>
          <Avatar src={avatar} classes="big-avatar" />
        </Col>

        <Col lg={{ span: 4}} className="ps-4">
          <Link to={`/profile/${post.user._id}`} className="text-dark">
            {post.user.username}
          </Link>
        </Col>
        <Col lg={{ span: 3 }} className="d-flex justify-content-end">
          <small className="text-muted">
            {moment(post.createdAt).fromNow()}
          </small>
        </Col>

        {auth.user._id === post.user._id && <Col className="d-flex justify-content-evenly">
            <Button variant="warning" size="sm" onClick={handleEditPost} className="w-25">Edit</Button>
            <Button variant="danger" size="sm" onClick={handleDeletePost} className="w-auto">Delete</Button>
        </Col>}
      </Card.Header>
      
      <Card.Body>
              {
                  post.images.length > 0 && <Carousel>
                      {post.images.map((img, index) => (
                        <Carousel.Item>
                          {
                              img.url.match(/video/i)
                              ? <video controls src={img.url} className="" />
                              : <img src={img.url} className="w-100" alt={img.url} />
                          }
                          </Carousel.Item>
                      ))}
                      
                  </Carousel>
              }
        <Card.Text className="mt-3 ps-3">
            { post.content.length < 60 ? post.content : readMore ? post.content + " " : post.content.slice(0, 60) + "..."}
        </Card.Text>
        {
            post.content.length > 60 && <Card.Text className="readMore" onClick={() => setReadMore(!readMore)}>
                { readMore ? "Hide content" : "Read more"}
            </Card.Text>
                
        }
      </Card.Body>
      <Card.Footer className="d-flex">
        <LikeButton isLike={isLike} handleLike={handleLike} handleUnlike={handleUnlike} />

        {
          saved ? <BookmarkFill className="text-danger" onClick={handleUnsavePost} /> : <Bookmark onClick={handleSavePost} />
        }
      </Card.Footer>
    </Card>
  );
};

export default PostCard;
