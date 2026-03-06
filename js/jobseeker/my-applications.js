import { auth, db } from "../core/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", () => {

const container = document.getElementById("applicationsContainer");
const msg = document.getElementById("msg");


if (!container) return;


/* AUTH */

onAuthStateChanged(auth, async (user) => {

if (!user) {

window.location.replace("../login.html");
return;

}

try {

const q = query(

collection(db,"applications"),
where("jobseekerId","==",user.uid)

);

const snapshot = await getDocs(q);


if(snapshot.empty){

container.innerHTML = "<p>No applications found.</p>";
return;

}


container.innerHTML = "";


for(const docSnap of snapshot.docs){

const app = docSnap.data();

let jobTitle = "N/A";
let company = "N/A";


if(app.jobId){

const jobSnap = await getDoc(doc(db,"jobs",app.jobId));

if(jobSnap.exists()){

const jobData = jobSnap.data();

jobTitle = jobData.title || "N/A";
company = jobData.company || "N/A";

}

}


let color = "gray";

if(app.status === "Accepted") color = "green";
if(app.status === "Rejected") color = "red";
if(app.status === "Applied") color = "orange";


const div = document.createElement("div");

div.style.border = "1px solid #ccc";
div.style.padding = "10px";
div.style.marginBottom = "10px";


div.innerHTML = `

<p><strong>Job:</strong> ${jobTitle}</p>

<p><strong>Company:</strong> ${company}</p>

<p><strong>Status:</strong>
<span style="color:${color}">
${app.status}
</span>
</p>

<p><strong>Applied On:</strong>
${
app.appliedAt?.toDate
? app.appliedAt.toDate().toLocaleDateString()
: "N/A"
}
</p>

`;

container.appendChild(div);

}

}

catch(err){

msg.innerText = err.message;
msg.style.color = "red";

}

});

});