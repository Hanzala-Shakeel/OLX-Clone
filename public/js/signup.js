// _________________________________________Firebase Constant______________________________________

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();
//  Initialize Cloud Firestore and get a reference to the service
const database = firebase.firestore();

function signup(e) {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  if (name.value === "") {
    swal("Please enter your name");
    return;
  }
  if (email.value === "") {
    swal("Please enter your email");
    return;
  }
  if (password.value === "") {
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
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      var user_uid = user.uid;
      database
        .collection("users")
        .doc(user_uid)
        .set({
          name: name.value,
          email: email.value,
          user_id: user_uid,
        })
        .then((doc) => {
          name.value = "";
          password.value = "";
          swal(
            {
              title: "Congrats!",
              text: "Signup Successfully!",
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
          console.log("error is", error);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // Check if the email is already in use
      if (error.code === "auth/email-already-in-use") {
        swal(
          "Email Already in Use",
          "Please use a different email address.",
          "warning"
        );
      } else {
        swal("Error!", "An error occurred. Please try again later.", "error");
      }
    });
}
