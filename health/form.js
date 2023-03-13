//  liff.init({ liffId: '1656902981-0g1VVnpN' }).then(async () => {
//      if (!liff.isLoggedIn()) {
//        liff.login({
//          redirectUri: 'https://tapp-smartcity.netlify.app/register.html'
//        });
//      } else if (await checkUser(await getUID())) {
//        window.location = './index.html';
//      } else if (!(await getFriend())) {
//        window.location = 'https://line.me/R/ti/p/@172nwynm';
//      } else {
//        document.getElementById('show').style.visibility = 'visible';2
//      }
//    });

//    async function getFriend() {
//      const friend = await liff.getFriendship();
//      return friend.friendFlag;
//    }

//    async function getUID() {
//      const data = await liff.getProfile();
//      const uid = await data.userId;
//      return uid;
//    }

function Disable(c) {
  const a = $(`.${c}`);
  if ($(`.${c}`)[0].checked) {
    for (let i = 0; i < a.length; i++) {
      if (i !== 0) {
        a[i].disabled = true;
        a[i].checked = false;
      }
    }
    if (c === "congenital") {
      $(".congenital-txt").attr("disabled", true);
      $(".congenital-txt").val("");
    } else if (c === "sick") {
      $(".sick-txt").attr("disabled", true);
      $(".sick-txt").val("");
    } else if (c === "accident") {
      $(".accident-txt").attr("disabled", true);
      $(".accident-txt").val("");
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      if (i !== 0) {
        a[i].disabled = false;
      }
    }
    if (c === "congenital") {
      $(".congenital-txt").attr("disabled", false);
    } else if (c === "sick") {
      $(".sick-txt").attr("disabled", false);
    } else if (c === "accident") {
      $(".accident-txt").attr("disabled", false);
    }
  }
}

$(".department").change((e) => {
  if ($(".department")[0].checked) {
    $("#ot").attr("disabled", false);
  } else {
    $("#ot").attr("disabled", true);
    $("#ot").val("");
  }
});

$(".drinking_alcohol").change((e) => {
  const a = $(".drinking_alcohol2");
  if (!$(".drinking_alcohol")[0].checked) {
    for (let i = 0; i < a.length; i++) {
      a[i].disabled = false;
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      a[i].disabled = true;
      a[i].checked = false;
    }
  }
});

$(".smoke_often1").change((e) => {
  if (!$(".smoke_often1")[0].checked) {
    $("#smoke_often1").attr("disabled", false);
  } else {
    $("#smoke_often1").attr("disabled", true);
    $("#smoke_often1").val("");
  }
});

$(".debt_information").change((e) => {
  if (!$(".debt_information")[0].checked) {
    $("#debt_information").attr("disabled", false);
  } else {
    $("#debt_information").attr("disabled", true);
    $("#debt_information").val("");
  }
});

$("#weight").change(() => {
  if ($("#weight").val() < 1) {
    $("#weight").val(1);
  }
  if (
    $("#weight").val() !== "" &&
    $("#height").val() !== "" &&
    $("#height").val() > 0
  ) {
    let BMI = (
      $("#weight").val() / Math.pow($("#height").val() / 100, 2)
    ).toFixed(2);
    $("#BMI").val(BMI);
    set();
  }
});

$("#height").change(() => {
  if ($("#height").val() < 90) {
    $("#height").val(90);
  }
  if (
    $("#weight").val() !== "" &&
    $("#height").val() !== "" &&
    $("#height").val() > 0
  ) {
    let BMI = (
      $("#weight").val() / Math.pow($("#height").val() / 100, 2)
    ).toFixed(2);
    $("#BMI").val(BMI);
    set();
  }
});

function set() {
  const BMI = $("#BMI").val();
  if (BMI < 18.5) {
    $("#proportion").val("น้ำหนักต่ำกว่าเกณฑ์");
    proportion = "น้ำหนักต่ำกว่าเกณฑ์";
    $("#proportion").css("color", "lime");
  } else if (BMI >= 18.5 && BMI < 22.9) {
    $("#proportion").val("สมส่วน");
    proportion = "สมส่วน";
    $("#proportion").css("color", "green");
  } else if (BMI >= 23 && BMI < 24.9) {
    $("#proportion").val("ท้วม");
    proportion = "ท้วม";
    $("#proportion").css("color", "yellow");
  } else if (BMI >= 25 && BMI < 29.9) {
    $("#proportion").val("โรคอ้วน");
    proportion = "โรคอ้วน";
    $("#proportion").css("color", "orange");
  } else if (BMI > 30) {
    $("#proportion").val("โรคอ้วนอันตราย");
    proportion = "โรคอ้วนอันตราย";
    $("#proportion").css("color", "red");
  }
}

$("#TWH01").submit(function (e) {
  let isNumber = ["age"];
  e.preventDefault();
  Swal.fire({
    icon: "question",
    title: "ยืนยันการบันทึกข้อมูล",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "ยืนยัน",
    denyButtonText: "ยกเลิก",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let data = {};
      let sumStrain = 0;
      let sumHappy = 0;
      let sumMemory = 0;
      $("#TWH01")
        .serializeArray()
        .forEach((e) => {
          if (isNumber.find((k) => k == e.name)) {
            data[e.name] = Number(e.value);
          } else {
            data[e.name] = e.value;
          }
        });
      for (let i = 1; i <= 20; i++) {
        sumStrain += Number(data[`Strain${i}`]);
      }
      for (let i = 1; i <= 15; i++) {
        sumHappy += Number(data[`happy${i}`]);
      }
      for (let i = 1; i <= 14; i++) {
        sumMemory += Number(data[`memory${i}`]);
      }
      data.BMI = Number($("#BMI").val());
      // data.sumStrain = sumStrain;
      // data.sumHappy = sumHappy;
      // data.sumMemory = sumMemory;
      data.proportion = proportion;
      fetch(
        "https://smartcity.onrender.com/employee/addeemployee",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      ).then(function (response) {
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลเสร็จสิ้น",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "ตกลง",
          timer: 3000,
        }).then((e) => {
          let pop = `<div class="card">
                        <div class="card-body ">
                            <h3 class="d-flex align-items-center" style="color: blue; flex-direction: column;">
                                คะแนนความเครียด ${sumStrain} คะแนน</h3>
                                <table id="customers">
                                    <tr>
                                        <th>คะแนนรวม</th>
                                        <th>การแปรผล</th>
                                    </tr>
                                    <tr>
                                        <td class="radio">0 - 23 คะแนน</td>
                                        <td class="radio" style="color: #006600;">มีความเครียดในระดับน้อยและหายไปได้ในระยะเวลาสั้นๆ</td>
                                    </tr>
                                    <tr>
                                        <td class="radio">24 - 41 คะแนน</td>
                                        <td class="radio" style="color: #0033FF;">มีความเครียดในระดับปานกลาง</td>
                                    </tr>
                                    <tr>
                                        <td class="radio">42 - 61 คะแนน</td>
                                        <td class="radio" style="color: #FF6600;">มีความเครียดในระดับสูง</td>
                                  </tr>1
                                    <tr>
                                        <td class="radio">62 คะแนนขึ้นไป</td>
                                        <td class="radio" style="color: #FF0000;">มีความเครียดในระดับรุนแรง</td>
                                  </tr>
                                </table>
                        </div>
                     </div>
             
                      <div class="card">
                          <div class="card-body">
                              <h3 class="d-flex align-items-center" style="color: blue; flex-direction: column;">
                                  คะแนนความสุข  ${sumHappy} คะแนน</h3>
                                  <table id="customers">
                                      <tr>
                                          <th>คะแนนรวม</th>
                                          <th>การแปรผล</th>
                                      </tr>
                                      <tr>
                                          <td class="radio">33 - 45 คะแนน</td>
                                          <td class="radio" style="color: #006600;">มีความสุขมากกว่าคนทั่วไป (good)</td>
                                      </tr>
                                      <tr>
                                          <td class="radio">27 - 32 คะแนน</td>
                                          <td class="radio" style="color: #0033FF;">มีความสุขเท่ากับคนทั่วไป (fair)</td>
                                      </tr>
                                      <tr>
                                          <td class="radio">26 คะแนน หรือน้อยกว่านั้น</td>
                                          <td class="radio" style="color: #FF0000;">มีความสุขน้อยกว่าคนทั่วไป (poor)</td>
                                      </tr>
                                  </table>
                          </div>
                      </div>
               
                      <div class="card">
                        <div class="card-body">
                            <h3 class="d-flex align-items-center" style="color: blue; flex-direction: column;">
                                คะแนนความจำ  ${sumMemory} คะแนน</h3>
                                <table id="customers">
                                    <tr>
                                        <th>คะแนนรวม</th>
                                        <th>การแปรผล</th> 
                                    </tr>
                                    <tr>
                                        <td class="radio">14 - 19 คะแนน</td>
                                        <td class="radio" style="color: #006600;">สมมรถภาพทางสมองอยู่ในระดับดีมาก</td>
                                    </tr>
                                    <tr>
                                        <td class="radio">20 - 29 คะแนน</td>
                                        <td class="radio" style="color: #0033FF;">สมมรถภาพทางสมองอยู่ในระดับปานกลาง ควรเข้ารับคำแนะนำเพื่อเพิ่มสมรรถภาพทางสมอง</td>
                                    </tr>
                                    <tr>
                                        <td class="radio">30 - 39 คะแนน</td>
                                        <td class="radio" style="color: #ffcc00 ;">สมมรถภาพทางสมองอยู่ในระดับค่อนข้างต่ำ ควรเข้ารับคำแนะนำเพื่อเพิ่มสมรรถภาพทางสมอง</td>
                                    </tr>311
                                    <tr>
                                        <td class="radio">40 - 56 คะแนน</td>
                                        <td class="radio" style="color: #FF0000;">สมมรถภาพทางสมองต่ำ ควรพบแพทย์</td>
                                    </tr>
                                </table>
                        </div>
                    </div>`;
          Swal.fire({
            html: pop,
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
          }).then((e) => {
            location.reload();
          });
        });
      });
    }
  });
});
