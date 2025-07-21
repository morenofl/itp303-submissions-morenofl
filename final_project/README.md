# StudyMatch - ITP 303 Final Project

A full-stack web application for students to find, create, and join study groups for their courses. Built with React (frontend), Express/Node.js (backend), and PostgreSQL (database).

## Features
- User registration and login with secure session-based authentication
- Browse departments and courses
- Create, join, update, leave, and delete study groups
- View all groups for a course or user

## Tech Stack
- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** Session-based

## Folder Structure
```
final_project/
  backend/         # Express server and API
    index.js
    package.json
  frontend/        # React app (Vite)
    src/
      components/
      pages/
    public/
    package.json
```

## Live Demo
This project is already deployed! You can try it here:

**Frontend:** [https://morenofl.github.io/itp303-submissions-morenofl/final_project/frontend/dist/index.html](https://morenofl.github.io/itp303-submissions-morenofl/final_project)

**Backend/API:** Hosted on Render.com

**DB:** Hosted on Render.com

## API Endpoints

| Method | Route                        | Description                                      |
|--------|------------------------------|--------------------------------------------------|
| GET    | /api/departments             | Get all departments                              |
| GET    | /api/courses                 | Get all courses                                  |
| GET    | /api/groups/:course_id       | Get all groups for a course                      |
| GET    | /api/userGroups              | Get all groups for the logged-in user            |
| POST   | /api/groups                  | Create a new group (requires login)              |
| POST   | /api/userGroups              | Join a group (requires login)                    |
| PUT    | /api/groups/:group_id        | Update a group (requires login/ownership)        |
| DELETE | /api/userGroups/:group_id    | Leave a group (requires login)                   |
| DELETE | /api/groups/:group_id        | Delete a group (requires login/ownership)        |
| POST   | /api/login                   | Log in a user                                    |
| POST   | /api/register                | Register a new user                              |
| GET    | /api/protected               | Test if user is authenticated                    |
| GET    | /api/logout                  | Log out the current user                         |


