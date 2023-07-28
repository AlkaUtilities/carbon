document.addEventListener("DOMContentLoaded", () => {
    const logItems = document.querySelectorAll("#log");

    for (const logItem of logItems) {
        const log = logItem.getElementsByClassName("summary")[0];
        log.addEventListener("click", () => {
            // const $detail = document.getElementById(
            //     `log-detail-${log.dataset["id"]}`
            // );

            const $detail = log.nextElementSibling;

            $detail.classList.toggle("active");
        });
    }
});

/**
 * @param {string} user_id
 * @param {string} time
 * @param {string} operation
 * @param {string} description
 * @param {string} id
 */
function showDetail(user_id, time, operation, description, id) {
    const $dialog = document.getElementById("log-detail");
    const $user_id = document.getElementById("user-id");
    const $time = document.getElementById("time");
    const $operation = document.getElementById("operation");
    const $description = document.getElementById("description");
    const $id = document.getElementById("id");

    $user_id.innerText = user_id;
    $time.innerText = time;
    $operation.innerText = operation;
    $description.innerText = description;
    $id.innerText = id;

    $dialog.showModal();
}
