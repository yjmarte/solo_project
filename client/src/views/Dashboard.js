import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";

import Status from '../components/dashboard/Status'
import Posts from '../components/dashboard/Posts'
import SideBar from '../components/dashboard/SideBar'

import LoadingIcon from "../images/loading.gif";

let scroll = 0;

const Dashboard = () => {
  const { dashboardPosts } = useSelector((state) => state);

  window.addEventListener("scroll", () => {
    if (window.location.pathname === "/") {
      scroll = window.pageYOffset;
      return scroll;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: scroll, behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <Row className="mx-0 dashboard">
      <Col md={{ span: 8 }}>
        <Status />

        {
          dashboardPosts.loading ? <img src={LoadingIcon} alt="loading" className="d-block mx-auto" /> : (dashboardPosts.result === 0 && dashboardPosts.posts.length === 0) ? <h2 className="text-center mt-5">No Posts</h2> : <Posts />
        }
        </Col>
      <Col md={{ span: 4 }}>
        <SideBar />
      </Col>
    </Row>
  );
};

export default Dashboard;
