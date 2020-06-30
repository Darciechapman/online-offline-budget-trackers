let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneed = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true})
}

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.online) {
        checkDb();
    }
};

request.onerror = function (event) {
    console.log("event.target.errorCode")
};

function saveRecord(record) {

    const transaction = db.transaction(["pending"], "readwrite");

    const save = transaction.objectStore("pending");

    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "content-Type": "application/json",
                },
            }).then((response) => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");

                const save = transaction.objectStore("pending")

                save.clear();
            })
        }
    }
}

window.addEventListener("online", checkDatabase);