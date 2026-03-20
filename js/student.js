// ======================================
// STUDENT DASHBOARD SCRIPT
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const materials = JSON.parse(localStorage.getItem("materials")) || [];

    // ======================================
    // PAGE PROTECTION
    // ======================================
    if (!currentUser || !currentUser.role || currentUser.role.toLowerCase() !== "student") {
        window.location.href = "login.html";
        return;
    }

    // ======================================
    // PROFILE DISPLAY (SAFE)
    // ======================================
    document.getElementById("profileName").innerText =
        currentUser.username || "-";

    document.getElementById("profileBranch").innerText =
        currentUser.branch || "-";

    document.getElementById("profileYear").innerText =
        currentUser.year || "-";

    document.getElementById("profileSem").innerText =
        currentUser.sem || "-";


    // ======================================
    // RENDER TABLE FUNCTION
    // ======================================
    function renderTable() {

        const searchInput = document.getElementById("search");
        const sortInput = document.getElementById("sort");
        const tableBody = document.getElementById("tableBody");

        if (!searchInput || !sortInput || !tableBody) return;

        const searchValue = searchInput.value.toLowerCase();
        const sortValue = sortInput.value;

        let filtered = materials.filter(m => {

            if (!m || !m.branch || !m.year || !m.sem || !m.title) {
                return false;
            }

            let studentYear = parseInt(currentUser.year);
            let studentSem = parseInt(currentUser.sem);

            let materialYear = parseInt(m.year);
            let materialSem = parseInt(m.sem);

            return (
                m.branch === currentUser.branch &&
                (
                    materialYear < studentYear ||
                    (materialYear === studentYear && materialSem <= studentSem)
                ) &&
                m.title.toLowerCase().includes(searchValue)
            );
        });

        // ================= SORTING =================
        if (sortValue === "year") {
            filtered.sort((a, b) =>
                parseInt(a.year) - parseInt(b.year)
            );
        }

        if (sortValue === "branch") {
            filtered.sort((a, b) =>
                a.branch.localeCompare(b.branch)
            );
        }

        if (sortValue === "az") {
            filtered.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
        }

        // ================= TABLE RENDER =================
        tableBody.innerHTML = "";

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        No materials available
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(material => {
            tableBody.innerHTML += `
                <tr>
                    <td>${material.title}</td>
                    <td>${material.year}</td>
                    <td>${material.sem}</td>
                    <td>${material.branch}</td>
                    <td>
                        <button onclick="openPDF('${material.file}')">
                            View
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    // ======================================
    // EVENT LISTENERS
    // ======================================
    document.getElementById("search").addEventListener("keyup", renderTable);
    document.getElementById("sort").addEventListener("change", renderTable);

    // Initial load
    renderTable();

});


// ======================================
// OPEN PDF
// ======================================
function openPDF(base64Data, title) {

    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const newWindow = window.open(blobUrl, "_blank");

    // Set title properly
    if (newWindow) {
        newWindow.document.title = title + ".pdf";
    }
}


// ======================================
// SECTION SWITCH
// ======================================
function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.add("hidden");
    });

    const selected = document.getElementById(id);
    if (selected) selected.classList.remove("hidden");
}


// ======================================
// SIDEBAR TOGGLE
// ======================================
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.classList.toggle("collapsed");
    }
}


// ======================================
// DARK MODE
// ======================================
function toggleMode() {
    document.body.classList.toggle("dark");
}


// ======================================
// LOGOUT
// ======================================
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}