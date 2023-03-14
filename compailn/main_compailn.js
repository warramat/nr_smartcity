liff.init({ liffId: '1660741031-p2Rllq1n' }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri:
        'https://nrsmartcity.netlify.app/compailn/main_compailn.html'
    });
  } else if (!(await checkUser(await getUID()))) {
    window.location = '../register.html';
  } else if (!(await getFriend())) {
    window.location = 'https://liff.line.me/1660741031-p2Rllq1n';
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
