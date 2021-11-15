import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { GLOBAL_TYPES } from "../redux/actions/global.types";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../redux/actions/post.action";
import { toast } from "react-toastify";
import { showImage, showVideo } from "../redux/utilities/show.media";
import Icons from "./Icons";
import { Camera, CameraFill, Image, ImageFill } from "react-bootstrap-icons";

const StatusModal = () => {
  const { auth, theme, status, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const [stream, setStream] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const [tracks, setTracks] = useState("");

  const handleChange = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");

      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video is too large. (5mb)");
      }

      return newImages.push(file);
    });

    if (err)
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err) },
      });
    setImages([...images, ...newImages]);
  };

  const deleteImages = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleStream = () => {
    setStream(true);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();

          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    canvasRef.current.setAttribute("width", width);
    canvasRef.current.setAttribute("height", height);

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = canvasRef.current.toDataURL();
    setImages([...images, { camera: URL }]);
  };

  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (images.length === 0)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error("Please add a photo.") },
      });

    if (status.onEdit) {
      dispatch(updatePost({ content, images, auth, status }));
    } else {
      dispatch(createPost({ content, images, auth, socket }));
    }

    setContent("");
    setImages([]);
    if (tracks) tracks.stop();
    dispatch({ type: GLOBAL_TYPES.STATUS, payload: false });
  };

  useEffect(() => {
    if (status.onEdit) {
      setContent(status.content);
      setImages(status.images);
    }
  }, [status]);
  return (
    <Modal show={status}>
      <Modal.Header
        closeButton
        onHide={() => dispatch({ type: GLOBAL_TYPES.STATUS, payload: false })}
      >
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            name="content"
            as="textarea"
            placeholder="Post something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {/* <Row className="d-flex justify-content-end">
            <Icons setContent={setContent} content={content} theme={theme} />
          </Row> */}
          <Row className="show_images">
            {images.map((image, index) => (
              <Row key={index} id="file_img">
                {image.camera ? (
                  showImage(image.camera, theme)
                ) : image.url ? (
                  <>
                    {image.url.match(/video/i)
                      ? showVideo(image.url, theme)
                      : showImage(image.url, theme)}
                  </>
                ) : (
                  <>
                    {image.type.match(/video/i)
                      ? showVideo(URL.createObjectURL(image), theme)
                      : showImage(URL.createObjectURL(image), theme)}
                  </>
                )}
                <span onClick={() => deleteImages(index)}>&times;</span>
              </Row>
            ))}
          </Row>

          <Row className="text-center align-items-center g-0 mt-2">
            <Col lg={{ span: 4 }} className="align-items-center">
              {theme ? (
                <Image size={36} color="text-white-50" className="my-2" />
              ) : (
                <ImageFill size={36} color="text-black-50" className="my-2" />
              )}
            </Col>

            <Col lg={{ span: 8 }}>
              <Form.Control
                type="file"
                name="file"
                id="file"
                multiple
                accept="image/*,video/*"
                onChange={handleChange}
                size="sm"
                className="flex-fill"
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="status_footer">
        <Button variant="secondary" className="w-100" type="submit">
          Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusModal;
