export const showImage = (src, theme) => {
  return (
    <img
      src={src}
      alt="images"
      className="img-thumbnail"
      style={{ filter: theme ? "invert(0)" : "invert(1)" }}
    />
  );
};

export const showVideo = (src, theme) => {
  return (
    <video
      controls
      src={src}
      alt="images"
      className="img-thumbnail"
      style={{ filter: theme ? "invert(0)" : "invert(1)" }}
    />
  );
};
