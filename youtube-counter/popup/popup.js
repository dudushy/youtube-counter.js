// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
        document.body.style.backgroundColor = color;
    });

    chrome.storage.sync.get("watchedVideos", ({ watchedVideos }) => {
        console.log("before", watchedVideos);
        // console.log(window.location.toString());

        // watchedVideos['crrUrl'] = window.location.toString();
        // watchedVideos['test'] = watchedVideos['test'] + 1;

        const url = window.location.toString();

        if (watchedVideos[url]) {
            watchedVideos[url] = watchedVideos[url] + 1;
        } else {
            Object.assign(watchedVideos, {
                [url]: 1
            });
        }

        console.log("after", watchedVideos);

        chrome.storage.sync.set({ watchedVideos });
    });
}
