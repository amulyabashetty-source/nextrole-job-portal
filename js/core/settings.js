import { auth } from "./firebase.js";

import {
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";


const items = document.querySelectorAll(".setting-item");
const contents = document.querySelectorAll(".setting-content");
const msg = document.getElementById("msg");

const themeRadios = document.querySelectorAll('input[name="theme"]');


/* Load saved theme */

const savedTheme = localStorage.getItem("theme") || "light";

document.body.classList.toggle("dark", savedTheme === "dark");


themeRadios.forEach(radio => {

  if (radio.value === savedTheme) {
    radio.checked = true;
  }

  radio.addEventListener("change", () => {

    const theme = radio.value;

    localStorage.setItem("theme", theme);

    document.body.classList.toggle("dark", theme === "dark");

  });

});


/* Toggle sections */

items.forEach(item => {

  item.addEventListener("click", () => {

    const target = item.dataset.target;

    contents.forEach(c => {

      c.style.display =
        c.id === target
          ? (c.style.display === "block" ? "none" : "block")
          : "none";

    });

  });

});


/* Logout */

document.getElementById("logoutBtn")?.addEventListener("click", async () => {

  await signOut(auth);

  window.location.replace("../pages/login.html");

});


/* Delete account */

document.getElementById("deleteAccountBtn")?.addEventListener("click", async () => {

  const agree = document.getElementById("agreeLegal");

  if (!agree.checked) {

    msg.innerText = "Please accept Terms before deleting account.";
    msg.style.color = "red";
    return;

  }

  if (!confirm("This action is permanent. Continue?")) return;

  await deleteUser(auth.currentUser);

  window.location.replace("../pages/signup.html");

});