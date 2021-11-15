export const GLOBAL_TYPES = {
  ALERT: "ALERT",
  AUTH: "AUTH",
  CALL: "CALL",
  MODAL: "MODAL",
  OFFLINE: "OFFLINE",
  ONLINE: "ONLINE",
  PEER: "PEER",
  STATUS: "STATUS",
  SOCKET: "SOCKET",
  THEME: "THEME",
};

export const EditData = (data, id, post) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return newData;
};

export const DeleteData = (data, id) => {
  const newData = data.filter((item) => item._id !== id);
  return newData;
};
