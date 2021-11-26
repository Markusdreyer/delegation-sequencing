# Getting started

## Frontend

### Local

`npm run start`

### Deploy

`npm run deploy`

## Firebase local

When testing and developing, all firebase features should be emulated, so that it won't interfere with the production data.

To run firestore and functions emulator:
`firebase emulators:start`

The emulatore does not currently persist the data, so it will be reset when it's shut down. To store the data for later use, run the following command while the emulator is running:
`firebase emulators:export seed`

To start up the emulator with data from the previous session run the following command:
`firebase emulators:start --import seed`

If there's been changed to the backend API, the service has to be built in advance:
`cd backend/functions && npm run build`

## Firebase deploy

TODO: Should suffice to run
`firebase deploy`
