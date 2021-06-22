# Ticket System

This is a simple rest api allowing to book tickets for a event.


### ADD THREE CONFIG FILES :<br />

![config](https://user-images.githubusercontent.com/15052640/67874962-00b24680-fb36-11e9-8eb3-434a1ad5265f.png)<br />
content:

- **dev.env:**<br />
  `PORT=3000`<br />
  `MONGODB_URI=mongodb://127.0.0.1:27017/monte-tickets`<br />
  `UNIFIED_TOPOLOGY=false`<br />
  `AUTO_RECONNECT=true`<br />
- **test.env:**<br />
  `PORT=3000`<br />
  `MONGODB_URI=mongodb://127.0.0.1:27017/monte-tickets-test`<br />
  `UNIFIED_TOPOLOGY=false`<br />
  `AUTO_RECONNECT=true`<br />

here we are swaping unified_topology and auto_reconnect to make it work in docker
(it is a little hack as autoReconnect option for mongoose will be soon deprecated and we will have to implement our own reconnect mechanism)
- **dc.env:**<br />
  `PORT=3000`<br />
  `MONGODB_URI=mongodb://mongo:27017/monte-tickets-docker`<br />
  `UNIFIED_TOPOLOGY=true`<br />
  `AUTO_RECONNECT=false`<br />

## Install

    npm install

## Run the app

    npm run dev

## Run the tests

    npm run test

## Run with docker

    docker-compose up --build

## Build docker image

    docker build -t <TAG_NAME> .

## Run docker image

    docker run -p80:3000 <TAG_NAME>

# REST API

The REST API endpoints are described below.

## Create new reservation

### Request

`POST /reservations`

    {"eventId":"<id>","sellingOption":2, "seats": { "B": [5, 6]  } }

### Response

    "reservation": {
        "isPaid": false,
        "_id": "60d2107674c3cd19b78d5852",
        "sellingOption": 2,
        "ticketQuantity": 2,
        "totalAmount": 60
    }

## Pay for a reservation

### Request

`POST /payment`

    {"reservationId":"60d2107674c3cd19b78d5852","token":"" }

### Response

    {
        "_id": "60d2107d74c3cd19b78d5857",
        "reservation": "60d2107674c3cd19b78d5852",
        "createdAt": "2021-06-22T16:31:57.085Z",
        "updatedAt": "2021-06-22T16:31:57.085Z",
        "__v": 0
    }
