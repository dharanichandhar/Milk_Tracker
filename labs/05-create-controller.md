# Lab 05 - Create endpoint controllers

## Part 1: Create controllers

In this lab, we are going to create controllers for the following endpoints

- Add a customer to the database
- Get the customer details
- Add a subscription between the customer and the vendor
- Remove a subscription between customer and vendor

For each endpoint, think about the following

- Should it be GET or POST ?
- What should the parameters be ?
- Should parameters be in the URL or in the request body ?

Then implement the endpoint. Test it with Bruno

## Part 2: Update controller

Now, although we can add and remove subscription, we can't get the subscription details.

Instead of having a separate API for that, we will modify the `GET /vendors/{vendor_id}` and `GET /customers/{customer_id}` endpoints

- Modify the endpoint for getting the vendor details. Along with existing details, make it return a list of all subscriptions that the vendor has
- Similarly modify the endpoint for customer details. It should return all the customers subscriptions along with the customer details

Think about the following

- Can there be more than one subscription for a vendor?
- What data type should this data have ?
- How should I represent this in the code?

After you have answers to the questions, then implement the code

Then repeat for the customer details endpoint

## Part 3: Testing

- How do we know if our code is working or not?
- What all should be the test cases? 
