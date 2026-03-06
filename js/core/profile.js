import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { doc, getDoc, setDoc }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* CLOUDINARY */

const CLOUD_NAME = "dnu88sgyx";
const UPLOAD_PRESET = "resume_upload";

/* DOM */

const jobseekerFields = document.getElementById("jobseekerFields");
const employerFields = document.getElementById("employerFields");
const form = document.getElementById("profileForm");

const profilePhotoInput = document.getElementById("profilePhoto");
const profilePreview = document.getElementById("profilePreview");
const removePhotoBtn = document.getElementById("removePhotoBtn");

const photoModal = document.getElementById("photoModal");
const modalImage = document.getElementById("modalImage");

const companyLogoInput = document.getElementById("companyLogo");
const companyLogoPreview = document.getElementById("companyLogoPreview");

const msg = document.getElementById("msg");

/* STATE */

let currentUserRole = null;
let profilePhotoURL = null;
let companyLogoURL = null;


/* PROFILE PHOTO UPLOAD */

profilePhotoInput?.addEventListener("change", async () => {

  const file = profilePhotoInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  msg.innerText = "Uploading photo...";
  msg.style.color = "black";

  try {

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    profilePhotoURL = data.secure_url;

    if (profilePreview) {
      profilePreview.src = profilePhotoURL;
    }

    msg.innerText = "Photo uploaded successfully";
    msg.style.color = "green";

  } catch (err) {

    msg.innerText = "Photo upload failed";
    msg.style.color = "red";

  }

});


/* PHOTO MODAL */

profilePreview?.addEventListener("click", () => {

  if (!profilePhotoURL) return;

  modalImage.src = profilePhotoURL;
  photoModal.style.display = "flex";

});

photoModal?.addEventListener("click", () => {
  photoModal.style.display = "none";
});


/* REMOVE PHOTO */

removePhotoBtn?.addEventListener("click", async () => {

  profilePhotoURL = null;

  if (profilePreview) {
    profilePreview.src = "https://via.placeholder.com/120";
  }

  profilePhotoInput.value = "";

  const uid = auth.currentUser.uid;

  await setDoc(
    doc(db, "profiles", uid),
    { photoURL: null },
    { merge: true }
  );

});


/* COMPANY LOGO UPLOAD */

companyLogoInput?.addEventListener("change", async () => {

  const file = companyLogoInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  msg.innerText = "Uploading company logo...";
  msg.style.color = "black";

  try {

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    companyLogoURL = data.secure_url;

    if (companyLogoPreview) {
      companyLogoPreview.src = companyLogoURL;
    }

    msg.innerText = "Company logo uploaded";
    msg.style.color = "green";

  } catch (err) {

    msg.innerText = "Logo upload failed";
    msg.style.color = "red";

  }

});


/* AUTH + PREFILL */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.replace("../pages/login.html");
    return;
  }

  const userSnap = await getDoc(doc(db, "users", user.uid));
  const agreementSnap = await getDoc(doc(db, "agreements", user.uid));

  if (!agreementSnap.exists()) {
    window.location.replace("../pages/terms.html");
    return;
  }

  currentUserRole = userSnap.data().role;

  if (jobseekerFields)
    jobseekerFields.style.display =
      currentUserRole === "jobseeker" ? "block" : "none";

  if (employerFields)
    employerFields.style.display =
      currentUserRole === "employer" ? "block" : "none";

  const profileSnap = await getDoc(doc(db, "profiles", user.uid));

  if (!profileSnap.exists()) return;

  const p = profileSnap.data();


  /* RESTORE PROFILE PHOTO */

  if (p.photoURL) {

    profilePhotoURL = p.photoURL;

    if (profilePreview)
      profilePreview.src = p.photoURL;

  }


  /* RESTORE COMPANY LOGO */

  if (p.companyLogo) {

    companyLogoURL = p.companyLogo;

    if (companyLogoPreview)
      companyLogoPreview.src = p.companyLogo;

  }


  /* JOBSEEKER PREFILL */

  if (currentUserRole === "jobseeker") {

    document.getElementById("name").value = p.name || "";
    document.getElementById("skills").value = p.skills || "";
    document.getElementById("experience").value = p.experience || "";
    document.getElementById("location").value = p.location || "";

    const resumeInput = document.getElementById("resumeLink");

    if (resumeInput) {
      resumeInput.value = p.resumeLink || "";
    }

  }


  /* EMPLOYER PREFILL */

  if (currentUserRole === "employer") {

    document.getElementById("employerName").value =
      p.employerName || "";

    document.getElementById("companyName").value =
      p.companyName || "";

    document.getElementById("industry").value =
      p.industry || "";

    document.getElementById("companyLocation").value =
      p.companyLocation || "";

    document.getElementById("employerRole").value =
      p.employerRole || "";

    document.getElementById("employerExperience").value =
      p.employerExperience || "";

    document.getElementById("previousCompany").value =
      p.previousCompany || "";

  }

});


/* SAVE PROFILE */

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const uid = auth.currentUser.uid;

  let profileData = {
    role: currentUserRole,
    updatedAt: new Date(),
    photoURL: profilePhotoURL
  };


  /* JOBSEEKER PROFILE */

  if (currentUserRole === "jobseeker") {

    profileData = {
      ...profileData,

      name: document.getElementById("name").value,
      skills: document.getElementById("skills").value,
      experience: document.getElementById("experience").value,
      location: document.getElementById("location").value,

      resumeLink:
        document.getElementById("resumeLink")?.value || ""

    };

  }


  /* EMPLOYER PROFILE */

  if (currentUserRole === "employer") {

    profileData = {
      ...profileData,

      employerName:
        document.getElementById("employerName").value,

      companyName:
        document.getElementById("companyName").value,

      industry:
        document.getElementById("industry").value,

      companyLocation:
        document.getElementById("companyLocation").value,

      employerRole:
        document.getElementById("employerRole").value,

      employerExperience:
        document.getElementById("employerExperience").value,

      previousCompany:
        document.getElementById("previousCompany").value,

      companyLogo: companyLogoURL

    };

  }


  await setDoc(
    doc(db, "profiles", uid),
    profileData,
    { merge: true }
  );

  msg.innerText = "Profile saved successfully";
  msg.style.color = "green";

  setTimeout(() => {

    window.location.replace(
  currentUserRole === "jobseeker"
    ? "../pages/jobseeker/jobseeker-dashboard.html"
    : "../pages/employer/employer-dashboard.html"
);
   

  }, 800);

});