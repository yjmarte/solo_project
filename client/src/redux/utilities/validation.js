const validation = (name, username, password, confirmPassword) => {
  // Error object
  const err = {};

  // Check name for errors.
  if (!name) {
    err.name = "Name is required.";
  } else if (name.length < 2) {
    err.name = "Name must be at least 2 characters in length.";
  } else if (name.length > 30) {
    err.name = "Name must not exceed 30 characters in length.";
  }

  // Check username for errors.
  if (!username) {
    err.username = "Username is required.";
  } else if (username.length < 3) {
    err.username = "Username must be at least 3 characters in length.";
  } else if (username.replace(/ /g, "").length > 15) {
    err.username = "Username must not exceed 15 characters in length.";
  }

  // Check password for errors.
  if (!password) {
    err.password = "Password is required.";
  } else if (password.length < 8) {
    err.password = "Password must be at least 8 characters in length.";
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    err.confirmPassword = "Passwords do not match.";
  }

  return {
    errMessage: err,
    errLength: Object.keys(err).length,
  };
};

export default validation;
