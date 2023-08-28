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
let noAdMessageh1 = document.createElement("h1");
noAdMessageh1.textContent = "No ads found for this location";
noAdMessage.appendChild(noAdMessageh1);
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
}

function filterAdsByLocation() {
  // Get all the post elements
  const postElements = document.querySelectorAll(".box");

  let adsFound = false;

  // Loop through each post element and check if the location matches the selected location
  postElements.forEach((postElement) => {
    const postLocationElement = postElement.querySelector(".addres_data p");
    if (
      selectedLocation === "" ||
      postLocationElement.textContent === selectedLocation
    ) {
      // Show the ad if no location is selected or if it matches the selected location
      postElement.style.display = "block";
      adsFound = true;
    } else {
      // Hide the ad if it doesn't match the selected location
      postElement.style.display = "none";
    }
  });
  // If no ads are found for the selected location, display the message
  if (!adsFound) {
    product.appendChild(noAdMessage);
    noAdMessage.style.display = "flex";
  } else {
    noAdMessage.style.display = "none";
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
  const searchDiv = document.getElementById("search-div");
  if (searchDiv.style.display === "block") {
    searchDiv.style.display = "none";
  }
  if (!parentNavbar.classList.contains("active")) {
    locationList.classList.remove("show");
    move_icon.classList.remove("rotate");
    hamburgerImage.src = "images/hamb.png";
  }
  searchInput.value = "";
}

window.addEventListener("load", () => {
  localStorage.clear();
  auth.onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      loginUser = user;
      printHeader(user);
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
  });
  return () => {
    unsubscribe();
  };
});

function printHeader(user) {
  let header = document.getElementById("header");
  let parentNavbar = document.getElementById("parentNavbar");
  const loginWrapper = document.createElement("div");
  loginWrapper.setAttribute("class", "login-button");
  const loginWrapperText = document.createElement("p");
  if (user) {
    loginWrapperText.textContent = "LogOut";
    loginWrapper.setAttribute("onclick", "logOut()");
  } else {
    loginWrapperText.textContent = "Login";
    loginWrapper.setAttribute("onclick", "navigateToLogin()");
  }
  loginWrapper.appendChild(loginWrapperText);
  const sellWrapper = document.createElement("p");
  sellWrapper.setAttribute("class", "sell_button");
  const sellWrapperButton = document.createElement("button");
  const sellWrapperIcon = document.createElement("i");
  sellWrapperIcon.setAttribute("class", "fa-regular fa-plus");
  const sellWrapperText = document.createElement("p");
  if (user) {
    sellWrapperText.setAttribute("onclick", "navigateToAdPost()");
  } else {
    sellWrapperText.setAttribute("onclick", "navigateToLogin()");
  }
  sellWrapperText.textContent = "SELL";
  sellWrapperButton.appendChild(sellWrapperIcon);
  sellWrapperButton.appendChild(sellWrapperText);
  sellWrapper.appendChild(sellWrapperButton);
  parentNavbar.appendChild(loginWrapper);
  parentNavbar.appendChild(sellWrapper);
  header.appendChild(parentNavbar);
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
    postInnerWrapperImage.setAttribute("alt", data?.postImages[0]);
  } else {
    postInnerWrapperImage.setAttribute("src", data?.postImages);
    postInnerWrapperImage.setAttribute("alt", data?.postImages);
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

  const postElements = document.querySelectorAll(".box");

  postElements.forEach((postElement, index) => {
    const postLocationElement = postElement.querySelector(".addres_data p");
    const postTitle = postElement.querySelector("p").textContent.toLowerCase();
    const postLocation = postLocationElement.textContent.toLowerCase();

    if (
      (selectedLocation === "" ||
        postLocation === selectedLocation.toLowerCase()) &&
      postTitle.includes(clickedKeyword)
    ) {
      postElement.style.display = "block";
    } else {
      postElement.style.display = "none";
    }
  });
}

function displayAvailableKeywords() {
  const searchInput = document.getElementById("search-box").value.trim();
  const searchDiv = document.getElementById("search-div");
  const ul = searchDiv.querySelector("ul");
  ul.innerHTML = ""; // Clear the existing li tags
  displayedTitles.clear(); // Clear the displayedTitles Set

  let hasAdsForSelectedLocation = false; // Flag to track if there are ads for the selected location

  // Iterate through each post title and check if it matches the keyword and selected location
  postTitleArray.forEach((title, index) => {
    const postElement = document.querySelectorAll(".box")[index];
    const postLocationElement = postElement.querySelector(".addres_data p");
    const postLocation = postLocationElement.textContent.toLowerCase();
    if (
      title.toLowerCase().includes(searchInput.toLowerCase()) &&
      (selectedLocation === "" ||
        postLocation === selectedLocation.toLowerCase())
    ) {
      if (!displayedTitles.has(title.toLowerCase())) {
        const li = document.createElement("li");
        li.textContent = title.toLowerCase();
        li.onclick = () => {
          const searchBox = document.getElementById("search-box");
          searchBox.value = title.toLowerCase();
          filterByKeyword(title); // Pass the clicked keyword
          hideSearchDiv(); // Hide the search-div on li click
        };
        ul.appendChild(li);
        displayedTitles.add(title.toLowerCase()); // Add the title to the displayedTitles Set
      }
      hasAdsForSelectedLocation = true;
    }
  });

  // If no ads are found for the selected location, display the message in the li
  if (!hasAdsForSelectedLocation) {
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
