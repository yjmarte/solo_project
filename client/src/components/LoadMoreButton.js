import React from "react";
import { Button } from "react-bootstrap";

const LoadMoreButton = ({ result, page, load, handleLoadMore }) => {
  return (
    <>
      {result < 9 * (page - 1)
        ? ""
        : !load && (
            <Button
              variant="dark"
              className="mx-auto d-block"
              onClick={handleLoadMore}
            >
              Load more
            </Button>
          )}
    </>
  );
};

export default LoadMoreButton;
