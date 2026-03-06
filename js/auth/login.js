import { auth, db } from "../core/firebase.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");


/* 🔐 Login */
form.addEventListener("submit", async (e) => {

  e.preventDefault();
  msg.innerText = "";

  try {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const cred = await signInWithEmailAndPassword(auth, email, password);

    const uid = cred.user.uid;

    /* get role */

    const userSnap = await getDoc(doc(db, "users", uid));

    if (!userSnap.exists()) {
      throw new Error("User record missing");
    }

    const role = userSnap.data().role;

    /* check profile */

    const profileSnap = await getDoc(doc(db, "profiles", uid));

    if (!profileSnap.exists()) {

      window.location.replace("../profile.html");
      return;

    }

    window.location.replace(

      role === "jobseeker"
        ? "../pages/jobseeker/jobseeker-dashboard.html"
        : "../pages/employer/employer-dashboard.html"

    );

  }

  catch (err) {

    msg.innerText = err.message;
    msg.style.color = "red";

  }

});


/* 🔑 Forgot password */

document.getElementById("forgotPassword").addEventListener("click", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {

    msg.innerText = "Enter email first";
    msg.style.color = "red";
    return;

  }

  try {

    await sendPasswordResetEmail(auth, email);

    msg.innerText = "Password reset email sent.";
    msg.style.color = "green";

  }

  catch (err) {

    msg.innerText = err.message;
    msg.style.color = "red";

  }

});


/* 👁️ Show / Hide Password */

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword?.addEventListener("click", () => {

  if (passwordInput.type === "password") {

    passwordInput.type = "text";
    togglePassword.classList.replace("fa-eye", "fa-eye-slash");

  }

  else {

    passwordInput.type = "password";
    togglePassword.classList.replace("fa-eye-slash", "fa-eye");

  }

});


/* 🔵 Google Login */

const googleBtn = document.getElementById("googleLoginBtn");

googleBtn?.addEventListener("click", async () => {

  const provider = new GoogleAuthProvider();

  try {

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (!snap.exists()) {

      await setDoc(userRef, {

        email: user.email,
        role: "jobseeker",
        createdAt: new Date()

      });

    }

    window.location.replace("../pages/jobseeker/jobseeker-dashboard.html");

  }

  catch (err) {

    alert(err.message);

  }

});