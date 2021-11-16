import React from "react";
import { useDispatch, useSelector } from "react-redux";

import UserCard from "../UserCard";
import FollowButton from "../FollowButton";
import LoadingIcon from "../../images/loading.gif";

import { getSuggestions } from "../../redux/actions/suggestion.action";

const SideBar = () => {
  const { auth, suggestions } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div>
      <UserCard user={auth.user} />

      <div className="d-flex justify-content-between align-items-center my-2">
        <h5 className="text-danger">Suggestions for you</h5>
        {!suggestions.loading && (
          <i
            className="fas fa-redo"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(getSuggestions(auth.token))}
          />
        )}
      </div>

      {suggestions.loading ? (
        <img src={LoadingIcon} alt="loading" className="d-block mx-auto my-4" />
      ) : (
        <div className="suggestions">
          {suggestions.users.map((user) => (
            <UserCard key={user._id} user={user}>
              <FollowButton user={user} />
            </UserCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBar;
