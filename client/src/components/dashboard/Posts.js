import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../PostCard";
import { Row } from "react-bootstrap";

import LoadingIcon from "../../images/loading.gif";
import LoadMore from "../LoadMoreButton";
import { getAPI } from "../../redux/utilities/fetch.api";
import { POST_TYPES } from "../../redux/actions/post.action";

const Posts = () => {
  const { dashboardPosts, auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);

    const response = await getAPI(
      `posts?limit=${dashboardPosts.page * 9}`,
      auth.token
    );

    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: {
        ...response.data,
        page: dashboardPosts.page + 1,
      },
    });

    setLoad(false)
  };
  return <Row className="">
      {
          dashboardPosts.posts.map(post => (
              <PostCard key={post.id} post={post} theme={theme} />
          ))
      }

      {
          load && <img src={LoadingIcon} alt="loading" className="d-block mx-auto" />
      }

      <LoadMore result={dashboardPosts.result} page={dashboardPosts.page} load={load} handleLoadMore={handleLoadMore} />
  </Row>;
};

export default Posts;
