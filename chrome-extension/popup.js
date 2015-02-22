// This callback function is called when the content script has been
// injected and returned its results
function onPageDetailsReceived(pageDetails)  {
    document.getElementById('title').value = pageDetails.title;
    document.getElementById('url').value = pageDetails.url;
    document.getElementById('summary').innerText = pageDetails.summary;
}

// Global reference to the status display SPAN
var statusDisplay = null;


function saveUserInfo(){
  event.preventDefault();

  var username = encodeURIComponent(document.getElementById('username').value);

  var getUrl = 'http://localhost:3000/steps/' + username;

  // Set up an asynchronous AJAX POST request


  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    // If the request completed
    if (xhr.readyState == 4) {
      statusDisplay.innerHTML = '';
      if (xhr.status == 200) {
        // If it was a success, close the popup after a short delay
        statusDisplay.innerHTML = 'Foobar';
        console.log(xhr.responseText);
        console.log("xhr", xhr);
        // window.setTimeout(window.close, 1000);
        var data = jQuery.parseJSON(xhr.response)
        console.log("data", data);
        chrome.storage.local.set({user: data}, function() {
          if(chrome.runtime.lastError) {
            console.error(
              "Error setting " + user + " to " + JSON.stringify(data) +
              ": " + chrome.runtime.lastError.message
            );
          }
        });
      } else {
        // Show what went wrong
        statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
      }
    }
  };

  xhr.open("GET", getUrl, true);


  xhr.send();


  // Prepare the data to be POSTed by URLEncoding each field's contents

}

function accessUserInfo(){
  // Getting
  chrome.storage.local.get("user", function(data) {
    // Do something with data.key
    console.log("data", data);
  });
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    accessUserInfo();
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', saveUserInfo);
    // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in
        // our onPageDetailsReceived function as the callback. This injects
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });

    var button = document.getElementById('findSteps');



});
