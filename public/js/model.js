function login() {
  window.location.href = "login.html";
}
function close1() {
  // window.location.href = "index.html";
  let check = localStorage.getItem("check");
  if (check) {
    window.location.href = "addpage.html";
    localStorage.removeItem("check");
  } else {
    window.location.href = "index.html";
  }
}
