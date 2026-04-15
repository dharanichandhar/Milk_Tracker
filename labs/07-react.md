# Lab 7: First version of app end to end

In this homework, we should create the first version of the lab end to end. It should have:

1. Login page (can be done with jinja or react + api)
2. Dashboard page (react + api)

## Home page

- If the user is already logged in -> Redirect to /dashboard
- If the user is not logged in -> Redirect to /login

## Login page

Same as before

Choose any design as per your preference

- Can have a common login form with a dropdown to choose customer / vendor
- Can have two separate forms on the same page for customer login and vendor login

## Dashboard

If logged in as vendor, display vendor dashboard component, otherwise display customer dashboard component

To do this, create an api endpoint `/api/me` that will return details of currently logged in user

- name
- id
- login type (customer / vendor)

Then call this API when the dashboard is loaded and display the appropriate component

**Tip**: To display a component based on condition, you can use the ternary operator

```js
{condition ? then : else}
```

### Vendor Dashboard

Display the current vendor name. Display a list of customers

**Tip**: Create a `Customer` component that will take the details of a single customer and render it. Example: `<Customer id="20" name="Anjali" />

**Tip**: To take a list and render a component for each item in the list, you can use the `map` function

```js
{customers.map((c) => <Customer id={c.id} name={c.name}>)}
```

### Customer Dashboard

Display the current customer name. Display a list of vendors that they are subscribed to. Have "unsubscribe" button for each vendor. Display another list of remaining vendors that they are not subscribed to. Have "subscribe" button for each vendor.

Clicking the subscribe / unsubscribe button should do the operation in API and also update the UI (move vendor from one list to another)