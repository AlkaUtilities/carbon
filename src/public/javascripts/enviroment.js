// const { io } = require("socket.io-client");

// const socket = io("http://localhost:3000/");

// socket.on("connect", () => {
//     console.log(`[SOCKET] Connected with id ${socket.id}`);
// });

// socket.on("performanceUpdate", (data) => {
//     // Memory
//     if (data?.memory?.used && data?.memory?.total) {
//         updateProgressBar("memory", data.memory.used, data.memory.total);
//     }

//     // CPU
//     if (data?.cpu) {
//         updateProgressBar("cpu", data.cpu, 100);
//     }

//     // Storage
//     // I dont think we need storage to be updated frequently
//     if (data?.storage?.used && data?.storage?.size) {
//         updateProgressBar("storage", data.storage.used, data.storage.size);
//     }
// });

function updateMemory(used, total) {
    const $memory = document.getElementById("memory");

    $memory.innerText = `${(used / (1024 * 1024 * 1024)).toFixed(2)} GB / ${(
        total /
        (1024 * 1024 * 1024)
    ).toFixed(2)} GB`;
}

/**
 * Updates a progress bar
 * @param {string} progressBarID ID of progress element
 * @param {float} current Current value
 * @param {float} max Maximum value
 * @param {float | number | undefined} low Value under low will be shown the normal color
 * @param {float | number | undefined} optinum Value on optinum and above will be shown the critical color
 * @returns
 */
function updateProgressBar(progressBarID, current, max) {
    const $progressBar = document.getElementById(progressBarID);
    const $percentage = document.getElementById(`${progressBarID}-percentage`);

    // Update the progress bar attributes
    $progressBar.value = current;
    $progressBar.max = max;

    // if (low) $progressBar.low = low;
    // if (optinum) $progressBar.low = optinum;

    // Gets percentage
    const percentage = (current / max) * 100;

    // Update the percentage
    $percentage.innerText = `${percentage.toFixed(2)}%`;
}
