// Live Clock Engine
function syncSystemClockEngine() {
    const timeElement = document.getElementById('os-live-clock');
    const widgetTime = document.getElementById('widget-time-string');
    const widgetDate = document.getElementById('widget-date-tag');
    const widgetDay = document.getElementById('widget-day-string');

    if (!timeElement) return;

    const current = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let hours = current.getHours();
    const minutes = String(current.getMinutes()).padStart(2, '0');
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const hoursString = String(hours).padStart(2, '0');

    const topBarString = `${shortDays[current.getDay()]}, ${months[current.getMonth()]} ${current.getDate()} ${hours}:${minutes} ${meridiem}`;
    const widgetTimeString = `${hoursString}:${minutes}`;
    const widgetDateString = `${months[current.getMonth()].toUpperCase()} ${current.getDate()}`;

    timeElement.textContent = topBarString;
    if(widgetTime) widgetTime.textContent = widgetTimeString;
    if(widgetDate) widgetDate.textContent = widgetDateString;
    if(widgetDay) widgetDay.textContent = fullDays[current.getDay()];
}

// Wallpaper Manager
function updateWallpaper(imagePath) {
    const backgroundLayer = document.getElementById('active-bg');
    if (backgroundLayer) {
        backgroundLayer.src = imagePath;
    }
    
    document.querySelectorAll('.thumbnail-item').forEach(thumb => {
        thumb.classList.remove('active');
        if(thumb.querySelector('img') && thumb.querySelector('img').getAttribute('src') === imagePath) {
            thumb.classList.add('active');
        }
    });
}

function applyCustomWallpaperUrl() {
    const urlInput = document.getElementById('custom-wallpaper-url');
    if (urlInput && urlInput.value.trim() !== '') {
        updateWallpaper(urlInput.value.trim());
        urlInput.value = '';
    }
}

// Dynamic Accent Color Switcher
function setAccentColor(colorHex, element) {
    document.documentElement.style.setProperty('--accent-color', colorHex);
    
    document.querySelectorAll('.color-swatch-circle').forEach(swatch => {
        swatch.classList.remove('picked');
    });
    if (element) {
        element.classList.add('picked');
    }
}

// Global Window Controller System
function toggleWindow(windowId, shouldShow) {
    const win = document.getElementById(windowId);
    const dockIndicator = document.getElementById(`dock-${windowId}`);
    
    if (win) {
        win.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            document.querySelectorAll('.window').forEach(w => w.style.zIndex = "1000");
            win.style.zIndex = "1010";
            if (dockIndicator) dockIndicator.classList.add('process-active');
        } else {
            if (dockIndicator) dockIndicator.classList.remove('process-active');
        }
    }
}

// Interactive Journal Application Data & Logic
let journalEntries = [
    {
        id: 1,
        title: "Discovered Warp Pipe 1-2",
        content: "Found a secret shortcut underneath the brick block structure today!",
        date: "Jul 20, 2026"
    }
];
let editingEntryId = null;

function renderJournalEntries() {
    const listContainer = document.getElementById('journal-entries-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (journalEntries.length === 0) {
        listContainer.innerHTML = '<p style="font-size:12px; color:rgba(255,255,255,0.4); text-align:center; padding:15px;">No journal entries yet.</p>';
        return;
    }

    journalEntries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'journal-card';
        card.innerHTML = `
            <div class="journal-card-header">
                <span class="journal-card-title">${escapeHtml(entry.title)}</span>
                <div class="journal-card-actions">
                    <button class="journal-action-btn" onclick="editJournalEntry(${entry.id})" title="Edit">✏️</button>
                    <button class="journal-action-btn" onclick="deleteJournalEntry(${entry.id})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="journal-card-body">${escapeHtml(entry.content)}</div>
            <div class="journal-card-date">${entry.date}</div>
        `;
        listContainer.appendChild(card);
    });
}

function saveJournalEntry() {
    const titleInput = document.getElementById('journal-title-input');
    const contentInput = document.getElementById('journal-content-input');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert('Please provide both a title and content for your entry.');
        return;
    }

    const currentDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (editingEntryId !== null) {
        const index = journalEntries.findIndex(e => e.id === editingEntryId);
        if (index !== -1) {
            journalEntries[index].title = title;
            journalEntries[index].content = content;
            journalEntries[index].date = currentDateStr + " (edited)";
        }
    } else {
        const newEntry = {
            id: Date.now(),
            title: title,
            content: content,
            date: currentDateStr
        };
        journalEntries.unshift(newEntry);
    }

    resetJournalForm();
    renderJournalEntries();
}

function editJournalEntry(id) {
    const entry = journalEntries.find(e => e.id === id);
    if (!entry) return;

    document.getElementById('journal-title-input').value = entry.title;
    document.getElementById('journal-content-input').value = entry.content;
    document.getElementById('journal-save-btn').textContent = "Update Entry";
    document.getElementById('journal-cancel-btn').style.display = "inline-block";
    
    editingEntryId = id;
}

function deleteJournalEntry(id) {
    journalEntries = journalEntries.filter(e => e.id !== id);
    if (editingEntryId === id) {
        resetJournalForm();
    }
    renderJournalEntries();
}

function cancelJournalEdit() {
    resetJournalForm();
}

function resetJournalForm() {
    document.getElementById('journal-title-input').value = '';
    document.getElementById('journal-content-input').value = '';
    document.getElementById('journal-save-btn').textContent = "Save Entry";
    document.getElementById('journal-cancel-btn').style.display = "none";
    editingEntryId = null;
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
}

// Drag & Drop Window Mechanics
function initializeWindowPhysics() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(win => {
        const header = win.querySelector('.windowheader');
        if (!header) return;
        
        let isDragging = false;
        let currentX = 0, currentY = 0, initialX = 0, initialY = 0;
        let transformMatrix = { x: 0, y: 0 };

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.classList.contains('control-dot')) return;
            
            initialX = e.clientX - transformMatrix.x;
            initialY = e.clientY - transformMatrix.y;
            
            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                document.querySelectorAll('.window').forEach(w => w.style.zIndex = "1000");
                win.style.zIndex = "1010";
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                transformMatrix.x = currentX;
                transformMatrix.y = currentY;
                win.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    });
}

// System Boot Initialization
document.addEventListener("DOMContentLoaded", () => {
    syncSystemClockEngine();
    setInterval(syncSystemClockEngine, 1000);
    initializeWindowPhysics();
    renderJournalEntries();

    // Position initial windows naturally across desktop
    const windowOffsets = [
        { id: 'about-window', top: '15%', left: '28%' },
        { id: 'journal-window', top: '18%', left: '32%' },
        { id: 'settings-window', top: '14%', left: '30%' }
    ];

    windowOffsets.forEach(cfg => {
        const win = document.getElementById(cfg.id);
        if (win) {
            win.style.top = cfg.top;
            win.style.left = cfg.left;
        }
    });
});
