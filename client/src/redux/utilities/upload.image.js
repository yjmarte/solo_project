import { toast } from "react-toastify";

export const checkImage = (file) => {
  let err = "";
  if (!file) err = "File does not exist.";

  if (file.size > 1024 * 1024) {
    err = "The image/video is too large. (1mb)";
  }

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Image format is not accepted.";

  if (err) {
    return toast.error(err);
  }
};

export const uploadImage = async (images) => {
  let imageArr = [];

  for (const item of images) {
    const form = new FormData();

    if (item.camera) {
      form.append("file", item.camera);
    } else {
      form.append("file", item);
    }

    form.append("upload_preset", "inract_");
    form.append("cloud_name", "inract");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/inract/image/upload",
      {
        method: "POST",
        body: form,
      }
    );

    const file = await response.json();
    console.log(file);
    imageArr.push({ public_id: file.public_id, url: file.secure_url });
  }
  return imageArr;
};

export const uploadAvatar = async (images) => {
  let imageArr = [];

  for (const item of images) {
    const form = new FormData();

    if (item.camera) {
      form.append("file", item.camera);
    } else {
      form.append("file", item);
    }

    form.append("upload_preset", "inract_avi_");
    form.append("cloud_name", "inract");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/inract/image/upload",
      {
        method: "POST",
        body: form,
      }
    );

    const file = await response.json();
    imageArr.push({ public_id: file.public_id, url: file.secure_url });
  }
  return imageArr;
};
