let updateStatusTimeout;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preferences");

    form.addEventListener("submit", (e) => {
        const formData = new FormData(form);

        console.log();

        const data = {
            Preferences: {
                Timezone: formData.get("timezone"),
                ShowDebugInfo:
                    formData.get("showdebuginfo") !== null ? true : false,
            },
        };

        updateStatus("Saving...", false);
        fetch("/dashboard/user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                if (!res.ok) {
                    console.log(await res.json());
                    const error = new Error(res.statusText);
                    error.status = res.status;
                    throw error;
                }
            })
            .then(() => updateStatus("Saved", true))
            .catch((err) =>
                updateStatus(
                    `Error: ${err.message} (${err.status}). Check console for more info`,
                    true,
                    true
                )
            );

        e.preventDefault();
    });
});

/**
 *
 * @param {string} message
 * @param {boolean | undefined} timeout
 * @param {boolean | undefined} error
 */
function updateStatus(message, timeout = true, error = false) {
    const $status = document.getElementById("status");

    $status.classList.add("active");

    if (error) {
        $status.classList.add("error");
    } else {
        $status.classList.remove("error");
    }

    $status.innerText = message;

    if (timeout) {
        updateStatusTimeout = undefined;
        updateStatusTimeout = setTimeout(() => {
            $status.classList.remove("active");
            $status.classList.remove("error");
        }, 4000);
    }
}
