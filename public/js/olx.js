// _________________________________________Firebase Constant______________________________________
// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();
//  Initialize Cloud Firestore and get a reference to the service
const database = firebase.firestore();

let loginUser, postData = [];
let parentNavbar = document.getElementById("parentNavbar");
let locationList = document.getElementById("list");
let move_icon = document.getElementById("move-icon");
let searchInput = document.getElementById("search-box");
let product = document.querySelector(".product");
let bodyPostWrapper = document.createElement("div");
bodyPostWrapper.setAttribute("class", "First_row");
let noAdMessage = document.createElement("div");
noAdMessage.setAttribute("class", "no-ad-message");
let noAdMessageh1 = document.createElement("h3");
noAdMessageh1.textContent = "No ads found for this location";
let noAdMessageImg = document.createElement("img");
noAdMessageImg.setAttribute("class", "notFoundImg");
noAdMessageImg.src = "images/iconNotFound.webp";
noAdMessage.appendChild(noAdMessageh1);
noAdMessage.appendChild(noAdMessageImg);
let postTitleArray = [];
let selectedLocation = ""; // Global variable to store the selected location
let unsubscribe;

function showAndHideLocationList() {
  locationList.classList.toggle("show");
  move_icon.classList.toggle("rotate");
}

function selectLocation(location) {
  let locationText = document.getElementById("text");
  if (location === "See ads in all Pakistan") {
    // If "See ads" is selected, reset the selected location to an empty string
    locationText.textContent = location;
    selectedLocation = "";
  } else {
    locationText.textContent = location;
    selectedLocation = location;
  }
  filterAdsByLocation();
  searchInput.value = "";
  hideSearchDiv();
}

function filterAdsByLocation() {
  // Clear existing posts
  product.innerHTML = "";
  postData = [];
  postTitleArray = [];
  // Get the reference to the "post" collection
  const postCollection = database.collection("post");

  // Check if a location is selected
  if (selectedLocation === "") {
    // If no location is selected, fetch all ads
    postCollection.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const dataFromFirebase = doc.data();
        if (dataFromFirebase) {
          getAllPosts(dataFromFirebase);
        }
      });

      // Display a message if no ads were found
      if (postData.length === 0) {
        noAdMessage.style.display = "flex";
        noAdMessageh1.textContent = "No ads found for this location";
        product.appendChild(noAdMessage);
      } else {
        noAdMessage.style.display = "none";
      }
    });
  } else {
    // If a location is selected, fetch ads for that location
    postCollection.where("postLocation", "==", selectedLocation).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const dataFromFirebase = doc.data();
        if (dataFromFirebase) {
          getAllPosts(dataFromFirebase);
        }
      });

      // Display a message if no ads were found for the selected location
      if (postData.length === 0) {
        noAdMessage.style.display = "flex";
        noAdMessageh1.textContent = "No ads found for this location";
        product.appendChild(noAdMessage);
      } else {
        noAdMessage.style.display = "none";
      }
    });
  }
}


function searchInputOutlineAqua() {
  searchInput.style.outlineColor = "aqua";
  // searchInput.style.border="0.1rem solid #23e5db";
}

function navigateToLogin() {
  window.location.href = "model.html";
}

function logOut() {
  auth.signOut().then(function () {
    localStorage.clear();
    window.location.reload();
  });
}

function navigateToAdPost() {
  window.location.href = "adpost.html";
}

function showAndHideNavbarOnSmallDevices() {
  let hamburgerImage = document.querySelector('.hamb');
  hamburgerImage.src = "images/close.png";
  parentNavbar.classList.toggle("active");
  locationList.classList.remove("show");
  const searchDiv = document.getElementById("search-div");
  if (searchDiv.style.display === "block") {
    searchDiv.style.display = "none";
  }
  if (!parentNavbar.classList.contains("active")) {
    move_icon.classList.remove("rotate");
    hamburgerImage.src = "images/hamb.png";
  }
  searchInput.value = "";
}

window.addEventListener("load", () => {
  // Show loader when the page is loaded
  document.getElementById("loader").classList.remove("hidden");
  localStorage.clear();
  auth.onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      loginUser = user;
      printHeader(user);
      let showads = document.getElementById("showads");
      showads.setAttribute("onclick", `showads('${user.uid}')`);
    } else {
      printHeader();
    }
  });

  // Fetch and show posts from Firebase
  unsubscribe = database.collection("post").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const dataFromFirebase = change.doc.data();
        if (dataFromFirebase) {
          getAllPosts(dataFromFirebase);
        }
      }
    });

    // Hide loader when data is loaded
    document.getElementById("loader").classList.add("hidden");
  });

  return () => {
    unsubscribe();
  };
});

function printHeader(user) {
  let loginWrapperText = document.querySelector(".loginText");
  let loginButton = document.querySelector(".login-button");
  const sellWrapper = document.querySelector(".sellWrapper");
  let showAdsDiv = document.getElementById("showads");
  if (user) {
    loginWrapperText.textContent = "LogOut";
    loginButton.setAttribute("onclick", "logOut()");
    sellWrapper.setAttribute("onclick", "navigateToAdPost()");
    showAdsDiv.style.visibility = "initial";
  } else {
    loginWrapperText.textContent = "Login";
    loginButton.setAttribute("onclick", "navigateToLogin()");
    sellWrapper.setAttribute("onclick", "navigateToLogin()");
    showAdsDiv.style.visibility = "hidden";
  }
}

/* ___________________________________________Product________________________________________________ */

// Function to create a new row (wrapper) for products
function createNewRow() {
  bodyPostWrapper = document.createElement("div");
  bodyPostWrapper.setAttribute("class", "First_row");
  product.appendChild(bodyPostWrapper);
}

// Function to add a single post to the product grid
function getAllPosts(data) {
  const postWrapper = document.createElement("div");
  postWrapper.setAttribute("class", "box");
  postWrapper.setAttribute("id", data?.id);

  const postInnerWrapperOne = document.createElement("div");
  postInnerWrapperOne.setAttribute("class", "img-box");

  const postInnerWrapperImage = document.createElement("img");
  if (data.postImages.length === 1) {
    postInnerWrapperImage.setAttribute("src", data?.postImages[0]);
    // postInnerWrapperImage.setAttribute("alt", data?.postImages[0]);
  } else {
    postInnerWrapperImage.setAttribute("src", data?.postImages);
    // postInnerWrapperImage.setAttribute("alt", data?.postImages);
  }
  postInnerWrapperOne.appendChild(postInnerWrapperImage);

  const postInnerWrapperSecond = document.createElement("div");
  postInnerWrapperSecond.setAttribute("class", "addres_data");

  const postInnerWrapperSecondLocation = document.createElement("p");
  postInnerWrapperSecondLocation.textContent = data?.postLocation;
  postInnerWrapperSecond.appendChild(postInnerWrapperSecondLocation);

  const postInnerHeading = document.createElement("p");
  postInnerHeading.textContent = data?.postTitle;

  const postInnerPrice = document.createElement("h2");
  postInnerPrice.textContent = `Rs ${data?.postPrice}`;

  postWrapper.appendChild(postInnerWrapperOne);
  postWrapper.appendChild(postInnerHeading);
  postWrapper.appendChild(postInnerPrice);
  postWrapper.appendChild(postInnerWrapperSecond);

  // Check if we need to create a new row (after every 4 posts)
  if (postData.length % 4 === 0) {
    createNewRow();
  }

  // Append the post wrapper to the current row (bodyPostWrapper)
  bodyPostWrapper.appendChild(postWrapper);

  postData.push(data);

  // Check if the post belongs to the current user and add "My Ad" tag
  if (data?.user_id == loginUser?.uid) {
    const myAd = document.createElement("p");
    myAd.setAttribute("class", "myAd");
    myAd.textContent = "My Ad";
    postInnerWrapperSecond.appendChild(myAd);
  }

  // Add click event to the post to store its ID in localStorage and redirect to the adpage.html
  postWrapper.addEventListener("click", () => {
    localStorage.setItem("postId", postWrapper.id);
    window.location.href = "adpage.html";
  });
  let postTitles = data.postTitle;
  postTitleArray.push(postTitles);
}

let clickedKeyword = null; // Variable to store the clicked keyword
let displayedTitles = new Set(); // Set to store displayed titles

function filterByKeyword(keyword) {
  clickedKeyword = keyword.toLowerCase(); // Store the clicked keyword

  // Clear existing posts
  product.innerHTML = "";
  postData = [];
  postTitleArray = [];

  const postCollection = database.collection("post");

  postCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const dataFromFirebase = doc.data();
      if (dataFromFirebase) {
        const postTitle = dataFromFirebase.postTitle.toLowerCase();
        const postLocation = dataFromFirebase.postLocation.toLowerCase();

        if (
          (selectedLocation === "" || postLocation === selectedLocation.toLowerCase()) &&
          postTitle.includes(clickedKeyword)
        ) {
          getAllPosts(dataFromFirebase);
        }
      }
    });

    // Display a message if no matching ads were found
    if (postData.length === 0) {
      noAdMessage.style.display = "flex";
      noAdMessageh1.textContent = "No ads found for this location";
      product.appendChild(noAdMessage);
    } else {
      noAdMessage.style.display = "none";
    }
  });
}


function displayAvailableKeywords() {
  const searchInput = document.getElementById("search-box").value.trim().toLowerCase(); // Convert input to lowercase
  const searchDiv = document.getElementById("search-div");
  const ul = searchDiv.querySelector("ul");
  ul.innerHTML = ""; // Clear the existing li tags
  displayedTitles.clear(); // Clear the displayedTitles Set

  let hasAdsForSelectedLocation = false; // Flag to track if there are ads for the selected location
  let suggestionCount = 0; // Counter to limit suggestions to 3

  postTitleArray.forEach((title) => { // Iterate over each title in the postTitleArray
    const titleLowerCase = title.toLowerCase(); // Convert title to lowercase for case-insensitive comparison
    const postElements = document.querySelectorAll(".box");
    postElements.forEach((postElement, index) => { // Iterate over each post element
      if (index < postTitleArray.length) {
        const postLocationElement = postElement.querySelector(".addres_data p");
        if (postLocationElement) {
          const postLocation = postLocationElement.textContent.toLowerCase();
          if (
            titleLowerCase.includes(searchInput) && // Check if the title matches the search input
            (selectedLocation === "" || postLocation === selectedLocation.toLowerCase())
          ) {
            if (!displayedTitles.has(titleLowerCase) && suggestionCount < 3) {
              const li = document.createElement("li");
              li.textContent = title; // Display the original title, not in lowercase
              li.onclick = () => {
                const searchBox = document.getElementById("search-box");
                searchBox.value = titleLowerCase; // Set the search box value to lowercase
                filterByKeyword(titleLowerCase); // Pass the clicked keyword in lowercase
                hideSearchDiv(); // Hide the search-div on li click
              };
              ul.appendChild(li);
              displayedTitles.add(titleLowerCase); // Add the title to the displayedTitles Set
              suggestionCount++; // Increment suggestion count
            }
            hasAdsForSelectedLocation = true;
          }
        }
      }
    });
  });

  // If no ads are found for the selected location, display the message in the li
  if (!hasAdsForSelectedLocation && suggestionCount === 0) {
    const li = document.createElement("li");
    li.textContent = "No matching ads found for this location";
    ul.appendChild(li);
  }

  // Show or hide the search-div based on user input
  if (searchInput === "") {
    hideSearchDiv();
    // Reset the clicked keyword when hiding the search-div
    clickedKeyword = null;
  } else {
    showSearchDiv();
  }
}

// Function to hide the search-div
function hideSearchDiv() {
  const searchDiv = document.getElementById("search-div");
  searchDiv.style.display = "none";
}

// Function to show the search-div
function showSearchDiv() {
  const searchDiv = document.getElementById("search-div");
  searchDiv.style.display = "block";
}

function showads(userId) {
  if (userId) {
    // Fetch ads from the database that match the user ID
    database.collection("post").where("user_id", "==", userId).get()
      .then((querySnapshot) => {
        // Clear existing ads
        product.innerHTML = "";
        postData = [];
        postTitleArray = [];
        // Iterate through the fetched ads and display them
        querySnapshot.forEach((doc) => {
          const dataFromFirebase = doc.data();
          if (dataFromFirebase) {
            getAllPosts(dataFromFirebase);
          }
        });

        // Check if ads were found for the user
        if (postData.length === 0) {
          // Display a message if no ads were found
          noAdMessage.style.display = "flex";
          noAdMessageh1.textContent = "you haven't posted any ads yet";
          product.appendChild(noAdMessage);
        } else {
          noAdMessage.style.display = "none";
        }
        fetchData()
      })
      .catch((error) => {
        console.error("Error fetching ads:", error);
      });
  } else {
    console.error("User ID is undefined");
  }
}

// Find the image element by its id
const reloadAdsImage = document.getElementById("reloadAdsImage");

// Attach an event listener to the image
reloadAdsImage.addEventListener("click", function () {
  let locationText = document.getElementById("text");
  const searchDiv = document.getElementById("search-div");
  // Clear existing ads
  product.innerHTML = "";
  postData = [];
  postTitleArray = [];
  searchInput.value = "";
  locationText.textContent = "Select Your Location";
  locationList.classList.remove("show");
  selectedLocation = "";
  searchDiv.style.display = "none";
  // Fetch all ads from the database
  database.collection("post").get()
    .then((querySnapshot) => {
      // Iterate through the fetched ads and display them
      querySnapshot.forEach((doc) => {
        const dataFromFirebase = doc.data();
        if (dataFromFirebase) {
          getAllPosts(dataFromFirebase);
        }
      });

      // Check if any ads were found
      if (postData.length === 0) {
        // Display a message if no ads were found
        noAdMessage.style.display = "flex";
        product.appendChild(noAdMessage);
      } else {
        noAdMessage.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error fetching ads:", error);
    });
});

function fetchData() {
  // Reset postData and postTitleArray
  postData = [];
  postTitleArray = [];
  // Fetch and show all posts from Firebase
  database.collection("post").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const dataFromFirebase = doc.data();
        postData.push(dataFromFirebase);
        const postTitles = dataFromFirebase.postTitle;
        postTitleArray.push(postTitles);
      });
      // Now, all data has been fetched and pushed into arrays
      // You can perform further operations here if needed
      console.log("All postData", postData);
      console.log("All postTitleArray", postTitleArray);
    })
    .catch((error) => {
      console.error("Error fetching ads:", error);
    });
}