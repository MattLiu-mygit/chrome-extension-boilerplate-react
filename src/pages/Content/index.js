import html2canvas from 'html2canvas';
import resemble from 'resemblejs';

let snapshot = null;
let blurred = false;
let data = null;

function onBlur() {
  blurred = true;
}

// When clicked on focus, this must only be after screen is blurred.
function onFocus() {
  const screenshotTarget = document.body;
  if (blurred) {
    html2canvas(screenshotTarget)
      .then((canvas) => {
        let current = canvas.toDataURL('image/png');
        blurred = false;
        getDiff(current);
      })
      .catch((err) => console.log('issue with html2canvas', err));
  }
}

window.onfocus = onFocus;
window.onblur = onBlur;

// Takes a snapshot of the page every half second.
const getSnapshot = () => {
  if (!blurred) {
    // Only take snapshots when not blurred
    const screenshotTarget = document.body;
    html2canvas(screenshotTarget)
      .then((canvas) => {
        snapshot = canvas.toDataURL('image/png');
        setTimeout(() => getSnapshot(), 500);
      })
      .catch((err) => console.log('issue with html2canvas', err));
  }
};

// Uses resemble to take a snapshot and then appends it to the document body.
function getDiff(current) {
  resemble.outputSettings({
    errorColor: {
      red: 255,
      green: 0,
      blue: 0,
    },
    errorType: 'movement',
    transparency: 0,
    largeImageThreshold: 1200,
    useCrossOrigin: false,
    outputDiff: true,
  });
  resemble(snapshot)
    .compareTo(current)
    .onComplete(async function (respData) {
      const dataUrl = await respData.getImageDataUrl();
      data = respData;

      const img =
        document.getElementById('change_overlay') === null
          ? document.createElement('img')
          : document.getElementById('change_overlay');
      img.src = dataUrl;
      img.style.position = 'absolute';
      img.style.width = '100%';
      img.style.top = 0;
      img.style.left = 0;
      img.id = 'change_overlay';
      img.style.pointerEvents = 'none';
      chrome.runtime.sendMessage({
        message: 'data',
        data: data.misMatchPercentage,
      });
      document.body.appendChild(img);

      getSnapshot();
    });
}
getSnapshot();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'start') {
    if (document.getElementById('change_overlay') !== null && data !== null) {
      chrome.runtime.sendMessage({
        message: 'data',
        data: data.misMatchPercentage,
      });
    }
  } else if (request.message === 'clear') {
    data = null;
    document.getElementById('change_overlay').src = null;
    chrome.runtime.sendMessage({
      message: 'data',
      data: 0,
    });
  }
});
