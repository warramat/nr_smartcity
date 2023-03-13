liff.init({ liffId: '1656902981-0g1VVnpN' }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri:
        'https://tapp-smartcity.netlify.app/health/health_history.html'
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

function getcolor(BMI) {
  if (BMI < 18.5) {
    return 'lime';
  } else if (BMI >= 18.5 && BMI < 22.9) {
    return 'green';
  } else if (BMI >= 23 && BMI < 24.9) {
    return 'yellow';
  } else if (BMI >= 25 && BMI < 29.9) {
    return 'orange';
  } else if (BMI > 30) {
    return 'red';
  }
}

window.onload = async () => {
  const UID = await getUID();
  let data = await fetch(
    'https://smartcity.onrender.com/health/find/data?userID=' + UID
  );
  let html = '';
  data = await data.json();
  data = data.data;
  data = data.reverse();
  data.forEach((item, key) => {
    html += `
        <div class="min-vw-100">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12 ">
               📅 &nbsp${toThaidate(
                 item.updated
               )} &nbsp &nbsp ⏰ &nbsp${getTime(item.updated)}น.</div>
              </div>
              <div class="row">
                <div class="col-12">
               <h6 style="margin-bottom:-3px;"><b>BMI ค่าที่ได้ : ${
                 item.BMI
               }</b></h6>
              คุณอยู่ในเกณฑ์ :<span style="font-weight: bolder;color: ${getcolor(
                item.BMI
              )}">${item.proportion}</span><p></p>
                  <a class="btn btn-outline-primary " href="./Checkhealth.html?_id=${
                    item._id
                  }" style="width: 100%;">
                      ดูรายละเอียด</a>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  });
  document.getElementById('check').innerHTML = html;
};
