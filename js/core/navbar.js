import { auth, db } from "./firebase.js";

import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { doc, getDoc, deleteDoc }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


/* INSERT NAVBAR */

document.body.insertAdjacentHTML("afterbegin",`

<nav class="navbar">

<div class="nav-left">
<a href="../../index.html" class="brand">NextRole</a>
</div>

<div class="nav-center">
<input
type="text"
class="search-input"
placeholder="Search jobs, companies..."
>
</div>

<div class="nav-right">

<img
id="navAvatar"
src="https://via.placeholder.com/40"
alt="Profile"
>

<div id="navMenu" class="nav-menu hidden">

<a href="../../pages/profile.html">Profile</a>

<a href="../../pages/settings.html">Settings</a>

<hr>

<button id="navLogoutBtn">
Logout
</button>

<button id="navDeleteBtn" class="danger">
Delete Account
</button>

</div>

</div>

</nav>

`);


/* DOM */

const avatar = document.getElementById("navAvatar");
const menu = document.getElementById("navMenu");
const logoutBtn = document.getElementById("navLogoutBtn");
const deleteBtn = document.getElementById("navDeleteBtn");


/* THEME */

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
document.body.classList.add("dark");
}


/* LOAD PROFILE PHOTO */

onAuthStateChanged(auth, async(user)=>{

if(!user) return;

try{

const snap = await getDoc(
doc(db,"profiles",user.uid)
);

if(snap.exists() && snap.data().photoURL){
avatar.src = snap.data().photoURL;
}

}catch(err){

console.error("Failed to load profile photo",err);

}

});


/* MENU TOGGLE */

avatar.addEventListener("click",(e)=>{

e.stopPropagation();
menu.classList.toggle("hidden");

});


/* CLOSE MENU */

document.addEventListener("click",()=>{

menu.classList.add("hidden");

});


/* LOGOUT */

logoutBtn.addEventListener("click",async()=>{

await signOut(auth);

window.location.replace("../../pages/login.html");

});


/* DELETE ACCOUNT */

deleteBtn.addEventListener("click",async()=>{

const ok = confirm(
"This will permanently delete your account. Continue?"
);

if(!ok) return;

const user = auth.currentUser;

await deleteDoc(doc(db,"profiles",user.uid));
await deleteDoc(doc(db,"users",user.uid));

await user.delete();

window.location.replace("../../pages/signup.html");

});