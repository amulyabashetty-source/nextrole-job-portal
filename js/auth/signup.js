import { auth, db } from "../core/firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const form = document.getElementById("signupForm");
const msg = document.getElementById("msg");


/* 👁 Show / Hide password */

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


/* 📝 Signup */

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.querySelector('input[name="role"]:checked').value;

    /* 1️⃣ Create auth user */

    const cred = await createUserWithEmailAndPassword(auth, email, password);


    /* 2️⃣ Save role in Firestore */

    await setDoc(doc(db, "users", cred.user.uid), {

      email,
      role,
      createdAt: new Date()

    });


    msg.innerText = "Signup successful! Redirecting to profile...";
    msg.style.color = "green";


    /* 3️⃣ Redirect to profile page */

    setTimeout(() => {

      window.location.replace("../profile.html");

    }, 800);


  }

  catch (err) {

    if (err.code === "auth/email-already-in-use") {

      msg.innerText = "This email is already registered. Please login.";

    }

    else if (err.code === "auth/weak-password") {

      msg.innerText = "Password should be at least 6 characters.";

    }

    else {

      msg.innerText = "Signup failed. Please try again.";

    }

    msg.style.color = "red";

  }

});