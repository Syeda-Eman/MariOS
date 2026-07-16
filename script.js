function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#timeElement");
  if (timeText) timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);
updateTime();

var biggestIndex = 10;

function makeActive(windowElement) {
  biggestIndex++;
  windowElement.style.zIndex = biggestIndex;
}

// === NEW DRAGGING ENGINE FOR WINDOW HEADERS ===
document.querySelectorAll(".window").forEach(windowEl => {
  windowEl.addEventListener("mousedown", () => {
    makeActive(windowEl);
  });

  const header = windowEl.querySelector(".windowheader");
  if (header) {
    header.style.cursor = "move";

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.addEventListener("mousedown", (e) => {
      // FIX: Ignore dragging completely if clicking ANY control dots or buttons inside the header
      if (
        e.target.classList.contains("closebutton") || 
        e.target.classList.contains("control-dot") || 
        e.target.closest(".control-dot")
      ) {
        return; 
      }

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = windowEl.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      header.style.cursor = "grabbing";

      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);
    });

    function dragMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      windowEl.style.left = (initialLeft + dx) + "px";
      windowEl.style.top = (initialTop + dy) + "px";
    }

    function dragEnd() {
      isDragging = false;
      header.style.cursor = "move";
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
    }
  }
});

// === APP 1: WELCOME SCREEN ===
const welcomeScreen = document.querySelector("#welcome");
const welcomeOpen = document.querySelector("#welcomeopen");
const welcomeClose = document.querySelector("#welcomeclose");

welcomeOpen.addEventListener("click", () => {
  welcomeScreen.style.display = "flex";
  makeActive(welcomeScreen);
});

welcomeClose.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
});

// === APP 2: JOURNAL ===
const journalApp = document.querySelector("#journalApp");
const journalIcon = document.querySelector("#journalIcon");
const journalClose = document.querySelector("#journalClose");
const journalSidebar = document.querySelector("#journalSidebar");
const journalContentArea = document.querySelector("#journalContentArea");

journalIcon.addEventListener("click", () => {
  journalApp.style.display = "block";
  makeActive(journalApp);
});

journalClose.addEventListener("click", () => {
  journalApp.style.display = "none";
});

var journalData = [
  {
    title: "World 1-1 Log",
    date: "07/09/2026",
    content: `<h3>Entry: Peach's Castle</h3>
              <p>Welcome to my custom <strong>MariOS Journal</strong>!</p>
              <p>This whole workspace is responsive, modular, and dynamic.</p>
              <p>Current status: Safe and free from Bowser's clutches! 🏰</p>`
  },
  {
    title: "Secret Warp Zone",
    date: "07/10/2026",
    content: `<h3>Entry: Code Exploration</h3>
              <p>Discovered that mapping layout logic into functions reduces duplicate code entirely!</p>
              <p>Conquered complex dragging engines successfully. 🔥</p>`
  }
];

function loadJournal() {
  journalSidebar.innerHTML = "";
  journalData.forEach((log, index) => {
    const item = document.createElement("div");
    item.className = "sidebaritem";
    item.innerHTML = `<strong style="font-size: 13px;">${log.title}</strong><br><span style="font-size: 10px; color: #888;">${log.date}</span>`;
     
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll("#journalSidebar > .sidebaritem").forEach(el => {
        el.classList.remove("selected");
      });
      item.classList.add("selected");
      journalContentArea.innerHTML = log.content;
    });

    journalSidebar.appendChild(item);
  });
}
loadJournal();

// === APP 3: THEMES ===
const themeWindow = document.querySelector("#themeWindow");
const themeIcon = document.querySelector("#themeIcon");
const themeClose = document.querySelector("#themeClose");

themeIcon.addEventListener("click", () => {
  themeWindow.style.display = "block";
  makeActive(themeWindow);
});

themeClose.addEventListener("click", () => {
  themeWindow.style.display = "none";
});

const bgImage = document.getElementById("bgImage");
const bgVideo = document.getElementById("bgVideo");

function changeBackground(type, url) {
  if (type === "image") {
    bgVideo.style.display = "none";
    bgVideo.pause();
    bgImage.style.display = "block";
    bgImage.src = url;
  } else if (type === "video") {
    bgImage.style.display = "none";
    bgVideo.style.display = "block";
    bgVideo.src = url;
    bgVideo.load();
    bgVideo.play().catch(err => {
      console.log("Video auto-play blocked: ", err);
    });
  }
}

// === WELCOME SHORTCUT BUTTON ACTIONS ===
const welcomeJournalBtn = document.querySelector("#welcomeOpenJournal");
const welcomeThemesBtn = document.querySelector("#welcomeOpenThemes");

if (welcomeJournalBtn) {
  welcomeJournalBtn.addEventListener("click", () => {
    const journalApp = document.querySelector("#journalApp");
    if (journalApp) {
      journalApp.style.display = "block";
      makeActive(journalApp);
    }
  });
}

if (welcomeThemesBtn) {
  welcomeThemesBtn.addEventListener("click", () => {
    const themeWindow = document.querySelector("#themeWindow");
    if (themeWindow) {
      themeWindow.style.display = "block";
      makeActive(themeWindow);
    }
  });
}

// Add tiny hover effects to the welcome pill buttons
document.querySelectorAll("#welcomeOpenJournal, #welcomeOpenThemes").forEach(btn => {
  btn.addEventListener("mouseenter", () => btn.style.background = "rgba(255, 255, 255, 0.25)");
  btn.addEventListener("mouseleave", () => btn.style.background = "rgba(255, 255, 255, 0.15)");
  btn.addEventListener("mousedown", () => btn.style.transform = "scale(0.97)");
  btn.addEventListener("mouseup", () => btn.style.transform = "scale(1)");
});

// === INTERACTIVE SYSTEM WINDOW CONTROLS ===
const welcomeWin = document.querySelector("#welcome");
const closeBtn = document.querySelector("#welcomeclose");
const minimizeBtn = document.querySelector("#welcomeminimize");
const maximizeBtn = document.querySelector("#welcomemaximize");

// Red Dot: Close Window
closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation(); 
  welcomeWin.style.display = "none";
});

// Yellow Dot: Minimize (Smooth scale down animation)
let isMinimized = false;
minimizeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation(); 
  
  if (!isMinimized) {
    welcomeWin.style.transform = "scale(0.01)";
    welcomeWin.style.opacity = "0";
    isMinimized = true;
    
    // Completely hide display after animation finishes (250ms matches CSS transition)
    setTimeout(() => { 
      if (isMinimized) { 
        welcomeWin.style.display = "none"; 
      }
    }, 250);
  }
});

// Restore Window Action when clicking Open/Desktop shortcuts
const desktopWelcomeOpen = document.querySelector("#welcomeopen") || document.querySelector("#welcomeIcon");
if (desktopWelcomeOpen) {
  desktopWelcomeOpen.addEventListener("click", (e) => {
    e.preventDefault();
    welcomeWin.style.display = "flex";
    
    // Reset transform & scale back up gracefully
    setTimeout(() => {
      welcomeWin.style.transform = "scale(1)";
      welcomeWin.style.opacity = "1";
    }, 10);
    
    isMinimized = false;
    makeActive(welcomeWin);
  });
}

// Green Dot: Maximize / Restore Toggle
let isMaximized = false;
let originalPosition = {};

maximizeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation(); 
  
  if (!isMaximized) {
    // Store original size coordinates
    originalPosition.top = welcomeWin.style.top;
    originalPosition.left = welcomeWin.style.left;
    originalPosition.width = welcomeWin.style.width;
    originalPosition.height = welcomeWin.style.height;

    // Set to Fullscreen state
    welcomeWin.style.top = "60px";
    welcomeWin.style.left = "20px";
    welcomeWin.style.width = "calc(100vw - 40px)";
    welcomeWin.style.height = "calc(100vh - 120px)";
    welcomeWin.style.transform = "scale(1)";
  } else {
    // Restore original size
    welcomeWin.style.top = originalPosition.top || "calc(50% - 250px)";
    welcomeWin.style.left = originalPosition.left || "calc(50% - 225px)";
    welcomeWin.style.width = originalPosition.width || "450px";
    welcomeWin.style.height = originalPosition.height || "auto";
  }
  isMaximized = !isMaximized;
});

// === SETTINGS WINDOW CONTROLS (Close, Minimize, Maximize) ===
const themeWin = document.querySelector("#themeWindow");
const themeCloseBtn = document.querySelector("#themeClose");
const themeMinBtn = document.querySelector("#thememinimize");
const themeMaxBtn = document.querySelector("#thememaximize");

let isThemeMinimized = false;
let isThemeMaximized = false;
let originalThemePosition = {};

// Close Settings
if (themeCloseBtn) {
  themeCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    themeWin.style.display = "none";
  });
}

// Minimize Settings (Smooth scale scale-down)
if (themeMinBtn) {
  themeMinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isThemeMinimized) {
      themeWin.style.transform = "scale(0.01)";
      themeWin.style.opacity = "0";
      isThemeMinimized = true;
      setTimeout(() => {
        if (isThemeMinimized) themeWin.style.display = "none";
      }, 250);
    }
  });
}

// Intercept desktop icon to restore minimize gracefully
const themeOpenTrigger = document.querySelector("#themeIcon") || document.querySelector("#welcomeOpenThemes");
if (themeOpenTrigger) {
  themeOpenTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    themeWin.style.display = "flex";
    setTimeout(() => {
      themeWin.style.transform = "scale(1)";
      themeWin.style.opacity = "1";
    }, 10);
    isThemeMinimized = false;
    makeActive(themeWin);
  });
}

// Maximize/Restore Toggle
if (themeMaxBtn) {
  themeMaxBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isThemeMaximized) {
      originalThemePosition.top = themeWin.style.top;
      originalThemePosition.left = themeWin.style.left;
      originalThemePosition.width = themeWin.style.width;
      originalThemePosition.height = themeWin.style.height;

      themeWin.style.top = "60px";
      themeWin.style.left = "20px";
      themeWin.style.width = "calc(100vw - 40px)";
      themeWin.style.height = "calc(100vh - 120px)";
    } else {
      themeWin.style.top = originalThemePosition.top || "calc(50% - 240px)";
      themeWin.style.left = originalThemePosition.left || "calc(50% - 250px)";
      themeWin.style.width = originalThemePosition.width || "500px";
      themeWin.style.height = originalThemePosition.height || "480px";
    }
    isThemeMaximized = !isThemeMaximized;
  });
}

// === FILE UPLOADER & GRADIENT INTERACTION FOR THEMES ===
const fileBtn = document.querySelector("#uploadWallpaperFile");
const hiddenInput = document.querySelector("#hiddenFileInput");
const urlInput = document.querySelector("#wallpaperUrlInput");
const applyUrlBtn = document.querySelector("#applyUrlWallpaper");

if (fileBtn && hiddenInput) {
  fileBtn.addEventListener("click", () => hiddenInput.click());
  hiddenInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      if (file.type.startsWith("image/")) {
        changeBackground("image", objectURL);
      } else if (file.type.startsWith("video/")) {
        changeBackground("video", objectURL);
      }
    }
  });
}

if (applyUrlBtn && urlInput) {
  applyUrlBtn.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (url) {
      if (url.endsWith(".mp4") || url.endsWith(".webm")) {
        changeBackground("video", url);
      } else {
        changeBackground("image", url);
      }
    }
  });
}

// Handle Accent Color selection ring indicators
document.querySelectorAll(".color-swatch").forEach(swatch => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".color-swatch").forEach(s => s.style.borderColor = "transparent");
    swatch.style.borderColor = "#fff";
    
    // Change accent color on buttons or status bars
    const themeColor = swatch.getAttribute("data-color");
    const activeHeader = document.querySelector(".headertext");
    if (activeHeader) activeHeader.style.color = themeColor;
  });
});

// Gradient Preset picker handles
document.querySelectorAll(".gradient-preset").forEach(preset => {
  preset.addEventListener("click", () => {
    const bgImage = document.getElementById("bgImage");
    const bgVideo = document.getElementById("bgVideo");
    bgVideo.style.display = "none";
    bgVideo.pause();
    bgImage.style.display = "block";
    bgImage.src = ""; // remove standard background source
    bgImage.style.background = preset.style.background;
  });
});
