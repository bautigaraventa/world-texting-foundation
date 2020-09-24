# world-texting-foundation

Messaging acronyms are everywhere now. Do you know all of them?

World Texting Foundation (WTF) is a service to search for acronyms.

It's a REST API developed in node.js with typescript.


# To start the project
    - make sure you have mongoDB installed on your machine
    - npm install
    - set .env file (see section below)
    - npm run dev
    - the application will start running on http://localhost:[PORT]


# .env example
    - PORT=3000 => the port where our server will listen to requests

# Tests
As a testing library we use jest (https://jestjs.io/):

    - npm test