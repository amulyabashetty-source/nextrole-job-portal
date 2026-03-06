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
updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const container = document.getElementById("applicationsContainer");
const msg = document.getElementById("msg");

container.innerHTML = "<p>Loading applications...</p>";


/* GET jobId from URL */

const params = new URLSearchParams(window.location.search);

const jobId = params.get("jobId");


/* AUTH + EMPLOYER GUARD */

onAuthStateChanged(auth, async (user)=>{

if(!user){

window.location.replace("../login.html");
return;

}

const userSnap = await getDoc(doc(db,"users",user.uid));

if(!userSnap.exists() || userSnap.data().role !== "employer"){

window.location.replace("../jobseeker/jobseeker-dashboard.html");
return;

}

loadApplications(user.uid);

});


/* LOAD APPLICATIONS */

async function loadApplications(employerId){

try{

let q;


/* If jobId exists → show applicants for that job */

if(jobId){

q = query(
collection(db,"applications"),
where("jobId","==",jobId)
);

}

else{

q = query(
collection(db,"applications"),
where("employerId","==",employerId)
);

}


const snapshot = await getDocs(q);


if(snapshot.empty){

container.innerHTML = "<p>No applicants yet.</p>";
return;

}

container.innerHTML = "";


for(const appDoc of snapshot.docs){

const app = appDoc.data();

const jobSnap = await getDoc(doc(db,"jobs",app.jobId));

if(jobSnap.exists() && jobSnap.data().employerId !== employerId){
continue;
}

const profileSnap = await getDoc(doc(db,"profiles",app.jobseekerId));

if(!profileSnap.exists()) continue;

const job = jobSnap.exists() ? jobSnap.data() : null;
const profile = profileSnap.data();


const div = document.createElement("div");

div.style.border = "1px solid #ccc";
div.style.padding = "10px";
div.style.marginBottom = "10px";


div.innerHTML = `

<h3>${profile.name}</h3>

<p>
<strong>Applied for:</strong>
${job ? job.title : "Job deleted"}
</p>

<p><strong>Skills:</strong> ${profile.skills || "-"}</p>

<p><strong>Experience:</strong> ${profile.experience || "-"}</p>

<p><strong>Location:</strong> ${profile.location || "-"}</p>

<p>

<strong>Status:</strong>

<span style="
color:${
app.status==="Accepted"
?"green"
:app.status==="Rejected"
?"red"
:"orange"
};
font-weight:bold
">

${app.status}

</span>

</p>

${
app.status==="Applied"
?`
<button onclick="updateStatus('${appDoc.id}','Accepted')">
✅ Accept
</button>

<button onclick="updateStatus('${appDoc.id}','Rejected')">
❌ Reject
</button>
`
:`<p><em>Decision already made</em></p>`
}

`;

container.appendChild(div);

}

}

catch(err){

msg.innerText = err.message;
msg.style.color = "red";

}

}


/* UPDATE STATUS */

window.updateStatus = async function(appId,newStatus){

try{

await updateDoc(doc(db,"applications",appId),{
status:newStatus
});

msg.innerText = `Application ${newStatus}`;
msg.style.color = "green";

location.reload();

}

catch(err){

msg.innerText = err.message;
msg.style.color = "red";

}

};