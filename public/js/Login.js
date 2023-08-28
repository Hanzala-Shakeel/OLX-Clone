// _________________________________________Firebase Constant______________________________________

//  Initialize Firebase Authentication and get a reference to the service

const auth = firebase.auth();

function loginUser(e) {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  if (email.value == "") {
    swal("Please enter your email");
    return;
  }
  if (password.value == "") {
    swal("Please enter your password");
    return;
  }

  // Regular expression to check if the email format is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    swal("Invalid Email", "Please enter a valid email address", "warning");
    return;
  }

  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      // Successful login
      var user = userCredential.user;
      swal(
        {
          title: "Congrats!",
          text: "Login Successfully!",
          type: "success",
        },
        function () {
          let check = localStorage.getItem("check");
          if (check) {
            window.location.href = "adpage.html";
            localStorage.removeItem("check");
          } else {
            window.location.href = "index.html";
          }
        }
      );
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      // If account not found (email or password incorrect), show the appropriate message
      if (errorCode === "auth/user-not-found") {
        swal(
          {
            title: "Account Not Found!",
            text: "Please register to create an account",
            type: "warning",
          },
          function () {
            window.location.href = "signup.html";
          }
        );
      } else if (errorCode === "auth/wrong-password") {
        swal(
          "Incorrect Password",
          "Please check your password and try again",
          "error"
        );
      } else {
        // Handle other error scenarios
        swal("Error!", "An error occurred. Please try again later.", "error");
      }
    });
}
