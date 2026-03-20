// ================= GLOBAL DATA =================

// Get logged-in user properly (FIXED)
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Get materials
let materials = JSON.parse(localStorage.getItem("materials")) || [];


// ================= ON PAGE LOAD =================
window.onload = function () {

    // If no user logged in → redirect
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Show only username (FIXED)
    document.getElementById("profileName").innerText =
        currentUser.username;

    updateUploadCount();
    renderTable();
};


// ================= SECTION SWITCH =================
function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
}


// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
}


// ================= DARK MODE =================
function toggleMode() {
    document.body.classList.toggle("dark");
}


// ================= ADD MATERIAL =================
function addMaterial() {

    const year = document.getElementById("year").value;
    const sem = document.getElementById("sem").value;
    const branch = document.getElementById("branch").value;
    const title = document.getElementById("title").value;
    const fileInput = document.getElementById("pdfFile");

    if (!year || !sem || !branch || !title || fileInput.files.length === 0) {
        alert("Please fill all fields");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {

        const base64File = e.target.result;

        materials.push({
            title: title,
            year: year,
            sem: sem,
            branch: branch,
            date: new Date().toLocaleString(),
            file: base64File
        });

        localStorage.setItem("materials", JSON.stringify(materials));

        document.getElementById("uploadMsg").innerText =
            "Material Uploaded Successfully!";

        clearForm();
        updateUploadCount();
        renderTable();
    };

    reader.readAsDataURL(file);
}


// ================= CLEAR FORM =================
function clearForm() {
    document.getElementById("year").value = "";
    document.getElementById("sem").value = "";
    document.getElementById("branch").value = "";
    document.getElementById("title").value = "";
    document.getElementById("pdfFile").value = "";
}


// ================= UPDATE UPLOAD COUNT =================
function updateUploadCount() {
    document.getElementById("uploadCount").innerText =
        materials.length;
}


// ================= RENDER TABLE =================
function renderTable() {

    const tableBody = document.getElementById("tableBody");
    const search = document.getElementById("search").value.toLowerCase();
    const sortValue = document.getElementById("sort").value;

    tableBody.innerHTML = "";

    let filtered = materials.filter(item =>
        item.title.toLowerCase().includes(search)
    );

    // ===== SORTING =====
    if (sortValue === "year") {
    filtered.sort((a, b) => parseInt(a.year) - parseInt(b.year));
}
    else if (sortValue === "branch") {
        filtered.sort((a, b) => a.branch.localeCompare(b.branch));
    }
    else if (sortValue === "date") {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    else if (sortValue === "az") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    // ===== DISPLAY TABLE =====
    filtered.forEach((item, index) => {

        tableBody.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td>${item.year}</td>
                <td>${item.sem}</td>
                <td>${item.branch}</td>
                <td>${item.date}</td>
                <td>
                    <button class="view-btn"
                        onclick="viewPDF('${item.file}')">
                        View
                    </button>
                </td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteMaterial(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// ================= VIEW PDF =================
function viewPDF(fileData) {

    // Open in new tab
    const newWindow = window.open();

    newWindow.document.write(`
        <html>
        <head>
            <title>PDF Viewer</title>
            <style>
                body{
                    margin:0;
                    background:#f4f6f9;
                }
                iframe{
                    width:100%;
                    height:100vh;
                    border:none;
                }
            </style>
        </head>
        <body>
            <iframe src="${fileData}"></iframe>
        </body>
        </html>
    `);
}


// ================= CLOSE PDF =================
function closePDF() {

    const modal = document.getElementById("pdfModal");
    const frame = document.getElementById("pdfFrame");

    frame.src = "";
    modal.classList.add("hidden");
}


// ================= DELETE MATERIAL =================
function deleteMaterial(index) {

    if (confirm("Are you sure you want to delete this material?")) {

        materials.splice(index, 1);
        localStorage.setItem("materials", JSON.stringify(materials));

        updateUploadCount();
        renderTable();
    }
}


// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}