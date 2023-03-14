let baseURL = `https://nrsmartcity.netlify.app/userSmart/user/searchUserID`;
async function checkUser(userId) {
  const res = await fetch(`${baseURL}?userID=${userId}`);
  return res.status === 200;
}
