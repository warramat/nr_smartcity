function logout() {
  liff.logout();
  if (liff.getOS() !== 'web') {
    liff.closeWindow();
  } else {
    location.reload();
  }
}

liff.init({ liffId: '1656902981-0g1VVnpN' }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri: 'https://nrsmartcity.netlify.app'
    });
  } else if (!(await checkUser(await getUID()))) {
    window.location = '../register.html';
  } else if (!(await getFriend())) {
    window.location = 'https://line.me/R/ti/p/@172nwynm';
  } else {
    document.getElementById('show').style.visibility = 'visible';
  }
});

async function getFriend() {
  const friend = await liff.getFriendship();
  return friend.friendFlag;
}
async function getUID() {
  const data = await liff.getProfile();
  const uid = await data.userId;
  return uid;
}
