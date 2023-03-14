liff.init({ liffId: '1660741031-p2Rllq1n' }).then(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('topic');
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri:
        'https://nrsmartcity.netlify.app/compailn/appointment.html?topic=' +
        myParam
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

function loadFile(event) {
  let reader = new FileReader();
  reader.onload = function () {
    addImage(reader.result);
  };
  reader.readAsDataURL(event.target.files[0]);
}

function addImage(img) {
  const id = Math.round(Math.random() * 10000);
  $('#list_images').append(`
    <li class="item" id="${id}">
      <img class="img-row" src="${img}">
      <button class="btn btn-danger" onclick="remove_img(${id})">x</button>
    </li>
    `);
  $('#upload').val('');
  $('#camera').val('');
}

function remove_img(id) {
  $('#' + id).remove();
}

$(document).ready(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('topic');
  let data = await fetch(
    'https://nrsmartcity.netlify.app/apply/search?topic=' + myParam
  );
  data = await data.json();
  let html = '';
  $('#topic').text(data.type);
  data.details.forEach((element) => {
    html += `<option value="${element}">${element}</option>`;
  });
  $('#choice').append(html);
});

$('form').submit((e) => {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(function (position) {});
  Swal.fire({
    icon: 'question',
    title: 'ยืนยันการนัดหมาย',
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'ยืนยัน',
    denyButtonText: 'ยกเลิก'
  }).then(async (result) => {
    if (result.isConfirmed) {
      let data = await prepareData();
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify(data);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch(
        'https://nrsmartcity.netlify.app/appeal/addappeal',
        requestOptions
      )
        .then(() => {
          Swal.fire('ยืนยันการนัดหมายสำเร็จ', '', 'success').then(() =>
            location.reload()
          );
        })
        .catch((e) => {
          console.log;
        });
    }
  });
});

async function prepareData() {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('topic');
  let lat = 0;
  let lng = 0;
  let img = [];
  $('.img-row').each(function (i, obj) {
    img.push($(this).attr('src'));
  });
  navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
  });
  let data = {
    type: $('#choice').val(),
    details: $('#detail').val(),
    day: $('#day').val(),
    month: $('#month').val(),
    year: $('#year').val(),
    time: $('#time').val(),
    topic: myParam,
    userID: await getUID(),
    img: img,
    gps: {
      lat: lat,
      lng: lng
    }
  };
  return data;
}

$('#take_image').click(async () => {});
