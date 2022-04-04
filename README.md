# Notes Project
> [Start taking notes!](https://notes-project-1.netlify.app/)


[![Netlify Status](https://api.netlify.com/api/v1/badges/c1b566dd-bdf3-487c-a177-fdc2aacb6542/deploy-status)](https://app.netlify.com/sites/jovial-engelbart-bf785b/deploys)

<p align="center">
  <b>Notes-taking app. A fast and open-source alternative!</b>
  <img src="docs/webappscreenshot3.png"/> 
</p>

# Contribution 🤝
All contribution are welcome.\
Please check the [issues](https://github.com/Ruberoni/notes-project/issues) or create one.

# Goals 🚩
- [X] Learn Hapi basics
- [X] Learn Graphql
- [X] Improve my TypeScript
- [X] Improve my React
- [X] Learn Auth0

# Features 🏏
- [X] Write and save notes as fast as possible.
- [X] Use markdown to edit your notes
- [X] Group notes using categories.
- [X] Login with google!
- [X] Full responsive.
- [X] Filter and search notes.
- [X] Secure authentication with Auth0.

# Dependencies 🧠
## Client side
- Yarn 1.22.x
- Charkra-UI/React ^1.6.6
- React ^17.0.2
- React Router Dom ^5.3.0
- Typescript ^4.1.2
- Graphql ^15.5.3
- Apollo Client ^3.4.11
- Auth0 React ^1.8.0

## Server side
- Yarn 1.22.x
- Mysql2 ^2.3.0
- Graphql ^15.5.1
- Typescript ^4.3.5
- Hapi ^20.1.5
- Apollo Server Hapi ^3.1.2
- Type Graphql ^1.1.1
- ts-node ^10.2.0
# Run the app 🚗
## Before all
### Requirements
- Node.js
- Yarn
- You need an Auth0 account, with an API and a applications registered.
- You need a MySQL Server

1. Clone this repo
```
git clone https://github.com/Ruberoni/notes-project.git
```
## Client side

1. Change directory to `client/`
2. Install the modules. Run:
```
yarn
```
3. Setup these enviorment variables:
```
REACT_APP_AUTH0_DOMAIN=     Auth0 application domain
REACT_APP_AUTH0_CLIENT_ID=  Auth0 application client ID
REACT_APP_AUTH0_AUDIENCE=   Auth0 API Audience

REACT_APP_SERVER_URI=       [optional] Server uri to request the data
```
4. Start the app by running:
```
yarn start
```

## Server side

1. Change directory to `server/`
2. Install the modules by running:
```
yarn
```
3. Setup these enviorment variables:
```
PORT

DB_NAME
DB_USER
DB_HOST
DB_PASSWORD
DB_CACERT=        [optional] certificate for a secure MySQL connection. 

DB_TEST_USER
DB_TEST_HOST
DB_TEST_PASSWORD

AUTH0_DOMAIN=     Auth0 application domain
AUTH0_CLIENT_ID=  Auth0 application client ID
AUTH0_AUDIENCE=   Auth0 API Audience

BASIC_SECRET=     Secret for the authentication of basicSecret strategy
```
4. Start the server. Run:
```
yarn dev
```
If you have problems starting the server, try copy-pasting the command ran by `yarn dev`
# Attribution 🤼‍♂️
An image from [slidesgo / Freepik](http://www.freepik.com) has been used.
# Contact me! 📞
Email me: [ruben.pardes25@gmail.com](mailto:ruben.pardes25@gmail.com)\
Discord: Ruberoni#8428