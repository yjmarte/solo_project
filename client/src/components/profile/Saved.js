import React, { useEffect, useState } from "react";
import PostThumb from "../PostThumb";
import LoadingIcon from "../../images/loading.gif";
import LoadMoreButton from "../LoadMoreButton";
import { getAPI } from "../../redux/utilities/fetch.api";
import { GLOBAL_TYPES } from "../../redux/actions/global.types";
import { toast } from "react-toastify";

const Saved = ({ auth, dispatch }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(2);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    getAPI("saved", auth.token)
      .then((res) => {
        setSavedPosts(res.data.saved);
        setResult(res.data.result);
        setLoad(false);
      })
      .catch((err) => {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: toast.error(err.response.data.message) },
        });
      });

    return () => setSavedPosts([]);
  }, [auth.token, dispatch]);
  const handleLoadMore = async () => {
    setLoad(true);

    const response = await getAPI(`saved?limit=${page * 9}`, auth.token);
    setSavedPosts(response.data.saved);
    setResult(response.data.result);
    setPage(page + 1);
    setLoad(false);
  };

  return (
    <div>
      <PostThumb posts={savedPosts} result={result} />

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

export default Saved;
