const M = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฏาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม'
];

liff.init({ liffId: '1656902981-0g1VVnpN' }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri: 'https://tapp-smartcity.netlify.app/health/health_Edit.html'
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

$('#year').change(() => {
  makemouth();
});
$('#month').change(() => {
  makeday();
});

$(document).ready(async function () {
  await load();
});

function makeyear() {
  let today = new Date();
  let year = today.getFullYear() + 543;
  let html = '';
  for (year; year > 2449; year--) {
    html += `  <option value="${year}">${year}</option>`;
  }
  $('#year').html(html);
}

function makemouth() {
  let today = new Date();
  let html = '';
  if ($('#year').val() == today.getFullYear() + 543) {
    M.forEach((e, i) => {
      if (i > today.getMonth()) {
        return;
      } else if (i === today.getMonth()) {
        html += `  <option selected value="${e}">${e}</option>`;
      } else {
        html += `  <option value="${e}">${e}</option>`;
      }
    });
  } else {
    M.forEach((e, i) => {
      html += `<option value="${e}">${e}</option>`;
    });
  }
  console.log(html);
  $('#month').html(html);
}

function makeday() {
  let today = new Date();

  if (
    $('#year').val() == today.getFullYear() + 543 &&
    today.getMonth() === M.indexOf($('#month').val())
  ) {
    renderday(true);
  } else {
    renderday(false);
  }
}

function leapyear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function renderday(t) {
  let today = new Date();
  let html = '';
  if (leapyear(Number($('#year').val()) - 543)) {
    if ($('#month').val() === 'กุมภาพันธ์') {
      for (let i = 1; i != 30; i++) {
        if (t && today.getDate() === i) {
          html += `<option selected value="${i}">${i}</option>`;
          break;
        }
        html += `<option value="${i}">${i}</option>`;
      }
    } else if ($('#month').val().indexOf('ยน') != -1) {
      for (let i = 1; i != 31; i++) {
        if (t && today.getDate() === i) {
          html += `<option selected value="${i}">${i}</option>`;
          break;
        }
        html += `<option value="${i}">${i}</option>`;
      }
    } else {
      for (let i = 1; i != 32; i++) {
        if (t && today.getDate() === i) {
          html += `<option selected value="${i}">${i}</option>`;
          break;
        }
        html += `<option value="${i}">${i}</option>`;
      }
    }
  } else {
    if ($('#month').val() === 'กุมภาพันธ์') {
      for (let i = 1; i != 29; i++) {
        if (t && today.getDate() === i) {
          html += `<option selected value="${i}">${i}</option>`;
          break;
        }
        html += `<option value="${i}">${i}</option>`;
      }
    } else if ($('#month').val().indexOf('ยน') != -1) {
      for (let i = 1; i != 31; i++) {
        if (t && today.getDate() === i) {
          html += `<option selected value="${i}">${i}</option>`;
          break;
        }
        html += `<option value="${i}">${i}</option>`;
      }
    } else {
      for (let i = 1; i != 32; i++) {
        if (t && today.getDate() === i) {
          html += `<option selected  value="${i}">${i}</option>`;
          break;
        }
        html += `<option value="${i}">${i}</option>`;
      }
    }
  }
  $('#day').html(html);
}

/*******************************เพิ่มข้อมูลเข้า ลำดับแรก************************** */
$('form').submit(function (e) {
  const today = new Date();
  e.preventDefault();
  if (Script_checkID($('#cardID').val())) {
    Swal.fire({
      icon: 'question',
      title: 'ยืนยันการบันทึกข้อมูล',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'ยืนยัน',
      denyButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let data = {};
        var UID = await getUID();
        data.userID = UID;
        $('form')
          .serializeArray()
          .forEach((e) => {
            data[e.name] = e.value;
          });
        if (Number($('#year').val()) - 543 - today.getFullYear() >= 60) {
          data.elderly = 'เป็น';
        } else {
          data.elderly = 'ไม่เป็น';
        }
        console.log(data);
        fetch(
          'https://smartcity.onrender.com/disease/adddisease',
          {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }
        ).then(function (response) {
          Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลเสร็จสิ้น',
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            timer: 3000
          }).then(async (result) => {
            location.reload();
          });
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: 'ตกลง',
      timer: 3000
    });
  }
});

/**************************แก้ไข*********************************** */
async function load() {
  const list = [
    'bedridden_patient',
    'handicapped',
    'congenital_disease',
    'diabetes',
    'lung_disease',
    'kidney_disease',
    'immunodeficiency',
    'liver_disease',
    'migraine',
    'high_blood',
    'thalassemia',
    'heart_disease',
    'allergy',
    'epilepsy'
  ];
  const UID = await getUID();
  const data = await (
    await fetch(
      'https://smartcity.onrender.com/disease/find/data?userID=' +
        UID
    )
  ).json();
  console.log(data.data);
  if (data.total > 0) {
    const D = new Date();
    let html = '';
    const row = data.data[0];
    $('#cardID').val(row.cardID);
    $('#hospital').val(row.hospital);
    $('#other').val(row.other);
    for (let y = Number(D.getFullYear()) + 543; y != 2449; y--) {
      html += `<option ${
        row.year == y ? 'selected' : ''
      } value="${y}">${y}</option>`;
    }
    $('#year').html(html);
    list.forEach((e) => {
      $(`input[name='${e}']`).each(function () {
        if ($(this).val() === row[e]) {
          $(this).attr('checked', 'checked');
        }
      });
    });
    html = '';
    M.forEach((e, i) => {
      html += `<option ${
        row.month == e ? 'selected' : ''
      } value="${e}">${e}</option>`;
    });
    $('#month').html(html);
    if (row.month.indexOf('ยน') != -1) {
      html = '';
      for (let d = 1; d < 31; d++) {
        html += `<option ${
          row.day == d ? 'selected' : ''
        } value="${d}">${d}</option>`;
      }
      $('#day').html(html);
    } else if (row.month.indexOf('คม') != -1) {
      html = '';
      for (let d = 1; d < 32; d++) {
        html += `<option ${
          row.day == d ? 'selected' : ''
        } value="${d}">${d}</option>`;
      }
      $('#day').html(html);
    } else {
      if (leapyear(Number(row.year) - 543)) {
        html = '';
        for (let d = 1; d < 30; d++) {
          html += `<option ${
            row.day == d ? 'selected' : ''
          } value="${d}">${d}</option>`;
        }
        $('#day').html(html);
      } else {
        for (let d = 1; d < 29; d++) {
          html = '';
          html += `<option ${
            row.day == d ? 'selected' : ''
          } value="${d}">${d}</option>`;
        }
        $('#day').html(html);
      }
    }
  } else {
    await makeyear();
    await makemouth();
    await makeday();
  }
}
