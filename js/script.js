let users = JSON.parse(localStorage.getItem("users")) || [];
let selectedRole = "";

/* REGISTER ROLE */
function selectRole(role){
    selectedRole = role;
    document.getElementById("studentFields").classList.toggle("hidden", role !== "student");
}

/* REGISTER */
document.getElementById("registerForm")?.addEventListener("submit", function(e){
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){
        document.getElementById("message").innerText = "Passwords do not match";
        return;
    }

    let newUser = {
        role: selectedRole,
        username,
        password,
        year: document.getElementById("year")?.value || "",
        sem: document.getElementById("sem")?.value || "",
        branch: document.getElementById("branch")?.value || ""
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("message").innerText = "Registered Successfully!";
});

/* LOGIN ROLE */
let loginRole = "";

function selectLoginRole(role){
    loginRole = role;
    document.getElementById("loginTitle").innerText = role.toUpperCase() + " LOGIN";
}

/* LOGIN */
document.getElementById("loginForm")?.addEventListener("submit", function(e){
    e.preventDefault();

    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    let user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === loginRole
    );

    if(user){
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = loginRole === "lecturer" ? "lecturer.html" : "student.html";
    } else {
        document.getElementById("loginMessage").innerText = "Invalid Credentials";
    }
});
function forgotPassword(){

    let role = loginRole;

    if(!role){
        alert("Please select Student or Lecturer first.");
        return;
    }

    let username = prompt("Enter your username:");

    if(!username){
        alert("Username required.");
        return;
    }

    let userIndex = users.findIndex(u =>
        u.username === username &&
        u.role === role
    );

    if(userIndex === -1){
        alert("User not found.");
        return;
    }

    let newPassword = prompt("Enter new password:");

    if(!newPassword){
        alert("Password cannot be empty.");
        return;
    }

    users[userIndex].password = newPassword;

    localStorage.setItem("users", JSON.stringify(users));

    alert("Password updated successfully!");
}