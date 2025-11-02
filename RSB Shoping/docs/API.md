# RSB Shopping API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer your-token-here
```

## API Endpoints

### Authentication

#### Register User
```
POST /auth/register
```
Request body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```
POST /auth/login
```
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

### Products

#### Get All Products
```
GET /products
```
Query parameters:
- page (default: 1)
- limit (default: 10)
- category
- minPrice (in paise)
- maxPrice (in paise)
- sort (price_asc, price_desc, rating)
- search

#### Get Product by ID
```
GET /products/:id
```

#### Create Product (Admin only)
```
POST /products
```
Request body:
```json
{
  "title": "string",
  "description": "string",
  "price": "number (in paise)",
  "category": "string",
  "stockQty": "number",
  "attributes": [
    {
      "name": "string",
      "values": ["string"]
    }
  ],
  "sku": "string",
  "isGSTApplicable": "boolean"
}
```

### Cart

#### Get Cart
```
GET /cart
```

#### Add to Cart
```
POST /cart
```
Request body:
```json
{
  "productId": "string",
  "quantity": "number"
}
```

### Orders

#### Create Order
```
POST /orders
```
Request body:
```json
{
  "addressId": "string",
  "paymentId": "string",
  "paymentMethod": "string"
}
```

#### Get User Orders
```
GET /orders
```

#### Get Order by ID
```
GET /orders/:id
```

### Pincodes

#### Check Pincode
```
GET /pincodes/check/:pincode
```
Response:
```json
{
  "success": true,
  "data": {
    "deliverable": "boolean",
    "city": "string",
    "state": "string",
    "estimatedDays": "number"
  }
}
```

#### Autocomplete Pincode
```
GET /pincodes/autocomplete?query=110
```

### Payments

#### Create Razorpay Order
```
POST /payments/razorpay/create-order
```
Request body:
```json
{
  "amount": "number (in paise)"
}
```

#### Verify Razorpay Payment
```
POST /payments/razorpay/verify
```
Request body:
```json
{
  "razorpay_order_id": "string",
  "razorpay_payment_id": "string",
  "razorpay_signature": "string"
}
```

### Reviews

#### Add Product Review
```
POST /products/:id/reviews
```
Request body:
```json
{
  "rating": "number (1-5)",
  "title": "string",
  "review": "string"
}
```

#### Get Product Reviews
```
GET /products/:id/reviews
```

### User Management

#### Update User Profile
```
PUT /auth/profile
```
Request body:
```json
{
  "name": "string",
  "email": "string"
}
```

#### Add Address
```
POST /auth/addresses
```
Request body:
```json
{
  "name": "string",
  "phone": "string",
  "street": "string",
  "city": "string",
  "state": "string",
  "pincode": "string (6 digits)",
  "isDefault": "boolean"
}
```

### Admin Endpoints

#### Get All Users (Admin only)
```
GET /admin/users
```

#### Update Order Status (Admin only)
```
PUT /admin/orders/:id/status
```
Request body:
```json
{
  "status": "string",
  "comment": "string"
}
```

#### Export Orders (Admin only)
```
GET /admin/orders/export
```
Query parameters:
- startDate
- endDate
- format (csv/excel)

## Error Responses
All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP
- Applies to all endpoints
- Response headers include rate limit info:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset