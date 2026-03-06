import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const searchInput = document.querySelector(".search-input");


if(searchInput){

searchInput.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){

const value = searchInput.value.trim().toLowerCase();

localStorage.setItem("jobSearch",value);

window.location.href = "pages/jobseeker/jobs.html";

}

});

}