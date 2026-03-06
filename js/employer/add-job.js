import { auth, db } from "../core/firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
collection,
addDoc,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const form = document.getElementById("jobForm");
const msg = document.getElementById("msg");

const params = new URLSearchParams(window.location.search);
const editJobId = params.get("id");

let currentEmployerId = null;


/* AUTH */
onAuthStateChanged(auth, async (user)=>{

if(!user){

window.location.href = "../login.html";
return;

}

currentEmployerId = user.uid;

if(editJobId){

loadJobForEdit(editJobId);

}

});


/* LOAD JOB FOR EDIT */

async function loadJobForEdit(jobId){

const snap = await getDoc(doc(db,"jobs",jobId));

if(!snap.exists()){

msg.innerText = "Job not found";
msg.style.color = "red";
return;

}

const job = snap.data();

if(job.employerId !== currentEmployerId){

msg.innerText = "Unauthorized access";
msg.style.color = "red";
return;

}

document.getElementById("title").value = job.title;
document.getElementById("company").value = job.company;
document.getElementById("location").value = job.location;
document.getElementById("jobType").value = job.jobType;
document.getElementById("experience").value = job.experience;
document.getElementById("description").value = job.description;
document.getElementById("officialLink").value = job.officialLink || "";

}


/* SUBMIT JOB */

form.addEventListener("submit", async (e)=>{

e.preventDefault();

try{

const title = document.getElementById("title").value.trim();
const company = document.getElementById("company").value.trim();
const location = document.getElementById("location").value.trim();
const jobType = document.getElementById("jobType").value;
const experience = document.getElementById("experience").value;
const description = document.getElementById("description").value.trim();
const officialLink = document.getElementById("officialLink").value || "";

if(!title || !company || !description){

msg.innerText = "Title, company and description are required";
msg.style.color = "red";
return;

}

const jobData = {

title,
company,
location,
jobType,
experience,
description,
officialLink,
employerId: currentEmployerId,
updatedAt: new Date()

};


if(editJobId){

await updateDoc(doc(db,"jobs",editJobId),jobData);

msg.innerText = "Job updated successfully";

}

else{

await addDoc(collection(db,"jobs"),{

...jobData,
status: "open",
createdAt: new Date()

});

msg.innerText = "Job posted successfully";

}

msg.style.color = "green";


setTimeout(()=>{

window.location.href = "posted-jobs.html";

},1200);

}

catch(err){

msg.innerText = err.message;
msg.style.color = "red";

}

});