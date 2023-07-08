/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById('canvas');
const guide = document.getElementById('guide');
const colorInput = document.getElementById('colorInput');
const toggleGuide = document.getElementById('toggleGuide');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('download');
const drawingContext = canvas.getContext('2d'); //ctx

const cellSideCount = 10;
const cellPixelLength = canvas.width / cellSideCount;
const colorHistory = {};

// Set default color
colorInput.value = '#000000';

// Initialize the canvas background
function setDefaultCanvas() {
    // For a set background color (background is transparent by default)
    //drawingContext.fillStyle = '#ffffff';
    //drawingContext.fillRect(0, 0, canvas.width, canvas.height);
    drawingContext.clearRect(0, 0, canvas.width, canvas.height);
}
setDefaultCanvas();

// Setup guide
guide.style.width = `${canvas.width}px`;
guide.style.height = `${canvas.height}px`;
guide.style.gridTemplateColumns = `repeat(${cellSideCount}, 1fr)`;
guide.style.gridTemplateRows = `repeat(${cellSideCount}, 1fr)`;

[...Array(cellSideCount ** 2)].forEach(() =>
    guide.insertAdjacentHTML('beforeend', '<div></div>')
);

// Handle user clicking on canvas
function handleCanvasClick(e) {
    // Ensure user is using primary mouse btn
    if (e.button !== 0) {
        return;
    }

    // Get info about where the user has clicked on the canvas
    const canvasBoundingRect = canvas.getBoundingClientRect();
    // Set the X and Y locations
    const x = e.clientX - canvasBoundingRect.left;
    const y = e.clientY - canvasBoundingRect.top;
    // Return the largest integer of X and Y
    const cellX = Math.floor(x / cellPixelLength);
    const cellY = Math.floor(y / cellPixelLength);

    // If user holds down control key while clicking canvas, set colorInput to color of cell clicked on
    const currentColor = colorHistory[`${cellX}_${cellY}`];
    if (e.ctrlKey) {
        if (currentColor) {
            colorInput.value = currentColor;
        } else {
            //fillCell(cellX, cellY);
            return;
        }
    }

    // Use the floored X and Y numbers as the location to be painted
    fillCell(cellX, cellY);
}

// If control key is held down, change class of canvas to change the cursor
function ctrlHandler(e) {
    ctrl = e.ctrlKey;
    if (ctrl) {
        canvas.classList.add('eyedropper');
    } else {
        canvas.classList.remove('eyedropper');
    }
}
window.addEventListener('keydown', ctrlHandler, false);
window.addEventListener('keyup', ctrlHandler, false);
/*canvas.addEventListener('mouseover', function (e) {
    ctrl = e.ctrlKey;
    if (ctrl) {
        canvas.classList.add('eyedropper');
    } else {
        canvas.classList.remove('eyedropper');
    }
});*/

function handleClearBtnClick() {
    const yes = confirm('Are you sure you wish to clear the canvas?');

    if (!yes) {
        return;
    }

    setDefaultCanvas();
}

function handleToggleGuideChange() {
    guide.style.display = toggleGuide.checked ? null : 'none';
}

function fillCell(cellX, cellY) {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    drawingContext.fillStyle = colorInput.value;
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
    colorHistory[`${cellX}_${cellY}`] = colorInput.value;
}

// Download canvas as image
downloadBtn.addEventListener('click', function () {
    // Convert canvas to a data URL
    let canvasUrl = canvas.toDataURL();

    // Create an anchor, and set the href value to the data URL
    const createAnchor = document.createElement('a');
    createAnchor.href = canvasUrl;

    // Set name of downloaded file
    createAnchor.download = 'pixel-painter-download';

    // Click the download button, causing a download, and then remove it
    createAnchor.click();
    createAnchor.remove();
});

canvas.addEventListener('mousedown', handleCanvasClick);
clearBtn.addEventListener('click', handleClearBtnClick);
toggleGuide.addEventListener('change', handleToggleGuideChange);
