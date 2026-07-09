function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#timeElement");
  if (timeText) { 
    timeText.innerHTML = currentTime;
  }
}
updateTime(); 
setInterval(updateTime, 1000);

var biggestIndex = 1;
var topBar = document.querySelector("#top");

function initializeWindow(windowId) {
  var win = document.getElementById(windowId);
  win.addEventListener("mousedown", function() {
    handleWindowTap(win);
  });
  dragElement(win);
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (topBar) {
    topBar.style.zIndex = biggestIndex + 1;
  }
  if (selectedIcon) {
    deselectIcon(selectedIcon);
  }
}

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (topBar) {
    topBar.style.zIndex = biggestIndex + 1;
  }
}

function closeWindow(element) {
  element.style.display = "none";
}

var selectedIcon = undefined;
var journalIcon = document.querySelector("#journalIcon");

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
    selectedIcon = undefined;
  }
}

journalIcon.addEventListener("click", function(e) {
  e.stopPropagation(); 
  if (journalIcon.classList.contains("selected")) {
    openWindow(document.getElementById("journalApp"));
    deselectIcon(journalIcon);
  } else {
    if (selectedIcon) deselectIcon(selectedIcon);
    selectIcon(journalIcon);
  }
});


document.body.addEventListener("click", function() {
  if (selectedIcon) deselectIcon(selectedIcon);
});


var content = [
  {
    title: "World 1-1 Log",
    date: "07/09/2026",
    content: `<h3>Entry: Peach's Castle</h3>
              <p>Welcome to my custom <strong>MariOS Journal</strong>!</p>
              <p>This whole workspace is completely responsive. I can change views dynamically using pure arrays.</p>`
  },
  {
    title: "Secret Warp Zone",
    date: "07/10/2026",
    content: `<h3>Entry: Code Exploration</h3>
              <p>Discovered something amazing today while building: <code>flex-direction: row</code> perfectly handles sidebars inside applications!</p>`
  }
];

function setNotesContent(index) {
  var viewer = document.querySelector("#notebookContent");
  viewer.innerHTML = content[index].content;
}

function populateSidebar() {
  var sidebar = document.querySelector("#sidebar");
  sidebar.innerHTML = ""; 

  content.forEach(function(note, index) {
    var itemDiv = document.createElement("div");
    itemDiv.classList.add("sidebar-item");
    itemDiv.innerHTML = `
      <p><strong>${note.title}</strong></p>
      <p style="font-size: 11px; color:#666;">${note.date}</p>
    `;
    itemDiv.addEventListener("click", function() {
      setNotesContent(index);
    });
    sidebar.appendChild(itemDiv);
  });
}

var welcomeScreen = document.querySelector("#mydiv");
var journalScreen = document.querySelector("#journalApp");

document.querySelector("#welcomeclose").addEventListener("click", function() { closeWindow(welcomeScreen); });
document.querySelector("#welcomeopen").addEventListener("click", function() { openWindow(welcomeScreen); });
document.querySelector("#journalclose").addEventListener("click", function() { closeWindow(journalScreen); });


initializeWindow("mydiv");
initializeWindow("journalApp");
populateSidebar();

function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var header = document.getElementById(element.id + "header");

  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragElementMove;
  }

  function dragElementMove(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    
    var computedTop = element.offsetTop - currentY;
    

    if (computedTop < 45) {
      computedTop = 45;
    }

    element.style.top = computedTop + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
