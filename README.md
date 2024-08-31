<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/hasbialwikusmana/HireJob-Backend" target="_blank">
    <img src="https://github.com/user-attachments/assets/3abbb5ea-28c9-4325-9f34-d026a3dbe2bc" alt="Logo" width="100%">
  </a>

  <h3 align="center">Hire Job RESTFULL API</h3>

  <p align="center">
    Find talented & best developers in various fields.
    <br />
    <a href="https://peworldapp.netlify.app/" target="_blank">View Demo</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

**Hire Job** is an application that provides companies with access to find the best workforce based on the required skills or abilities, while also facilitating job seekers in discovering job opportunities that match their expertise. This application is equipped with various features, such as allowing companies to view potential candidates they wish to recruit, modify profiles, and for job seekers, add skills, update profiles, and delete unnecessary data.

This application is developed individually by Hasbi using React.js, Express.js, and PostgreSQL technologies.

## Features

1. **User Authentication**

   - **Login & Registration**: Users can register as workers or recruiters and log in to the application.
   - **JWT-based Authentication**: Secure user authentication using JSON Web Tokens.

2. **Profile Management**

   - **Edit Profile**: Users can edit their profile, including personal information, profile picture, and other details.
   - **Manage Skills**: Workers can add, edit, or delete their skills.
   - **Portfolio & Experience**: Workers can add project portfolios and work experience to their profiles.

3. **Job Seeker Features**

   - **Job Search**: Search for jobs based on skills and other criteria.
   - **Job Application**: Apply for available jobs.

4. **Recruiter Features**

   - **Search Candidates**: Recruiters can search for candidates based on skills and experience.
   - **View Candidate Profiles**: View full worker profiles, including portfolios and work experience.
   - **Hire Candidates**: Contact suitable candidates to offer jobs.

5. **Security Features**

   - **Password Hashing**: Secure password storage using bcrypt.
   - **Input Validation**: Validate user input to prevent injection attacks.
   - **Role-based Access Control**: Differentiate permissions for workers and recruiters.

6. **File Upload Management**

   - **Cloudinary Integration**: Upload and manage user profile pictures and portfolio images with Cloudinary.

7. **Responsive Design**

   - **Mobile & Desktop Support**: The API supports responsive design, ensuring smooth operation on both mobile and desktop platforms.

8. **Documentation & Testing**

   - **Postman Collection**: Documented API endpoints with Postman.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

This app was built with some technologies below:

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [NodeJS](https://nodejs.org/)
- [Cloudinary](https://cloudinary.com/)
- [JSON Web Token (JWT)](https://jwt.io/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

Before going to the installation stage there are some software that must be installed first.

- [NodeJs](https://nodejs.org/en/download/)

<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

- Clone the repo

```
git clone https://github.com/hasbialwikusmana/HireJob-Backend.git
```

- Go To Folder Repo

```
cd HireJob-Backend
```

- Install Module

```
npm install
```

- <a href="#setup-env">Setup .env</a>
- Import Database in folder doc

<p align="right">(<a href="#top">back to top</a>)</p>

### Setup .env example

Create .env file in your root project folder.

```
#DATABASE POSTGRESQL

# PGHOST= Hostname of Database Server
PGHOST=

# PGUSER= Username for Database
PGUSER=

# PGDATABASE= Database Name
PGDATABASE=

# PGPASSWORD= Password for Database
PGPASSWORD=

# PGPORT= Port of Database Server
PGPORT=


# TOKEN
SECRET_KEY_JWT =

#PORT SERVER
PORT =

#Cloudinary
CLOUD_NAME =

CLOUD_API_KEY =

CLOUD_API_SECRET =

```

<p align="right">(<a href="#top">back to top</a>)</p>

## Rest API

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/27670180/2sA3BuVU3Q)

<p align="right">(<a href="#top">back to top</a>)</p>

## Related Project

:rocket: [`Backend Hire Job`](https://github.com/hasbialwikusmana/HireJob-Backend)

:rocket: [`Frontend Hire Job`](https://github.com/hasbialwikusmana/HireJob-Frontend)

:rocket: [`Web Service`](https://hire-job-backend-rho.vercel.app/)

:rocket: [`Demo Hire Job`](https://peworldapp.netlify.app/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

My Email : [hasbialwi70@gmail.com](mailto:hasbialwi70@gmail.com)

Project Link: [https://github.com/hasbialwikusmana/HireJob-Frontend](https://github.com/hasbialwikusmana/HireJob-Frontend)

<p align="right">(<a href="#top">back to top</a>)</p>
