import React from "react";
import { useLocation } from "react-router-dom";
import { Nav, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/auth.action";
import { GLOBAL_TYPES } from "../../redux/actions/global.types";
import Avatar from "../Avatar";
import NotificationModal from "../NotificationModal";
import {
  Bell,
  Bookmarks,
  BoxArrowRight,
  Compass,
  Envelope,
  PersonCircle,
  ToggleOff,
  ToggleOn,
} from "react-bootstrap-icons";
import {
  BellFill,
  BookmarksFill,
  CompassFill,
  EnvelopeFill,
} from "react-bootstrap-icons";

const Menu = () => {
  const { auth, theme, notification } = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  const variant = theme ? "text-light" : "text-dark";

  const selected = (pathname) => {
    if (pathname === location.pathname) return "active";
  };

  if (auth.token) {
    if (theme) {
      return (
        <Nav className="justify-content-end me-3">
          <Nav.Link onClick={() => dispatch(logout())}>
            <BoxArrowRight size={24} className={variant} />
          </Nav.Link>
          <Nav.Link href="/discover">
            <Compass size={24} className={variant} />
          </Nav.Link>
          <Nav.Link href="#">
            <Bookmarks size={24} className={variant} />
          </Nav.Link>
          <Nav.Link href="/messages">
            <Envelope size={24} className={variant} />
          </Nav.Link>
          <NavDropdown
            title={
              <>
                <Bell
                  size={24}
                  className={notification.data.length > 0 ? "text-danger" : variant}
                />
                <span className={`notification_amount position-absolute translate-middle ${variant}`}>
                  {notification.data.length}
                </span>
              </>
            }
            className="position-relative"
          >
            <NotificationModal />
          </NavDropdown>
          <Nav.Link href={`/profile/${auth.user._id}`}>
            {auth.user.avatar ? (
              <Avatar src={auth.user.avatar} size="medium-avatar" />
            ) : (
              <PersonCircle size={24} className={variant} />
            )}
          </Nav.Link>
          <Nav.Link>
            <label
              htmlFor="theme"
              onClick={() =>
                dispatch({
                  type: GLOBAL_TYPES.THEME,
                  payload: !theme,
                })
              }
            >
              <ToggleOn size={24} className={variant} />
            </label>
          </Nav.Link>
        </Nav>
      );
    } else {
      return (
        <Nav className="justify-content-end me-3">
          <Nav.Link onClick={() => dispatch(logout())}>
            <BoxArrowRight size={24} className={variant} />
          </Nav.Link>
          <Nav.Link href="/discover">
            <CompassFill size={24} className={variant} />
          </Nav.Link>
          <Nav.Link href="#">
            <BookmarksFill size={24} className={variant} />
          </Nav.Link>
          <Nav.Link href="/messages">
            <EnvelopeFill size={24} className={variant} />
          </Nav.Link>
          <NavDropdown
            title={
              <>
                <BellFill
                  size={24}
                  className={notification.data.length > 0 ? "text-danger" : variant}
                />
                <span className={`notification_amount position-absolute translate-middle text-light`}>
                  {notification.data.length}
                </span>
              </>
            }
            className="position-relative"
          >
            <NotificationModal />
          </NavDropdown>
          <Nav.Link href={`/profile/${auth.user._id}`}>
            <PersonCircle size={24} className={variant} />
          </Nav.Link>
          <Nav.Link>
            <label
              htmlFor="theme"
              onClick={() =>
                dispatch({
                  type: GLOBAL_TYPES.THEME,
                  payload: !theme,
                })
              }
            >
              <ToggleOff size={24} className={variant} />
            </label>
          </Nav.Link>
        </Nav>
      );
    }
  } else {
    return (
      <Nav className="justify-content-end me-3">
        <Nav.Link href="/" className={variant}>Login</Nav.Link>
        <Nav.Link href="/register" className={variant}>Register</Nav.Link>
        <Nav.Link>
            <label
              htmlFor="theme"
              onClick={() =>
                dispatch({
                  type: GLOBAL_TYPES.THEME,
                  payload: !theme,
                })
              }
            >
              {theme ? <ToggleOn size={24} className={variant} /> : <ToggleOff size={24} className={variant} />}
            </label>
          </Nav.Link>
      </Nav>
    );
  }
};

export default Menu;
