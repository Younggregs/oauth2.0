# My Express App

This is a simple OAuth 2.0 application built with TypeScript.

## Project Structure

```
my-express-app
├── src
│   ├── app.ts               # Entry point of the application
│   ├── controllers          # Contains controllers for handling requests
│   │   └── index.ts         # Index controller
│   ├── routes               # Contains route definitions
│   │   └── index.ts         # Route setup
│   └── types                # Type definitions
│       └── index.ts         # Custom types for requests and responses
├── package.json             # NPM package configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Installation

To install the necessary dependencies, run:

```
npm install
```

## Running the Application

To start the application, use the following command:

```
npm start
```

Only known clients can access the application, allowed clients are specified in
the constants file in the list: ALLOWED_CLIENT_IDS

## License

This project is licensed under the MIT License.
