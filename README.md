# Name: Green Dragons App

- **Live Link:** https://green-dragons-client-master.now.sh/
- **Client Repo:** https://github.com/Drewlove/green-dragons-client
- **API Repo:** https://github.com/Drewlove/green-dragons-api

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Summary

This app is a prototype made for the administrative staff of Green Dragons Inc.

The app consolidates student information and other dynamic pieces of the Green Dragons Program.

Admin can create, edit, and delete communities, subcommunities, challenges, students, and the following student information:

- Profiles
- Communities
- Transactions
- Challenge Entries

## API Documentation

API Repo: https://github.com/Drewlove/green-dragons-api

### Tables and HTTP Requests

Request are made to the root url of: https://warm-ocean-22527.herokuapp.com/api/*ENDPOINT*

_ENDPOINT_ is the pluralized form of each table

| Table                | Endpoint               |
| -------------------- | ---------------------- |
| student              | students               |
| challenge            | challenges             |
| community            | communities            |
| subcommunity         | subcommunities         |
| exchange             | exchanges              |
| challenge_entry      | challenge-entries      |
| student_subcommunity | student-subcommunities |

### HTTP Request Examples

**HTTP Request:** GET <br />  
**URL:** https://warm-ocean-22527.herokuapp.com/api/students  
**RESULT:** returns a list of all students from the student table

**HTTP Request:** GET  
**URL:** https://warm-ocean-22527.herokuapp.com/api/students/1  
**RESULT:** returns an individual row from the student table with the student_id equal to 1

**HTTP Request:** PATCH  
**URL:** https://warm-ocean-22527.herokuapp.com/api/students/1  
**RESULT:** updates an individual row from the student table with the student_id equal to 1

**HTTP Request:** POST  
**URL:** https://warm-ocean-22527.herokuapp.com/api/students  
**RESULT:** creates a new row in the student table

**HTTP Request:** DELETE  
**URL:** https://warm-ocean-22527.herokuapp.com/api/students/1  
**RESULT:** deletes an individual row from the student table with the student_id equal to 1

### HTTP Request Examples, Rows with Foreign Keys and Parent\Child Relationships

The tables below have one or more foreign keys.

| Table                | Foreign Key 1   | Foreign Key 2 |
| -------------------- | --------------- | ------------- |
| subcommunity         | community_id    |               |
| exchange             | student_id      |               |
| challenge_entry      | challenge_id    | student_id    |
| student_subcommunity | subcommunity_id | student_id    |

GET requests can be made to retrieve row(s) that match foreign key(s).

**HTTP Request:** GET  
**URL:** https://warm-ocean-22527.herokuapp.com/api/subcommunities/communities/1  
**RESULT:** retrieves all subcommunities that have a foreign key community_id equal to 1

**HTTP Request:** GET  
**URL:** https://warm-ocean-22527.herokuapp.com/api/challenge-entries/students/2/challenges/1  
**RESULT:** Retrieves all challenge entries that have a student_id equal to 2 and a challenge_id equal to 1

## Technology

### Front-End

- React
- Vanilla CSS
- Semantic HTML
- Chart.js
- React-Date-Picker
- Deployment : Vercel

### Back-End

- Node.js
- Express
- PSQL Database
- Chai
- Deployment: Heroku
