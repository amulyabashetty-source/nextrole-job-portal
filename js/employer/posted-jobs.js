import { auth, db } from "../core/firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
collection,
query,
where,
getDocs,
doc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const container = document.getElementById("jobsContainer");
const msg = document.getElementById("msg");


onAuthStateChanged(auth, async (user)=>{

if(!user){

window.location.href = "../login.html";
return;

}

loadJobs(user.uid);

});


async function loadJobs(uid){

const q = query(
collection(db,"jobs"),
where("employerId","==",uid)
);

const snap = await getDocs(q);

if(snap.empty){

container.innerHTML = "<p>No jobs posted yet.</p>";
return;

}

container.innerHTML = "";


for(const d of snap.docs){

const job = d.data();
const jobId = d.id;


/* COUNT APPLICANTS */

const appsQuery = query(
collection(db,"applications"),
where("jobId","==",jobId)
);

const appsSnap = await getDocs(appsQuery);

const applicantCount = appsSnap.size;


const div = document.createElement("div");

div.className = "job-card";

div.innerHTML = `

<h3>${job.title}</h3>

<p>
<b>Status:</b>
<span style="color:${job.status==="open"?"green":"red"}">
${job.status}
</span>
</p>

<p class="job-meta">
<b>Location:</b> ${job.location || "-"}
</p>

<p>
<b>Applicants:</b>
<span style="
background:#2563eb;
color:white;
padding:3px 8px;
border-radius:6px;
font-size:13px;
">
${applicantCount}
</span>
</p>

<button onclick="editJob('${jobId}')">✏️ Edit</button>

<button onclick="toggleStatus('${jobId}','${job.status}')">
${job.status==="open"?"Close Job":"Open Job"}
</button>

<button onclick="viewApplicants('${jobId}')">
👥 View Applicants
</button>

<button onclick="deleteJob('${jobId}')" style="color:red">
🗑 Delete
</button>

`;

container.appendChild(div);

}

}


/* EDIT JOB */

window.editJob = (jobId)=>{

window.location.href = `add-job.html?id=${jobId}`;

};


/* VIEW APPLICANTS */

window.viewApplicants = (jobId)=>{

window.location.href = `applications.html?jobId=${jobId}`;

};


/* TOGGLE JOB STATUS */

window.toggleStatus = async (jobId,current)=>{

const newStatus = current==="open" ? "closed" : "open";

await updateDoc(doc(db,"jobs",jobId),{
status:newStatus
});

location.reload();

};


/* DELETE JOB */

window.deleteJob = async (jobId)=>{

if(!confirm("Delete this job permanently?")) return;

await deleteDoc(doc(db,"jobs",jobId));

location.reload();

};