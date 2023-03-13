function hover(star) {
  for (let i = 1; i <= star; i++) {
    document.getElementById('star' + i).classList.add('checked');
  }
}
function resetStar(star) {
  const l = Number(document.getElementById('star').innerText);
  if (l == 0) {
    for (let i = 1; i <= star; i++) {
      document.getElementById('star' + i).classList.remove('checked');
    }
  } else if (star > l) {
    for (let i = star; i >l; i--) {
      document.getElementById('star' + i).classList.remove('checked');
    }
  }
}
function star(star) {
  for (let i = 1; i <= 5; i++) {
    document.getElementById('star' + i).classList.remove('checked');
  }
  for (let i = 1; i <= star; i++) {
    document.getElementById('star' + i).classList.add('checked');
  }
  document.getElementById('star').innerText = star;
}
