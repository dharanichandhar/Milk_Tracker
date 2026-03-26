# Lab 06 - UI and Testing

In this lab, we are going to build end-to-end workflow with testing. 

We will build a functionality to show all vendors and customers on the UI

## Step 0: Sync the code

- First, create a git branch and commit all your code in the branch
- Then come back to the main branch and pull the latest code from github
- Run uv sync to get the latest dependencies (like pytest)
- Then start the lab

## Step 1: Backend

Create API to

- Get all customers
- Get all vendors

## Step 2: Frontend

Update `index.html` to call both the newly created APIs and show all the Vendors as a list under one heading and all Cusomters under another heading

## Step 3: Testing

Use pytest and write tests for the following features:

- Customer subscribes to vendor when the subscription already exists
- Customer removes a subscription from a vendor
- Customer removes a subscription but they were not subscribed
- Get all customers
- Get all vendors

# Review

Review the following topics

- REST API: What is an API, how does it work, what is request / response header, what are status codes?
- Alembic: What is alembic? What is a database migration? What is upgrade command? What is downgrade command? How does it work?
- Javascript features
  -  Template string '...'  "..." `....`  ( Python f"...." )
  - Promises
  - arrow function
  - async / await <-- we will use this later (asynchronous)