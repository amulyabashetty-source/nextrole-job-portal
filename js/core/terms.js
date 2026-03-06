import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const termsBox = document.getElementById("termsBox");
const agreeCheck = document.getElementById("agreeCheck");
const continueBtn = document.getElementById("continueBtn");
const msg = document.getElementById("msg");


/* Disable checkbox initially */

agreeCheck.disabled = true;


/* Enable checkbox after scrolling */

termsBox.addEventListener("scroll", () => {

  const reachedBottom =
    termsBox.scrollTop + termsBox.clientHeight >= termsBox.scrollHeight - 5;

  if (reachedBottom) {
    agreeCheck.disabled = false;
  }

});


/* Enable continue button */

agreeCheck.addEventListener("change", () => {

  continueBtn.disabled = !agreeCheck.checked;

});


/* Continue button */

continueBtn.addEventListener("click", () => {

  onAuthStateChanged(auth, async (user) => {

    if (!user) {

      msg.innerText = "User not logged in.";
      msg.style.color = "red";
      return;

    }

    try {

      await setDoc(

        doc(db, "agreements", user.uid),

        {
          accepted: true,
          acceptedAt: serverTimestamp()
        },

        { merge: true }

      );

      window.location.replace("../pages/profile.html");

    }

    catch (err) {

      msg.innerText = err.message;
      msg.style.color = "red";

    }

  });

});