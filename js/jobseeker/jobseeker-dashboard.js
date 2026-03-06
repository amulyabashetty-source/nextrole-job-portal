import { auth, db } from "../core/firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


/* DOM */

const profileBox = document.getElementById("profileBox");
const viewJobsBtn = document.getElementById("viewJobsBtn");
const myApplicationsBtn = document.getElementById("myApplicationsBtn");
const logoutBtn = document.getElementById("logoutBtn");


/* AUTH + ROLE GUARD */

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.replace("../login.html");
    return;

  }

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists() || userDoc.data().role !== "jobseeker") {

    window.location.replace("../employer/employer-dashboard.html");
    return;

  }

  loadProfile(user.uid);

});


/* PROFILE */

async function loadProfile(uid) {

  try {

    const snap = await getDoc(doc(db, "profiles", uid));

    if (!snap.exists()) {

      document.getElementById("profilePercent").innerText = "0%";

      profileBox.innerHTML = `
        <h3>Profile not completed</h3>

        <p>Please complete your profile.</p>

        <button onclick="location.href='../profile.html'">
        Complete Profile
        </button>
      `;

      return;

    }

    const p = snap.data();

    const percent = p.profileCompletion || 0;

    document.getElementById("profilePercent").innerText =
      percent + "%";


    profileBox.innerHTML = `

      <h3>My Profile</h3>

      <p><b>Name:</b> ${p.name || "-"}</p>

      <p><b>Skills:</b> ${p.skills || "-"}</p>

      <p><b>Experience:</b> ${p.experience || "-"}</p>

      <p><b>Location:</b> ${p.location || "-"}</p>

      <button onclick="location.href='../profile.html'">
      Edit Profile
      </button>

    `;

  }

  catch (err) {

    console.error(err);

    profileBox.innerHTML = "Error loading profile";

  }

}


/* NAV BUTTONS */

viewJobsBtn?.addEventListener("click", () => {

  location.href = "jobs.html";

});


myApplicationsBtn?.addEventListener("click", () => {

  location.href = "my-applications.html";

});


logoutBtn?.addEventListener("click", async () => {

  await signOut(auth);

  location.href = "../login.html";

});