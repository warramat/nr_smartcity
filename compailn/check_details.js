liff.init({ liffId: '1660741031-p2Rllq1n' }).then(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key') || 0;
  const _id = urlParams.get('_id');
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri: `https://tapp-smartcity.netlify.app/compailn/check_details.html?key=${key}&_id=${_id}`
    });
  } else if (!(await checkUser(await getUID()))) {
    window.location = '../register.html';
  } else if (!(await getFriend())) {
    window.location = 'https://line.me/R/ti/p/@451ukfkc';
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

function renderStar(clickable, Star = 0) {
  let selected = ['', '', '', '', ''];
  for (let i = 0; i < Star; i++) {
    selected[i] = 'checked';
  }
  let html = ` 
  <br>
  <h4 class="d-flex justify-content-center">แบบประเมินความพึงพอใจ</h4>
  <div class="star d-flex justify-content-center">
  <button type="button" id="star1" ${
    clickable
      ? 'onmouseover="hover(1)" onmouseleave="resetStar(1)" onclick="star(1)"'
      : ''
  }
      class="fa fa-star ${selected[0]}"></button>
  <button type="button"  id="star2"  ${
    clickable
      ? 'onmouseover="hover(2)" onmouseleave="resetStar(2)" onclick="star(2)"'
      : ''
  }
      class="fa fa-star  ${selected[1]}"></button>
  <button type="button"  id="star3"  ${
    clickable
      ? 'onmouseover="hover(3)" onmouseleave="resetStar(3)" onclick="star(3)"'
      : ''
  }
      class="fa fa-star  ${selected[2]}"></button>
  <button type="button"  id="star4"  ${
    clickable
      ? 'onmouseover="hover(4)" onmouseleave="resetStar(4)" onclick="star(4)"'
      : ''
  }
      class="fa fa-star  ${selected[3]}"></button>
  <button type="button"  id="star5"  ${
    clickable
      ? 'onmouseover="hover(5)" onmouseleave="resetStar(5)" onclick="star(5)"'
      : ''
  }
      class="fa fa-star  ${selected[4]}"></button>
  <span id="star" hidden>${Star}</span>
</div>
<br>
<h4 class="star d-flex justify-content-center" style="margin-bottom: 5px;">แสดงความคิดเห็น</h4>
<textarea class="d-flex justify-content-center" rows="8" id="Comment" ${
    !clickable ? 'disabled' : ''
  }></textarea>
 ${
   clickable
     ? '<br><center><input  onclick="comment()" type="submit" value="ยืนยัน" class="btn btn-primary" style="width: 50%;"></center>'
     : ''
 }
`;
  return html;
}

function comment() {
  let Star = document.getElementById('star').innerText;
  let Comment = document.getElementById('Comment').value;
  if (Star == 0) {
    Swal.fire({
      icon: 'warning',
      title: 'กรุณาประเมินความพึงพอใจ',
      timer: 3000
    });
  } else {
    Swal.fire({
      icon: 'question',
      title: 'ยืนยันการประเมินความพึงพอใจ',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'ยืนยัน',
      denyButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const urlParams = new URLSearchParams(window.location.search);
        const _id = urlParams.get('_id');
        let url =
          'https://tapp-smartcity.netlify.app/appeal/addStar/Comment/' +
          _id;
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
          headers: myHeaders,
          method: 'PUT',
          body: JSON.stringify({ Star, Comment }),
          redirect: 'follow'
        };
        fetch(url, requestOptions)
          .then(() => {
            Swal.fire('การประเมินความพึงพอใจสำเร็จ', '', 'success').then(() => {
              location.reload();
            });
          })
          .catch((e) => {
            console.log;
          });
      }
    });
  }
}

window.onload = async () => {
  const img_url = 'https://tapp-smartcity.netlify.app/userSmart/';
  const UID = await getUID();
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key') || 0;
  const _id = urlParams.get('_id');
  let data = await fetch(
    'https://tapp-smartcity.netlify.app/appeal/find/data?userID=' + UID
  );
  data = await data.json();
  data = data.data;
  data = data.find((e) => e._id === _id);
  let html_img = '';
  data.img.forEach((e) => {
    html_img += `
    <li class="item">
      <a  href='${img_url}${e}'>
        <img  class="img-row" src="${img_url}${e}"/>
      </a>
    </li>`;
  });
  let star = '';
  if (data.status === 'เสร็จสิ้น') {
    if (data.Star === 0) {
      star = renderStar(true);
    } else {
      star = renderStar(false, data.Star);
    }
  }
  let html = `
    <div class="d-flex align-items-center" style="margin-top: 2rem; flex-direction: column;">
    <h2 style="color:green">เลขที่ :${Number(key)}</h2>
    </div>
        <div class="min-vw-100">
          <div class="card">
            <div class="card-body">
            <div class="col-12">
            <center><ul class="images" id="list_images">${html_img}</ul></center>
            <h4>เรื่อง :${data.type}</h4>
            <h4>รายละเอียด :${data.details}</h4>
            <h4>สถานะ :<span style="color:${
              data.status === 'รอตรวจสอบ'
                ? 'pink'
                : data.status === 'กำลังแก้ไข'
                ? 'orange'
                : 'green'
            }";>${data.status}</span></h4>
            <h4>${toThaidate(data.updated)}</h4>
            ${star}
          </div>
          <br />
            </div>
          </div>
        </div>
        `;
  document.getElementById('check').innerHTML = html;
  document.getElementById('Comment').value = data.Comment || '';
};
