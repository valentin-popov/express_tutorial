# CRUD Express App
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Pug](https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454)

This is a simple CRUD application that follows the MVC pattern, built using the Express.js framework. 

## Database collections

The information is stored in 4 collections: books, authors, genres and book instances.

The relationships between the entities from different collections are the following:
* A book has a single author.
* A book has multiple genres.
* A book has multiple book instances.

## Prerequisites

Before you can run this application, you will need to have the following installed on your machine:

- Node.js (version 10 or higher)
- npm (version 6 or higher)
- MongoDB (version 3 or higher)

## Installation

1. Clone the repository to your local machine.
2. Go to the root directory of the project and install all the dependencies using `npm install`.
3. Create a `.env` file in the root directory of the project and add the following environment variable:
`MONGODB_URI=<your_mongodb_uri>`
4. Start the application using `npm run start`.



