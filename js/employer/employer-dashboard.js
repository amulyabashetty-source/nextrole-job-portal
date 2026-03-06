import { auth, db } from "../core/firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


/* DOM */

const profileBox = document.getElementById("employerProfileBox");
const statsBox = document.getElementById("employerStats");
const msg = document.getElementById("msg");

const addJobBtn = document.getElementById("addJobBtn");
const myJobsBtn = document.getElementById("myJobsBtn");
const viewApplicantsBtn = document.getElementById("viewApplicantsBtn");
const logoutBtn = document.getElementById("logoutBtn");


/* AUTH + ROLE GUARD */

onAuthStateChanged(auth, async (user) => {

if (!user) {

window.location.replace("../login.html");
return;

}

try {

const userSnap = await getDoc(doc(db,"users",user.uid));

if(!userSnap.exists()){

await signOut(auth);
window.location.replace("../login.html");
return;

}

if(userSnap.data().role !== "employer"){

window.location.replace("../jobseeker/jobseeker-dashboard.html");
return;

}

const agreementSnap = await getDoc(doc(db,"agreements",user.uid));

if(!agreementSnap.exists()){

window.location.replace("../terms.html");
return;

}

loadEmployerProfile(user.uid);
loadEmployerStats(user.uid);

}

catch(err){

msg.innerText = err.message;
msg.style.color = "red";

}

});


/* LOAD PROFILE */

async function loadEmployerProfile(uid){

const snap = await getDoc(doc(db,"profiles",uid));

const p = snap.exists() ? snap.data() : {};

profileBox.innerHTML = `

<h3>🏢 Company Profile</h3>

<p><b>Company:</b> ${p.companyName || "-"}</p>

<p><b>Industry:</b> ${p.industry || "-"}</p>

<p><b>Location:</b> ${p.companyLocation || "-"}</p>

<br>

<button onclick="location.href='../profile.html'">
✏️ Edit Profile
</button>

`;

}


/* DASHBOARD STATS */

async function loadEmployerStats(uid){

const jobsQuery = query(
collection(db,"jobs"),
where("employerId","==",uid)
);

const jobsSnap = await getDocs(jobsQuery);

let totalJobs = jobsSnap.size;
let openJobs = 0;

jobsSnap.forEach(d => {

if(d.data().status !== "closed") openJobs++;

});


const appsQuery = query(
collection(db,"applications"),
where("employerId","==",uid)
);

const appsSnap = await getDocs(appsQuery);

const totalApplicants = appsSnap.size;


statsBox.innerHTML = `

<h3>📊 Dashboard Stats</h3>

<p><b>Total Jobs:</b> ${totalJobs}</p>

<p><b>Open Jobs:</b> ${openJobs}</p>

<p><b>Total Applicants:</b> ${totalApplicants}</p>

`;

}


/* BUTTONS */

addJobBtn?.addEventListener("click",()=>{

location.href = "add-job.html";

});


myJobsBtn?.addEventListener("click",()=>{

location.href = "posted-jobs.html";

});


viewApplicantsBtn?.addEventListener("click",()=>{

location.href = "applications.html";

});


logoutBtn?.addEventListener("click",async()=>{

await signOut(auth);

location.href = "../login.html";

});