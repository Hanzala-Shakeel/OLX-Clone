// JavaScript
const postId = localStorage.getItem("postId");
const database = firebase.firestore();
// Access Firebase Storage
const storage = firebase.storage();
let = postData = [];
window.addEventListener("load", () => {
  const auth = firebase.auth();
  let loginUser;
  auth.onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      loginUser = user;
      console.log("user login he ", loginUser.uid);
    } else {
      console.log("user login nhi he");
    }
  });
  if (postId) {
    const carouselInner = document.getElementById("carouselInner");
    const postPriceElement = document.querySelector(".post-price h1");
    const postTitleElement = document.querySelector(".post-title h4");
    const userLocationElements = Array.from(document.querySelectorAll(".user-location p"));
    const postBrandElement = document.querySelector(".post-brand p.bold");
    const postPriceSectionElement = document.querySelector(".post-price-section p.bold");
    const postDescriptionElement = document.querySelector(".description-text p");
    const userInfoElement = document.querySelector(".user-info p");
    const icons = document.querySelector(".icons");
    const userbtn = document.querySelector(".user-btn");
    database
      .collection("post")
      .doc(postId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          console.log(doc.id, " => ", data);

          // Check if the post has any images
          if (data.postImages && typeof data.postImages === "object") {
            data.postImages.forEach((imageUrl, index) => {
              const carouselItem = document.createElement("div");
              carouselItem.classList.add("carousel-item");
              if (index === 0) {
                carouselItem.classList.add("active");
              }

              const image = document.createElement("img");
              image.src = imageUrl;
              image.classList.add("d-block", "carousel-image", "mx-auto");
              image.alt = "Image " + (index + 1);

              carouselItem.appendChild(image);
              carouselInner.appendChild(carouselItem);
            });
          } else {
            // console.log("No images found for the post");
            const carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item", "active");

            const image = document.createElement("img");
            image.src = data.postImages;
            image.classList.add("d-block", "carousel-image", "mx-auto");
            image.alt = "Image 1"; // Assuming it's the only image in the string

            carouselItem.appendChild(image);
            carouselInner.appendChild(carouselItem);
            const prevButton = document.querySelector(".carousel-control-prev");
            const nextButton = document.querySelector(".carousel-control-next");

            if (prevButton) {
              prevButton.remove();
            }

            if (nextButton) {
              nextButton.remove();
            }
          }
          // Populate the HTML elements with the data
          postPriceElement.textContent = `Rs ${data.postPrice}`;
          postTitleElement.textContent = data.postTitle;
          userLocationElements.forEach((element) => {
            element.childNodes[1].textContent = data.postLocation;
          });
          postBrandElement.textContent = data.postBrand;
          postPriceSectionElement.textContent = data.postPrice;
          postDescriptionElement.textContent = data.postDescription;
          userInfoElement.textContent = data.postUserName;
          postData.push(data);
          if (data?.user_id == loginUser?.uid) {
            const deleteIcon = document.createElement("i");
            deleteIcon.setAttribute("class", "fa-solid fa-trash");
            deleteIcon.setAttribute("onclick", "deleteIcon()");
            const editIcon = document.createElement("i");
            editIcon.setAttribute("class", "fa-solid fa-user-pen mx-2");
            editIcon.setAttribute("onclick", "editUser()");
            icons.appendChild(editIcon);
            icons.appendChild(deleteIcon);
            userbtn.childNodes[1].lastChild.textContent = data.postUserNumber;
          } else if (loginUser && data?.user_id != loginUser?.uid) {
            userbtn.addEventListener(
              "click",
              () =>
                (userbtn.childNodes[1].lastChild.textContent =
                  data.postUserNumber)
            );
          } else {
            userbtn.setAttribute("onclick", "navigateToLogin()");
          }
        } else {
          console.log("No document found with ID:", postId);
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    console.log("No postId found in local storage");
  }
});

function navigateToLogin() {
  localStorage.setItem("check", "userAdPageSeGaya");
  window.location.href = "model.html";
}
function navigateToHome() {
  window.location.href = "index.html";
}

function deleteIcon() {
  swal({
    title: "Are you sure?",
    text: "This action cannot be undone.",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    closeOnConfirm: false,
    closeOnCancel: true
  }, function (isConfirmed) {
    if (isConfirmed) {
      // Get the document data
      database
        .collection("post")
        .doc(postId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            const imageUrls = data.postImages;

            // Check if imageUrls is a string or an array
            if (typeof imageUrls === "string") {
              // Delete single image
              const imageRef = storage.refFromURL(imageUrls);
              imageRef.delete()
                .then(() => {
                  // Image deleted, now delete the document
                  return database.collection("post").doc(postId).delete();
                })
                .then(() => {
                  swal({
                    title: "Congrats!",
                    text: "Document successfully deleted!",
                    type: "success"
                  }, function () {
                    window.location.href = "index.html";
                  });
                })
                .catch((error) => {
                  console.error("Error deleting image or document: ", error);
                });
            } else if (Array.isArray(imageUrls)) {
              // postImages is an array, delete each image
              const deleteImagePromises = imageUrls.map((imageUrl) => {
                const imageRef = storage.refFromURL(imageUrl);
                return imageRef.delete();
              });

              // After all images are deleted, delete the document
              Promise.all(deleteImagePromises)
                .then(() => {
                  // All images deleted, now delete the document
                  return database.collection("post").doc(postId).delete();
                })
                .then(() => {
                  swal({
                    title: "Congrats!",
                    text: "Document successfully deleted!",
                    type: "success"
                  }, function () {
                    window.location.href = "index.html";
                  });
                })
                .catch((error) => {
                  console.error("Error deleting images or document: ", error);
                });
            } else {
              console.error("postImages is neither a string nor an array");
            }
          } else {
            console.log("No document found with ID:", postId);
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }
  });
}


function editUser() {
  window.location.href = "adpost.html";
  localStorage.setItem("check", "userAdPageSeGaya");
  localStorage.setItem("editPostData", JSON.stringify(postData));
}
