import { auth, db } from "../core/firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const jobDetailsDiv = document.getElementById("jobDetails");
const applyBtn = document.getElementById("applyBtn");
const officialBtn = document.getElementById("officialApplyBtn");
const msg = document.getElementById("msg");
const backBtn = document.getElementById("backBtn");
const saveBtn = document.getElementById("saveBtn");


/* BACK BUTTON */

backBtn?.addEventListener("click", () => {

  window.location.href = "jobs.html";

});


/* JOB ID */

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");


if (!jobId) {

  jobDetailsDiv.innerHTML = "<p style='color:red'>Invalid Job Link</p>";

  applyBtn.style.display = "none";

  throw new Error("Job ID missing in URL");

}


/* AUTH */

onAuthStateChanged(auth, async (user) => {

  jobDetailsDiv.innerHTML = "Loading job details...";

  if (!user) {

    window.location.replace("../login.html");
    return;

  }

  try {

    const jobSnap = await getDoc(doc(db, "jobs", jobId));

    if (!jobSnap.exists()) {

      jobDetailsDiv.innerHTML = "<p>Job not found</p>";

      applyBtn.style.display = "none";

      return;

    }

    const job = jobSnap.data();


/* CHECK SAVED */

const savedQuery = query(
collection(db, "savedJobs"),
where("userId","==",user.uid),
where("jobId","==",jobId)
);

const savedSnap = await getDocs(savedQuery);

if(!savedSnap.empty){

saveBtn.disabled = true;
saveBtn.innerText = "Saved";

}


/* RENDER JOB */

jobDetailsDiv.innerHTML = `

<div class="job-header">

<div class="job-title">${job.title}</div>

<p><b>Company:</b> ${job.company || "-"}</p>

<p><b>Location:</b> ${job.location || "-"}</p>

<p><b>Type:</b> ${job.jobType || "-"}</p>

<p><b>Experience:</b> ${job.experience || "-"}</p>

</div>

<div class="job-description">

<h3>Description</h3>

<p>${job.description || "-"}</p>

</div>

`;


/* OFFICIAL LINK */

if(job.officialLink){

officialBtn.href = job.officialLink;
officialBtn.style.display = "inline-block";

}


/* CHECK APPLIED */

const appliedQuery = query(
collection(db,"applications"),
where("jobId","==",jobId),
where("jobseekerId","==",user.uid)
);

const appliedSnap = await getDocs(appliedQuery);

if(!appliedSnap.empty){

applyBtn.disabled = true;
applyBtn.innerText = "Already Applied";

}


/* APPLY */

applyBtn?.addEventListener("click",async()=>{

const q = query(
collection(db,"applications"),
where("jobId","==",jobId),
where("jobseekerId","==",user.uid)
);

const existing = await getDocs(q);

if(!existing.empty){

msg.innerText = "You already applied";
msg.style.color = "orange";

applyBtn.disabled = true;

return;

}

await addDoc(collection(db,"applications"),{

jobId,
employerId: job.employerId || "",
jobseekerId: user.uid,
status:"Applied",
appliedAt: serverTimestamp()

});


/* EMAIL */

const profileSnap = await getDoc(doc(db,"profiles",user.uid));
const profile = profileSnap.exists() ? profileSnap.data() : {};

const employerUserSnap = await getDoc(doc(db,"users",job.employerId));
const employerUser = employerUserSnap.exists() ? employerUserSnap.data() : {};

const employerSnap = await getDoc(doc(db,"profiles",job.employerId));
const employer = employerSnap.exists() ? employerSnap.data() : {};

const applicantName = profile.name || "Candidate";
const applicantSkills = profile.skills || "Not specified";

const employerName =
employer.companyName ||
employer.employerName ||
"Hiring Team";


emailjs.send("service_sw969tr","template_qzil4bq",{

employer_email: employerUser.email,
employer_name: employerName,
job_title: job.title,
applicant_name: applicantName,
skills: applicantSkills

})
.then(()=>{

console.log("Email sent");

})
.catch(err=>{

console.log("Email failed",err);

});


msg.innerText = "Applied successfully!";
msg.style.color = "green";

applyBtn.disabled = true;
applyBtn.innerText = "Applied";

});


/* SAVE JOB */

saveBtn?.addEventListener("click",async()=>{

try{

const q = query(
collection(db,"savedJobs"),
where("userId","==",user.uid),
where("jobId","==",jobId)
);

const snap = await getDocs(q);

if(!snap.empty){

saveBtn.disabled = true;
saveBtn.innerText = "Saved";

msg.innerText = "Already saved";
msg.style.color = "orange";

return;

}

await addDoc(collection(db,"savedJobs"),{

userId:user.uid,
jobId,
savedAt:serverTimestamp()

});

saveBtn.disabled = true;
saveBtn.innerText = "Saved";

msg.innerText = "Job saved successfully";
msg.style.color = "green";

}

catch(err){

msg.innerText = err.message;
msg.style.color = "red";

}

});

}

catch(err){

msg.innerText = err.message;
msg.style.color = "red";

}

});