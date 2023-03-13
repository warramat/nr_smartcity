liff.init({ liffId: '1656902981-0g1VVnpN' }).then(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('_id');
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri:
        'https://tapp-smartcity.netlify.app/health/Checkhealth.html?_id=' +
        myParam
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
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('_id');
  data.forEach((item, key) => {
    if (item._id === myParam) {
      html += `
      <div class="min-vw-100">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <p>วันที่ :${toThaidate(item.updated)}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <p>น้ำหนัก :${item.weight}</p>
                <p>ส่วนสูง :${item.height}</p>
                <p>BMI :${item.BMI}</p>
                <p>คุณอยู่ในเกณฑ์ :<span style="font-weight: bolder;color:${getcolor(
                  item.BMI
                )}">${item.proportion}</span></p>
                <br></br>
                <p>ความดันโลหิตครั้งที่ 1</p>
                <p>
                  ค่าความดันโลหิตค่าบน :
                  <span style="color: green">${item.upper_blood1}</span>
                </p>
                <p>
                  ค่าความดันโลหิตค่าบน :
                  <span style="color: green">${item.lower_blood2}</span>
                </p>
                <br></br>
                <p>ความดันโลหิตครั้งที่ 2</p>
                <p>ค่าความดันโลหิตค่าบน :${item.upper_blood2}</p>
                <p>ค่าความดันโลหิตค่าบน :${item.lower_blood2}</p>
                <br></br>
                <p>ค่าน้ำตาลในเลือด :${item.blood_sugar}</p>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>`;
    }
  });
  document.getElementById('check').innerHTML = html;
};
