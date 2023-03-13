$('form').submit(function (e) {
  e.preventDefault();
  const form = $('form').serializeArray();
  const n = form.length;
  let sum = 0;
  form.forEach((e) => {
    sum += Number(e.value);
  });
  const avg = Math.round(sum / n);
});
