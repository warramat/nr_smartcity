var jwt = localStorage.getItem('jwt');
if (jwt == null) {
  window.location.href = './login.html';
}

function loadUser() {
  var base64Url = jwt.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  const obj = JSON.parse(jsonPayload);
  document.getElementById('userid').innerText = obj.userid;
  document.getElementById('name').innerText = obj.name;
}

loadUser();

function logout() {
  localStorage.removeItem('jwt');
  window.location.href = './login.html';
}

