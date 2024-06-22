# E-shop backend

The repository contains backend code for eshop / e-commerce application. Frontend code can be found [here](https://github.com/JayTailor45/mean-nx-eshop).

This application contains all the routes which is used by admin app as well as client app.

### Features:

- Admin
    - View data such as orders, products, total sales etc... on the dashboard
    - `list` / `add` / `update` / `delete` products
    - `list` / `add` / `update` / `delete` categories
    - `list` orders and `update` order status
- User
    - Login into application
    - View products
    - View categories
    - Filter products by category
    - Add products to cart
    - Update product quantity of cart
    - Place order
    - Do online payment using stripe

### Technology used:

- NodeJS (Runtime)
- Javascript (Language)
- Express (REST API)
- Stripe (Payment Gateway)
- Mongodb (Database)
- Mongoose (ODM)
- Multer (file upload)
- Bcrypt (Password encryption)
- JWT (Authentication and Authorization)
- Mongo Express (database tool)

> API documentation can be found in APIs.http file.

### Steps to run the project

1. Install **Docker** with **Compose**
2. Clone project
3. Copy `.env-example` and paste as `.env` and update env variables
4. Run ```docker compose up -d```
5. Add first admin use manually using **mongo express** at http://localhost:8081/db/eshop/users