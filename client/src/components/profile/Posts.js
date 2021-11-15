import React, { useEffect, useState } from "react";
import PostThumb from "../PostThumb";
import LoadingIcon from "../../images/loading.gif";
import { PROFILE_TYPES } from "../../redux/actions/profile.action";
import { getAPI } from "../../redux/utilities/fetch.api";
import LoadMoreButton from "../LoadMoreButton";

const Posts = ({ auth, dispatch, id, profile }) => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    profile.posts.forEach((data) => {
      if (data._id === id) {
          console.log(auth.token);
        setPosts(data.posts);
        setResult(data.result);
        setPage(data.page);
      }
    });
  }, [id, profile.posts]);

  const handleLoadMore = async () => {
    setLoad(true);

    const response = await getAPI(
      `user_posts/${id}?limit=${page * 9}`,
      auth.token
    );
    const newData = { ...response.data, page: page + 1, _id: id };
    dispatch({ type: PROFILE_TYPES.UPDATE_POST, payload: newData });

    setLoad(false);
  };
  return (
    <div>
      <PostThumb posts={posts} result={result} />

      {load && (
        <img src={LoadingIcon} alt="loading" className="d-block mx-auto" />
      )}

      <LoadMoreButton
        result={result}
        page={page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default Posts;
