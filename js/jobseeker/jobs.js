import { auth, db } from "../core/firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


/* ROLE KEYWORDS */

const ROLE_KEYWORDS = {

  developer: ["developer", "engineer", "programmer", "software"],

  frontend: ["frontend", "react", "angular", "vue", "html", "css", "javascript"],

  backend: ["backend", "node", "java", "python", "spring", "django", "php"],

  fullstack: ["full stack", "mern", "mean"],

  data: ["data", "analyst", "analytics", "scientist", "ml", "ai"],

  database: ["sql", "mysql", "postgres", "mongodb", "database"],

  cloud: ["aws", "azure", "cloud", "devops", "sre"],

  testing: ["qa", "tester", "testing", "selenium"],

  fresher: ["fresher", "trainee", "intern", "junior", "associate"]

};


/* DOM */

const jobsContainer = document.getElementById("jobsContainer");
const msg = document.getElementById("msg");
const backBtn = document.getElementById("backBtn");

const locationFilter = document.getElementById("locationFilter");
const typeFilter = document.getElementById("typeFilter");
const expFilter = document.getElementById("expFilter");


/* SEARCH TERM */

let searchTerm = localStorage.getItem("jobSearch");

searchTerm = searchTerm ? searchTerm.toLowerCase().trim() : "";


/* SEARCH MATCHER */

function matchesSearch(job, term) {

  if (!term) return true;

  const text = `
    ${job.title || ""}
    ${job.role || ""}
    ${job.skills || ""}
    ${job.description || ""}
    ${job.company || ""}
    ${job.location || ""}
  `.toLowerCase();

  if (text.includes(term)) return true;

  for (const group in ROLE_KEYWORDS) {

    if (ROLE_KEYWORDS[group].includes(term)) {

      return ROLE_KEYWORDS[group].some(k => text.includes(k));

    }

  }

  return false;

}


/* FILTER MATCHER */

function matchesFilters(job) {

  const location = locationFilter?.value.toLowerCase() || "";
  const type = typeFilter?.value.toLowerCase() || "";
  const exp = expFilter?.value.toLowerCase() || "";

  if (location && (job.location || "").toLowerCase() !== location) {
    return false;
  }

  if (type && (job.jobType || "").toLowerCase() !== type) {
    return false;
  }

  if (exp && !(job.experience || "").toLowerCase().includes(exp)) {
    return false;
  }

  return true;

}


/* BACK BUTTON */

backBtn?.addEventListener("click", () => {

  window.location.href = "jobseeker-dashboard.html";

});


/* AUTH GUARD */

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.replace("../login.html");
    return;

  }

  try {

    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (!userSnap.exists() || userSnap.data().role !== "jobseeker") {

      window.location.replace("../employer/employer-dashboard.html");
      return;

    }

    loadJobs();

  }

  catch (err) {

    msg.innerText = err.message;
    msg.style.color = "red";

  }

});


/* LOAD JOBS */

async function loadJobs() {

  jobsContainer.innerHTML = "<p>Loading jobs...</p>";

  try {

    const q = query(

      collection(db, "jobs"),
      where("status", "==", "open"),
      orderBy("createdAt", "desc")

    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

      jobsContainer.innerHTML = "<p>No jobs available right now.</p>";
      return;

    }

    jobsContainer.innerHTML = "";

    let found = false;

    snapshot.forEach((docSnap) => {

      const job = docSnap.data();
      const jobId = docSnap.id;

      if (!matchesSearch(job, searchTerm)) return;
      if (!matchesFilters(job)) return;

      found = true;

      const jobDiv = document.createElement("div");
      jobDiv.className = "job-card";

      const shortDesc = job.description
        ? job.description.substring(0, 220)
        : "";

      jobDiv.innerHTML = `
        <h3 class="job-title">${job.title}</h3>
        <p><b>Company:</b> ${job.company || "-"}</p>
        <p><b>Location:</b> ${job.location || "-"}</p>
        <p><b>Type:</b> ${job.jobType || "-"}</p>
        <p>${shortDesc}${shortDesc.length === 220 ? "..." : ""}</p>
      `;

      const viewBtn = document.createElement("button");

      viewBtn.innerText = "View Details";

      viewBtn.className = "view-btn";

      viewBtn.onclick = () => {

        window.location.href = `job-details.html?id=${jobId}`;

      };

      jobDiv.appendChild(viewBtn);

      jobsContainer.appendChild(jobDiv);

    });

    if (!found) {

      jobsContainer.innerHTML = `
      <div style="padding:20px;text-align:center;">
      <h3>No results found</h3>
      <p>Try searching for python developer, data analyst, fresher</p>
      </div>
      `;

    }

    localStorage.removeItem("jobSearch");

  }

  catch (err) {

    msg.innerText = err.message;
    msg.style.color = "red";

  }

}


/* FILTER EVENTS */

locationFilter?.addEventListener("change", loadJobs);
typeFilter?.addEventListener("change", loadJobs);
expFilter?.addEventListener("change", loadJobs);