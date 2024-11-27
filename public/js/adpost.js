// _________________________________________Firebase Constant______________________________________

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();
//  Initialize Cloud Firestore and get a reference to the service
const database = firebase.firestore();
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();

let brand_box = document.getElementById("brand-box");

let move_icon = document.getElementById("move-icon");

let hidden = document.getElementById("hidden");

let location_box = document.getElementById("location-box");

let currentUser = null;
let getEditUserId;
let getEditUserData;

window.addEventListener("load", () => {
  auth.onAuthStateChanged((user) => {

    if (user) {
      currentUser = user;
      console.log("currentUser", currentUser);
    } else {
      currentUser = null;
    }

    getEditUserId = localStorage.getItem("postId");
    getEditUserData = JSON.parse(localStorage.getItem("editPostData"));
    console.log("getEditUserId", getEditUserId);

    console.log("User id", user.uid);

    if (getEditUserId || getEditUserData) {
      const getCurrentPost = getEditUserData.find(
        (postData) => postData.id == getEditUserId
      );
      console.log("getEditUserData", getCurrentPost);

      let postTitle = document.getElementById("postTitle");
      let postDescription = document.getElementById("postDescription");
      let postBrand = document.getElementById("brand-box");
      let postPrice = document.getElementById("commodityPrice");
      let postLocation = document.getElementById("location-box");
      let postUserName = document.getElementById("postUserName");
      let postUserNumber = document.getElementById("postUserNumber");
      let heading = document.querySelector(".heading h3");
      let lastBtn = document.querySelector(".last-button button");

      postTitle.value = getCurrentPost.postTitle;
      postDescription.value = getCurrentPost.postDescription;
      postBrand.value = getCurrentPost.postBrand;
      postPrice.value = getCurrentPost.postPrice;
      postLocation.innerHTML = getCurrentPost.postLocation;
      postUserName.value = getCurrentPost.postUserName;
      postUserNumber.value = getCurrentPost.postUserNumber;
      heading.textContent = "EDIT YOUR AD";
      lastBtn.textContent = "Edit Now";
      imageCountElement.textContent = "If you're not changing the images, we will take your existing images. Otherwise, we will replace the existing images with new ones."
      imageCountElement.style.fontSize = "15px";
      imageCountElement.style.color = "rgb(86 189 200)";
      imageCountElement.style.fontWeight = "bold";
    }
  });
});


function toggle() {
  hidden.classList.toggle("hidden");
  move_icon.classList.toggle("move");
}
function select_location(value2) {
  location_box.innerHTML = value2;
  hidden.classList.toggle("hidden");
}

function navigateToHome() {
  // window.location.href = "index.html";
  let check = localStorage.getItem("check");
  if (check) {
    window.location.href = "adpage.html";
    localStorage.removeItem("check");
    localStorage.removeItem("postData");
  } else {
    window.location.href = "index.html";
  }
}

// post ad, upload multiple images at once and edit post without updating the image functionalty

function postAd(e) {
  // showPostingModal();
  const postTitle = document.getElementById("postTitle");
  const postDescription = document.getElementById("postDescription");
  const postBrand = brand_box;
  const postPrice = document.getElementById("commodityPrice");
  const postLocation = location_box;
  const postUserName = document.getElementById("postUserName");
  const postUserNumber = document.getElementById("postUserNumber");
  const galleryImageFirst = document.getElementById("photo_1");

  if (postTitle.value == "") {
    swal("Please enter post title");
    return;
  }
  if (postDescription.value == "") {
    swal("Please enter post description");
    return;
  }
  if (postBrand.value == "") {
    swal("Please select post brand");
    return;
  }
  if (postPrice.value == "") {
    swal("Please enter post price");
    return;
  }
  if (postLocation.innerHTML == "") {
    swal("Please select post location");
    return;
  }
  if (postUserName.value == "") {
    swal("Please enter post host name");
    return;
  }
  if (postUserNumber.value == "") {
    swal("Please enter post host number");
    return;
  }
  if (!galleryImageFirst.files || galleryImageFirst.files.length === 0) {
    swal("Please upload an image");
    return;
  }

  if (getEditUserId !== null) {
    const files = galleryImageFirst.files;
    const imageUrls = [];
    let uploadCount = 0;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imagesRef = storage.ref().child("images/" + file.name);
        imagesRef.put(file).then((data) => {
          data.ref.getDownloadURL().then((url) => {
            imageUrls.push(url);
            uploadCount++;

            if (uploadCount === files.length) {
              updatePost();
            }
          });
        });
      }
    } else {
      // No new images, simply update post data without modifying images
      updatePost();
    }

    function updatePost() {
      const postData = {
        postTitle: postTitle.value,
        postDescription: postDescription.value,
        postBrand: postBrand.value,
        postPrice: postPrice.value,
        postLocation: postLocation.innerHTML,
        postUserName: postUserName.value,
        postUserNumber: postUserNumber.value,
      };

      // Add imageUrls to postData if there are new images
      if (imageUrls.length > 0) {
        postData.postImages = files.length === 1 ? imageUrls[0] : imageUrls;
      }

      database.collection("post").doc(getEditUserId).update(postData)
        .then(() => {
          localStorage.removeItem("currentPostUserId");
          localStorage.removeItem("editPostData");
          swal({
            title: "Congrats!",
            text: "Edit Post Successfully!",
            type: "success",
          }, function () {
            navigateToHome();
          });
        })
        .catch((error) => {
          console.log("error is", error);
        });
    }
  }
  else {
    // Add mode: create a new post
    const files = galleryImageFirst.files;
    const imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imagesRef = storage.ref().child("images/" + file.name);
      imagesRef.put(file).then((data) => {
        data.ref.getDownloadURL().then((url) => {
          imageUrls.push(url);
          if (imageUrls.length === files.length) {
            const postImages = imageUrls.length === 1 ? imageUrls[0] : imageUrls;

            const postData = {
              postTitle: postTitle.value,
              postDescription: postDescription.value,
              postBrand: postBrand.value,
              postPrice: postPrice.value,
              postLocation: postLocation.innerHTML,
              postUserName: postUserName.value,
              postUserNumber: postUserNumber.value,
              postImages: postImages,
              user_id: currentUser.uid,
            };

            database
              .collection("post")
              .add(postData)
              .then((doc) => {
                database
                  .collection("post")
                  .doc(doc.id)
                  .set({
                    ...postData,
                    id: doc.id,
                  })
                  .then(() => {
                    swal(
                      {
                        title: "Congrats!",
                        text: "Post Successfully!",
                        type: "success",
                      },
                      function () {
                        window.location.href = "index.html";
                      }
                    );
                  })
                  .catch((error) => {
                    console.log("error is", error);
                  });
              })
              .catch((error) => {
                console.log("error is", error);
              });
          }
        });
      });
    }
  }
}

function showPostingModal() {
  // Get the modal element
  const modal = document.getElementById("postingModal");

  // Display the modal
  modal.style.display = "flex";
}
function hidePostingModal() {
  // Get the modal element
  const modal = document.getElementById("postingModal");

  // Hide the modal
  modal.style.display = "none";
}

// document.addEventListener('contextmenu', function(e) {
//   e.preventDefault();
// });


// code to show selected image count

const galleryImageFirst = document.getElementById("photo_1");
const imageCountElement = document.querySelector(".upload-photos p");

galleryImageFirst.addEventListener("change", (event) => {
  const files = event.target.files;
  imageCountElement.textContent = `${files.length} Image${files.length > 1 ? 's' : ''} selected`;
  imageCountElement.style.fontSize = "16px";
  imageCountElement.style.color = "rgb(86 189 200)";
  imageCountElement.style.fontWeight = "bold";
});


// Function to format number with Indian commas
const postPrice = document.getElementById("commodityPrice");
function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

// Function to allow only numbers to be entered
function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    evt.preventDefault();
    return false;
  }
  return true;
}

// Add input event listener to format price in real-time
postPrice.addEventListener("input", function () {
  // Remove any previously added commas
  const numericValue = postPrice.value.replace(/,/g, '');
  // Format the number with commas and update the value
  postPrice.value = numberWithCommas(numericValue);
});

// Add keypress event listener to allow only numbers to be entered
postPrice.addEventListener("keypress", isNumberKey);

let postUserNumber = document.getElementById("postUserNumber");
postUserNumber.addEventListener("keypress", isNumberKey);
