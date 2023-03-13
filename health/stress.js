liff.init({ liffId: '1656902981-0g1VVnpN' }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri: 'https://tapp-smartcity.netlify.app/health/stress.html'
    });
  } else if (!(await checkUser(await getUID()))) {
    window.location = '../register.html';
  } else if (!(await getFriend())) {
    window.location = 'https://line.me/R/ti/p/@172nwynm';
  } else {
    document.getElementById('show').style.visibility = 'visible';
  }
});
var proportion = '';
async function getFriend() {
  const friend = await liff.getFriendship();
  return friend.friendFlag;
}
async function getUID() {
  const data = await liff.getProfile();
  const uid = await data.userId;
  return uid;
}

let sendData = {};
let sum = 0;
$('form').submit(function (e) {
  e.preventDefault();
  Swal.fire({
    icon: 'question',
    title: 'ยืนยันการบันทึกข้อมูล',
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'ยืนยัน',
    denyButtonText: 'ยกเลิก'
  }).then(async (result) => {
    if (result.isConfirmed) {
      var UID = await getUID();
      sendData.userID = UID;
      const form = $('form').serializeArray();
      const n = form.length;
      sum = 0;
      form.forEach((e) => {
        sum += Number(e.value);
        sendData[e.name] = e.value;
      });
    }
    fetch('https://smartcity.onrender.com/stress/addstress', {
      method: 'PUT',
      body: JSON.stringify(sendData),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(function (response) {
      Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูลเสร็จสิ้น',
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'ตกลง',
        timer: 3000
      }).then(async (result) => {
        let texts = [
          `<tr>
          <td class="radio">62 คะแนนขึ้นไป</td>
          <td class="radio" style="color: #FF0000;">มีความเครียดในระดับรุนแรง</td>
      </tr>
      `,
          `<tr>
          <td class="radio">42 - 61 คะแนน</td>
          <td class="radio" style="color: #FF6600;">มีความเครียดในระดับสูง</td>
      </tr>
      `,

          `<tr>
          <td class="radio">24 - 41 คะแนน</td>
          <td class="radio" style="color: #0033FF;">มีความเครียดในระดับปานกลาง</td>
      </tr>`,

          `<tr>
          <td class="radio">0 - 23 คะแนน</td>
          <td class="radio" style="color: #006600;">มีความเครียดในระดับน้อยและหายไปได้ในระยะเวลาสั้นๆ</td>
      </tr>
      <pre>ท่านมีความเครียดอยู่ในระดับที่น้อยและหายไปได้ในระยะเวลาสั้นๆ เป็นความเครียดที่เกิดขึ้นได้ในชีวิตประจำวันและสามารถปรับตัวกับสถานการณ์ต่างๆ 
      ได้อย่างเหมาะสม ความเครียดในระดับนี้ถือว่ามีประโยชน์ในการดำเนินชีวิตประจำวัน เป็นแรงจูงใจในที่นำไปสู่ความสำเร็จในชีวิตได้</pre>
      `
        ];
        let index = () => {
          if (sum >= 62) {
            return 0;
          } else if (sum >= 42) {
            return 1;
          } else if (sum >= 24) {
            return 2;
          } else {
            return 3;
          }
        };
        let pop = `<div class="card">
        <div class="card-body ">
            <h3 class="d-flex align-items-center" style="color: blue; margin-top: 2rem; flex-direction: column;">
                คะแนนรวมของคุณ <span id="happyScore"></span> ${sum} คะแนน</h3>
                <table id="customers">
                    <tr>
                        <th>คะแนนรวม</th>
                        <th>การแปรผล</th>
                    </tr>
                    ${texts[index()]}
                </table>
                </br>
        </div>
    </div>
    </div>`;
        Swal.fire({
          html: pop,
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: 'ตกลง'
        }).then(() => (window.location = './index.html'));
      });
    });
  });
});
