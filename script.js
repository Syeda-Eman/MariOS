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


function initializeWindow(windowId, closeButtonId) {
  var win = document.getElementById(windowId);
  var closeBtn = document.getElementById(closeButtonId);

  win.addEventListener("mousedown", function() {
    handleWindowTap(win);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      closeWindow(win);
    });
  }

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

function setupAppLauncher(iconId, windowId) {
  var icon = document.getElementById(iconId);
  var win = document.getElementById(windowId);

  icon.addEventListener("click", function(e) {
    e.stopPropagation();
    if (icon.classList.contains("selected")) {
      openWindow(win);
      deselectIcon(icon);
    } else {
      if (selectedIcon) deselectIcon(selectedIcon);
      selectIcon(icon);
    }
  });
}

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


document.body.addEventListener("click", function() {
  if (selectedIcon) deselectIcon(selectedIcon);
});


setupAppLauncher("journalIcon", "journalApp");
setupAppLauncher("mapIcon", "mapApp");


document.querySelector("#welcomeopen").addEventListener("click", function() {
  openWindow(document.getElementById("mydiv"));
});

var content = [
  {
    title: "World 1-1 Log",
    date: "07/09/2026",
    content: `<h3>Entry: Peach's Castle</h3>
              <p>Welcome to my custom <strong>MariOS Journal</strong>!</p>
              <p>This whole workspace is responsive and dynamic.</p>`
  },
  {
    title: "Secret Warp Zone",
    date: "07/10/2026",
    content: `<h3>Entry: Code Exploration</h3>
              <p>Discovered that mapping layout logic into functions reduces duplicate code entirely!</p>`
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
    itemDiv.innerHTML = `<p><strong>${note.title}</strong></p><p style="font-size: 11px; color:#666;">${note.date}</p>`;
    itemDiv.addEventListener("click", function() { setNotesContent(index); });
    sidebar.appendChild(itemDiv);
  });
}

var mapData = {
  castle: {
    title: "Princess Peach's Castle",
    info: "The central hub of the Mushroom Kingdom. Current status: Safe and free from Bowser's clutches! 🏰",
    achievement: "⭐ Completed HTML Framework Modules."
  },
  lava: {
    title: "Bowser's Keep",
    info: "A hazardous volcanic sector filled with molten rock walls and fiery obstacles. Danger! 🔥",
    achievement: "🔥 Conquered complex JavaScript dragging functions!"
  },
  island: {
    title: "Yoshi's Island",
    info: "A lush, tropical zone filled with diverse biomes, fruit trees, and friendly dinosaurs. 🦖",
    achievement: "🍏 Assembled fully isolated and clean modular custom CSS styles."
  }
};

function showLocation(key) {
  var detailsDiv = document.getElementById("locationDetails");
  var location = mapData[key];
  detailsDiv.innerHTML = `
    <h3>${location.title}</h3>
    <p>${location.info}</p>
    <hr style="border: 0; border-top: 1px dashed #ccc; margin: 12px 0;">
    <p style="font-size: 13px; color: #b1000d;"><strong>Milestone Unlocked:</strong><br>${location.achievement}</p>
  `;
}


initializeWindow("mydiv", "welcomeclose");
initializeWindow("journalApp", "journalclose");
initializeWindow("mapApp", "mapclose");
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
