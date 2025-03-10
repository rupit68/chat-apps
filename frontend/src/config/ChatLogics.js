export const getsender = (loguser, users) => {
  if (!loguser) {
    console.error("getsender error: loguser is missing _id", loguser);
    return "Unknown User";
  }

  if (!users || users.length < 2) {
    console.error("getsender error: Invalid users array", users);
    return "Unknown";
  }

  return users[0]._id === loguser._id ? users[1].name : users[1].name;
};
