
//Khởi tạo và kết nối Firebase---------------------------------//
  const firebaseConfig = {
  apiKey: "AIzaSyBPq9KBZih9S_4_O2YlTfp5HJoIANi0aiQ",
  authDomain: "smart-home-ef536.firebaseapp.com",
  projectId: "smart-home-ef536",
  storageBucket: "smart-home-ef536.appspot.com",
  messagingSenderId: "525411228239",
  appId: "1:525411228239:web:8483c9d9f1ffdeda54a83a",
  measurementId: "G-P3KVXCLTBY"
};
//Tạo hàm-------------------------------------------------------//
function function_HN(){
  nd_HN.on('value', snap => ndHN.innerText = snap.val());
  da_HN.on('value', snap => daHN.innerText = snap.val());
  co_HN.on('value', snap => coHN.innerText = snap.val())
}
function function_GL(){
  nd_GL.on('value', snap => ndGL.innerText = snap.val());
  da_GL.on('value', snap => daGL.innerText = snap.val());
  co_GL.on('value', snap => coGL.innerText = snap.val())
}
function function_BD(){
  nd_BD.on('value', snap => ndBD.innerText = snap.val());
  da_BD.on('value', snap => daBD.innerText = snap.val());
  co_BD.on('value', snap => coBD.innerText = snap.val())
}
function function_HCM(){
  nd_HCM.on('value', snap => ndHCM.innerText = snap.val());
  da_HCM.on('value', snap => daHCM.innerText = snap.val());
  co_HCM.on('value', snap => coHCM.innerText = snap.val())
}
//Thiết lập thời gian--------------------------------------------//
function updateTime() {
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var timeString = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
    var dateString = formatTime(day) + "/" + formatTime(month) + "/" + year;
    var timeElements = document.getElementsByClassName("time");
    var dateElements = document.getElementsByClassName("date");
    for (var i = 0; i < timeElements.length; i++) {
      timeElements[i].innerHTML = timeString;
    }
    for (var j = 0; j < dateElements.length; j++) {
      dateElements[j].innerHTML = dateString;
    }
  }
function formatTime(time) {
    return time < 10 ? "0" + time : time;
}
//Hàm điều khiển chuông--------------------------------------------//
function called() {
  let btn1 = document.querySelector('#btn1');
  let img1 = document.querySelector('#call');
  btn1.addEventListener('click', () => {
    firebase.database().ref('Control').child('Chuongbao').once('value', (snapshot) => {
      const currentValue = snapshot.val();
      const newValue = currentValue === 1 ? 0 : 1;
      img1.src = newValue === 1 ? 'image/bell_on.gif' : 'image/bell_off.png';
      firebase.database().ref('Control').child('Chuongbao').set(newValue);
    });
  });
}
//Hàm điều khiển đèn--------------------------------------------//
function lightcontrol() {
  let bton = document.querySelector('#bton');
  let btoff = document.querySelector('#btoff');
  let img2 = document.querySelector('#light');
  bton.addEventListener('click', () => {
    img2.src = 'image/light_on.png';
    firebase.database().ref('Control').child('Den').set(1);
  });
  btoff.addEventListener('click', () => {
    img2.src = 'image/light_off.png';
    firebase.database().ref('Control').child('Den').set(0);  
  });
}
//Hàm điều khiển máy bơm----------------------------------------//
function getvalueslider() {
  var slider = document.getElementById("myRange");
  var output = document.getElementById("sliderValue");
  output.textContent = slider.value; 
  slider.addEventListener("input", function() {
  output.textContent = this.value; 
});
  slider.addEventListener('input', function() {
  var value = parseInt(slider.value);
  sliderValue.textContent = value;
  var img = document.getElementById('maybom');
  firebase.database().ref('Control').child('Maybom').set(value);  
  if (value >= 0 && value <= 25) {
      img.src = 'image/pump0.png';
  } else if (value > 25 && value <= 50) {
      img.src = 'image/pump.gif';
  } else if (value > 50 && value <= 75) {
      img.src = 'image/pump2.gif';
  } else {
    img.src = 'image/pump3.gif';
  } 
  })
}
