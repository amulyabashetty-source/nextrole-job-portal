# NextRole – Job Portal Web Application

A modern job portal platform where job seekers can search and apply for jobs while employers can post job openings and manage applicants.

NextRole is a full-stack job portal web application that connects job seekers with employers.
It allows candidates to search and apply for jobs while enabling recruiters to post jobs and manage applicants.

---

## Features

### Job Seeker

* User signup and login
* Profile creation with skills, experience, and resume link
* Search jobs with filters (location, job type, experience)
* Apply to jobs
* Save jobs for later
* View application status
* Dashboard showing profile completion

### Employer

* Employer account and profile
* Post new jobs
* Edit or close jobs
* View applicants for each job
* Accept or reject candidates
* Dashboard showing total jobs and applicants

### System Features

* Role-based access control (Job Seeker / Employer)
* Email notification when a candidate applies
* Profile photo and company logo upload
* Responsive navigation bar with search
* Dark and light theme support

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript (ES Modules)

### Backend & Services

* Firebase Authentication
* Firebase Firestore Database
* EmailJS (Email notifications)
* Cloudinary (Image uploads)

---

## Project Structure

```
NextRole/
│
├── index.html
│
├── pages/
│   ├── employer/
│   │   ├── employer-dashboard.html
│   │   ├── add-job.html
│   │   ├── posted-jobs.html
│   │   └── applications.html
│   │
│   └── jobseeker/
│       ├── jobseeker-dashboard.html
│       ├── jobs.html
│       ├── job-details.html
│       ├── my-applications.html
│       └── saved-jobs.html
│
├── js/
│   ├── core/
│   │   ├── firebase.js
│   │   ├── navbar.js
│   │   ├── theme.js
│   │   └── search.js
│   │
│   ├── auth/
│   │   ├── login.js
│   │   └── signup.js
│   │
│   ├── employer/
│   │   ├── employer-dashboard.js
│   │   ├── add-job.js
│   │   ├── posted-jobs.js
│   │   └── applications.js
│   │
│   └── jobseeker/
│       ├── jobseeker-dashboard.js
│       ├── jobs.js
│       ├── job-details.js
│       ├── my-applications.js
│       └── saved-jobs.js
│
├── css/
│   ├── style.css
│   ├── jobs.css
│   ├── job-details.css
│   ├── profile.css
│   └── settings.css
│
├── assets/
│   └── images/
│       └── logo.png
│
└── README.md
```

---

## Key Functionalities

* Secure authentication using Firebase Authentication
* Role-based dashboards for employers and job seekers
* Job posting and job management system
* Job application and applicant tracking system
* Email notifications when candidates apply
* Real-time database updates using Firestore
* Clean modular JavaScript project structure

---

## Future Improvements

* Resume upload instead of external link
* Admin moderation panel
* Advanced job recommendation system
* Pagination for large job listings
* Messaging between employer and candidate

---

## Why This Project

This project demonstrates practical experience in building a full-stack web application using modern JavaScript and cloud services.

Key concepts implemented:

* Authentication and user role management
* Database design using Firestore
* Modular JavaScript architecture
* Real-world job portal workflow
* Integration of third-party services (EmailJS, Cloudinary)

---

## Author

**Amulya Bashetty**
Electronics and Communication Engineering Graduate (2025)
Aspiring Full-Stack Developer

---

## License

This project is created for educational and portfolio purposes.
