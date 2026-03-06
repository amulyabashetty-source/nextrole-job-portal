import { auth, db } from "../core/firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


/* DOM */

const container = document.getElementById("savedJobsContainer");
const msg = document.getElementById("msg");
const backBtn = document.getElementById("backBtn");


/* BACK BUTTON */

backBtn?.addEventListener("click", () => {

  window.location.href = "jobseeker-dashboard.html";

});


/* AUTH */

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.replace("../login.html");
    return;

  }

  try {

    container.innerHTML = "Loading saved jobs...";


    const q = query(

      collection(db, "savedJobs"),
      where("userId", "==", user.uid)

    );


    const snapshot = await getDocs(q);


    if (snapshot.empty) {

      container.innerHTML = "<p>No saved jobs yet.</p>";
      return;

    }


    container.innerHTML = "";


    for (const savedDoc of snapshot.docs) {

      const saved = savedDoc.data();

      const jobSnap = await getDoc(doc(db, "jobs", saved.jobId));

      if (!jobSnap.exists()) continue;


      const job = jobSnap.data();
      const jobId = jobSnap.id;


      const jobDiv = document.createElement("div");

      jobDiv.className = "job-card";


      jobDiv.innerHTML = `

        <h3 class="job-title">${job.title}</h3>

        <p><b>Company:</b> ${job.company || "-"}</p>

        <p><b>Location:</b> ${job.location || "-"}</p>

        <p><b>Type:</b> ${job.jobType || "-"}</p>

      `;


      /* VIEW BUTTON */

      const viewBtn = document.createElement("button");

      viewBtn.className = "view-btn";

      viewBtn.innerText = "View Details";

      viewBtn.onclick = () => {

        window.location.href = `job-details.html?id=${jobId}`;

      };


      /* REMOVE BUTTON */

      const removeBtn = document.createElement("button");

      removeBtn.className = "remove-btn";

      removeBtn.innerText = "Remove";


      removeBtn.addEventListener("click", async () => {

        try {

          await deleteDoc(doc(db, "savedJobs", savedDoc.id));

          jobDiv.remove();

        }

        catch (err) {

          msg.innerText = err.message;

          msg.style.color = "red";

        }

      });


      const actions = document.createElement("div");

      actions.className = "job-actions";

      actions.appendChild(viewBtn);

      actions.appendChild(removeBtn);


      jobDiv.appendChild(actions);

      container.appendChild(jobDiv);

    }

  }

  catch (err) {

    msg.innerText = err.message;

    msg.style.color = "red";

  }

});