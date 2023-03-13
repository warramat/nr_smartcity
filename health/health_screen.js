liff.init({ liffId: '1656902981-0g1VVnpN' }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri:
        'https://tapp-smartcity.netlify.app/health/health_screen.html'
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
      let data = {};
      var UID = await getUID();
      data.userID = UID;
      $('form')
        .serializeArray()
        .forEach((e) => {
          data[e.name] = e.value;
        });
      data.BMI = $('#BMI').val();
      data.proportion = proportion;
      console.log(data, 'data>>>');
      fetch('https://smartcity.onrender.com/health/addhealth', {
        method: 'POST',
        body: JSON.stringify(data),
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
          location.reload();
        });
      });
    }
  });
});

/*
async function senddata() {
  var weight = document.getElementById('weight').value;
  var height = document.getElementById('height').value;
  var BMI = document.getElementById('BMI').value;
  var proportion = document.getElementById('proportion').innerText;
  var waistline = document.getElementById('waistline').value;
  var upper_blood1 = document.getElementById('upper_blood1').value;
  var lower_blood1 = document.getElementById('lower_blood1').value;
  var upper_blood2 = document.getElementById('upper_blood2').value;
  var lower_blood2 = document.getElementById('lower_blood2').value;
  var blood_sugar = document.getElementById('blood_sugar').value;
  var UID = await getUID();
  var data = {
    weight: weight,
    height: height,
    BMI: BMI,
    proportion: proportion,
    waistline: waistline,
    upper_blood1: upper_blood1,
    lower_blood1: lower_blood1,
    upper_blood2: upper_blood2,
    lower_blood2: lower_blood2,
    blood_sugar: blood_sugar,
    userID: UID
  };
  console.log(data);
  fetch('https://smartcity.onrender.com/health/addhealth', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  }).then(function (response) {
    Swal.fire({
      icon: 'success',
      title: 'การบันทึกข้อมูลเสร็จสิ้น',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'ตกลง',
      timer: 3000
    }).then(async (result) => {
      location.reload();
    });
  });
}
*/
/********************************************** */

$('#weight').change(() => {
  if ($('#weight').val() < 1) {
    $('#weight').val(1);
  }
  if (
    $('#weight').val() !== '' &&
    $('#height').val() !== '' &&
    $('#height').val() > 0
  ) {
    let BMI = (
      $('#weight').val() / Math.pow($('#height').val() / 100, 2)
    ).toFixed(2);
    $('#BMI').val(BMI);
    set();
  }
});

$('#height').change(() => {
  if ($('#height').val() < 90) {
    $('#height').val(90);
  }
  if (
    $('#weight').val() !== '' &&
    $('#height').val() !== '' &&
    $('#height').val() > 0
  ) {
    let BMI = (
      $('#weight').val() / Math.pow($('#height').val() / 100, 2)
    ).toFixed(2);
    $('#BMI').val(BMI);
    set();
  }
});

$('#waistline').change(() => {
  if ($('#waistline').val() < 10) {
    $('#waistline').val(10);
  }
});

function set() {
  const BMI = $('#BMI').val();
  if (BMI < 18.5) {
    $('#proportion').val('น้ำหนักต่ำกว่าเกณฑ์');
    proportion = 'น้ำหนักต่ำกว่าเกณฑ์';
    $('#proportion').css('color', 'lime');
  } else if (BMI >= 18.5 && BMI < 22.9) {
    $('#proportion').val('สมส่วน');
    proportion = 'สมส่วน';
    $('#proportion').css('color', 'green');
  } else if (BMI >= 23 && BMI < 24.9) {
    $('#proportion').val('ท้วม');
    proportion = 'ท้วม';
    $('#proportion').css('color', 'yellow');
  } else if (BMI >= 25 && BMI < 29.9) {
    $('#proportion').val('โรคอ้วน');
    proportion = 'โรคอ้วน';
    $('#proportion').css('color', 'orange');
  } else if (BMI > 30) {
    $('#proportion').val('โรคอ้วนอันตราย');
    proportion = 'โรคอ้วนอันตราย';
    $('#proportion').css('color', 'red');
  }
}
