liff.init({ liffId: '1660741031-p2Rllq1n' }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri: 'https://nrsmartcity.netlify.app/register.html'
    });
  } else if (await checkUser(await getUID())) {
    window.location = './index.html';
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



function makeList(id, data, clear = true) {
  let html = '';
  if (clear) {
    $('#' + id).html('');
  }
  data.forEach((element) => {
    html += `<option value="${element}">${element}</option>`;
  });
  $('#' + id).append(html);
}

$(document).ready(async () => {
  const isFriend = await getFriend();
  if (!isFriend) {
    window.location = 'https://liff.line.me/1660741031-p2Rllq1n';
  }
  const uid = await getUID();
  const ck = await checkUser(uid);
  if (ck) {
    window.location = './index.html';
  }

  let provinces = getProvinces();
  makeList('province', provinces, false);
});

/***************************************** */
$('#province').change(async () => {
  let district =  getDistrict($('#province').val());
  makeList('district', district);
  let subDistrict = getSubDistrict(
    $('#province').val(),
    $('#district').val()
  );
  let zipcode =  getZipcode($('#province').val(), $('#district').val());
  makeList('subdistrict', subDistrict);
  makeList('zipcode', zipcode);
  $('#district').prop('disabled', false);
  $('#subdistrict').prop('disabled', false);
  $('#zipcode').prop('disabled', false);
});

$('#district').change(async () => {
  let subDistrict = getSubDistrict(
    $('#province').val(),
    $('#district').val()
  );
  let zipcode =  getZipcode($('#province').val(), $('#district').val());
  makeList('zipcode', zipcode);
  makeList('subdistrict', subDistrict);
});
/*************************************************** */
async function getUID() {
  const data = await liff.getProfile();
  const uid = await data.userId;
  return uid;
}

$('form').submit((e) => {
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
      let data = $('form').serializeArray();
      let json = '{';
      for (let i = 0; i < data.length; i++) {
        json += `"${data[i].name}" :"${data[i].value}"`;
        i + 1 == data.length ? (json += '') : (json += ',');
      }
      const prefix = $('#prefix').val();
      if (prefix === 'เด็กชาย' || prefix === 'นาย') {
        json += ',"sex": "ชาย",';
      }
      if (prefix === 'นาง' || prefix === 'เด็กหญิง' || prefix === 'นางสาว') {
        json += ',"sex": "หญิง",';
      }
      let u = await getUID();
      json += `"userID":"${u}"`;
      json += '}';

      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = json;
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch(
        'https://smartcity.onrender.com/userSmart/Creuser',
        requestOptions
      ).then(() => {
        Swal.fire('บันทึกข้อมูลสำเร็จ', '', 'success')
          .then(() => {
            console.log(liff.getOS());
            if (liff.getOS() === 'web') {
              window.location = './index.html';
            } else {
              if(!liff.isInClient()){
                window.location = './index.html';
              }else{
                liff.closeWindow();
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      });
    }
  });
});
