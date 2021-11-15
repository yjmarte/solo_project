import axios from "axios";
axios.defaults.withCredentials = true;

export const getAPI = async (url, token) => {
  const response = await axios.get(`http://localhost:8000/api/${url}`, {
    headers: { Authorization: token },
  });
  return response;
};

export const postAPI = async (url, post, token) => {
  const response = await axios.post(`http://localhost:8000/api/${url}`, post, {
    headers: { Authorization: token },
  });
  return response;
};

export const putAPI = async (url, post, token) => {
  const response = await axios.put(`http://localhost:8000/api/${url}`, post, {
    headers: { Authorization: token },
  });
  return response;
};

export const patchAPI = async (url, post, token) => {
  const response = await axios.patch(`http://localhost:8000/api/${url}`, post, {
    headers: { Authorization: token },
  });
  return response;
};

export const deleteAPI = async (url, token) => {
  const response = await axios.delete(`http://localhost:8000/api/${url}`, {
    headers: { Authorization: token },
  });
  return response;
};
