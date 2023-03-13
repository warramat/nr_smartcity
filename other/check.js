liff.init({ liffId: '1656902981-0g1VVnpN' }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri: 'https://tapp-smartcity.netlify.app/other/check.html'
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

window.onload = async () => {
  const UID = await getUID();
  console.log(UID);
  let data = await fetch(
    'https://smartcity.onrender.com/protest/find/data/?userID=' +
      UID
  );
  let html = '';
  data = await data.json();
  data = data.data;
  data = data.reverse();
  data.forEach((item, key) => {
    html += `
    <div class="min-vw-100">
    <div class="card">
    <p href="./Checkhealth.html?_id=${item._id}">
      <div class="card-body">
      <div class="col-12">
      <h3 style="color:blue">เลขที่ :${key + 1}</h3>
      <h4>เรื่อง :${item.type}</h4>
      <h4>สถานะ :<span style="color:${
        item.status === 'รอตรวจสอบ' ? 'skyblue' : 'pink'
      }";>${item.status}</span></h4>
      <br />
      <h4>${toThaidate(item.updated)}</h4>
    </div>
      </div>
      </p>
    </div>
  </div>`;
  });
  document.getElementById('check').innerHTML = html;
};
