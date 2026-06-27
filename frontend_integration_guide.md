# Valens E-commerce Backend — Frontend Integration Guide

**Base URL:** `http://valens-api.runasp.net`  
**Authentication:** Authorization Header with Bearer Token (`Authorization: Bearer <JWT_TOKEN>`).

---

## Table of Contents

1. [Architecture & Design](#1-architecture--design)
2. [API Endpoints Reference](#2-api-endpoints-reference)
   - [2.1 Authentication & Profile](#21-authentication--profile)
   - [2.2 Category Management](#22-category-management)
   - [2.3 Coupon Management](#23-coupon-management)
   - [2.4 Customer Management](#24-customer-management)
   - [2.5 Expense Management](#25-expense-management)
   - [2.6 Order Management](#26-order-management)
   - [2.7 Product Management](#27-product-management)
   - [2.8 Reports & Dashboard](#28-reports--dashboard)
   - [2.9 Settings & Configurations](#29-settings--configurations)
3. [Request & Response DTO Structures](#3-request--response-dto-structures)
4. [Validation & Business Rules](#4-validation--business-rules)
5. [Frontend Integration Best Practices](#5-frontend-integration-best-practices)

---

## 1. Architecture & Design

The Valens API supports a comprehensive, multi-tenant e-commerce system featuring multi-attribute products (flavors/sizes), secure cart validation, coupon calculations, internal expense monitoring, and admin reporting.

### Key Concepts

| Concept | Detail |
|---------|--------|
| **Product Variants** | Products can have `VariantType` as `"size"`, `"flavor"`, `"both"`, or `"none"`. Stock quantities and pricing are automatically managed on the variant level if variants are defined. |
| **Order Number System** | Order numbers are automatically generated with the prefix `VL-` followed by a unique timestamp (e.g., `VL-20260627194000123`). |
| **Server-Side Checkout Calculations** | Cart totals, coupon constraints, and stock reserves are validated dynamically in a database transaction to prevent user tampering. |
| **Visibility Status Toggles** | Simple toggle endpoints allow immediate storefront activation or deactivation of categories (`IsActive`), products (`Visible`), and coupons (`IsActive`). |

---

## 2. API Endpoints Reference

### 2.1 Authentication & Profile

All endpoints are grouped under `/api/auth`.

#### `POST /api/auth/register-customer`
Registers a new customer.
* **Request Body:** `RegisterDto`
* **Response:** `200 OK` -> `AuthResponseDto`

#### `POST /api/auth/register-new-admin`
Registers a new admin account. (Requires Admin role).
* **Request Body:** `RegisterDto`
* **Response:** `200 OK` -> `AuthResponseDto`

#### `POST /api/auth/login-user`
Authenticates a user (Customer or Admin) and returns a JWT token.
* **Request Body:** `LoginDto`
* **Response:** `200 OK` -> `AuthResponseDto`

#### `POST /api/auth/forgot-password`
Generates and sends a 6-digit OTP code to the provided email.
* **Request Body:** `{ "email": "user@example.com" }`
* **Response:** `200 OK` -> `{ "message": "OTP verification code sent to your email." }`

#### `POST /api/auth/reset-password-otp`
Resets the password using the OTP. Does not require passing the email address (resolved by the backend).
* **Request Body:**
  ```json
  {
    "otpCode": "123456",
    "newPassword": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }
  ```
* **Response:** `200 OK` -> `{ "message": "Password has been reset successfully." }`

#### `POST /api/auth/change-customer-password`
Changes the logged-in customer's password. (Requires Customer token).
* **Request Body:** `ChangePasswordDto`
* **Response:** `200 OK` -> `{ "message": "Password updated successfully." }`

#### `POST /api/auth/change-admin-password`
Changes the logged-in admin's password. (Requires Admin token).
* **Request Body:** `ChangePasswordDto`
* **Response:** `200 OK` -> `{ "message": "Admin password updated successfully." }`

---

### 2.2 Category Management

All endpoints are grouped under `/api/categories`.

#### `GET /api/categories/list-active-product-categories`
Gets active categories for customer storefront.
* **Response:** `200 OK` -> `IEnumerable<Category>`

#### `GET /api/categories/list-admin-product-categories`
Gets all categories (active & inactive) for admin panel. (Requires Admin token).
* **Response:** `200 OK` -> `IEnumerable<Category>`

#### `POST /api/categories/create-product-category`
Creates a new category. (Requires Admin token).
* **Request Body:** `CategoryDto`
* **Response:** `201 Created` -> `Category`

#### `POST /api/categories/update-product-category`
Updates an existing category. (Requires Admin token).
* **Request Body:** `UpdateCategoryDto`
* **Response:** `204 NoContent`

#### `POST /api/categories/delete-product-category`
Deletes a category. (Requires Admin token).
* **Request Body:** `{ "id": "uuid-here" }`
* **Response:** `204 NoContent`

#### `POST /api/categories/toggle-product-category`
Toggles active status of a category. (Requires Admin token).
* **Request Body:** `{ "id": "uuid-here" }`
* **Response:** `204 NoContent`

---

### 2.3 Coupon Management

All endpoints are grouped under `/api/coupons`.

#### `POST /api/coupons/validate-coupon`
Validates a coupon code against the cart items. Calculates subtotal, discount, and new total.
* **Request Body:** `ValidateCouponDto`
* **Response:** `200 OK`
  ```json
  {
    "code": "FIRST10",
    "discountType": "percentage",
    "discountValue": 10.00,
    "minOrderAmount": 500.00,
    "subtotal": 2400.00,
    "discountAmount": 240.00,
    "newTotal": 2160.00
  }
  ```

#### `GET /api/coupons/list-admin`
Lists all coupons. (Requires Admin token).
* **Response:** `200 OK` -> `IEnumerable<Coupon>`

#### `POST /api/coupons/create-coupon`
Creates a new coupon. (Requires Admin token).
* **Request Body:** `CouponDto`
* **Response:** `201 Created` -> `Coupon`

#### `POST /api/coupons/update-coupon`
Updates an existing coupon. (Requires Admin token).
* **Request Body:** `CouponDto` (Ensure the `id` field is set)
* **Response:** `204 NoContent`

#### `POST /api/coupons/delete-coupon`
Deletes a coupon. (Requires Admin token).
* **Request Body:** `{ "id": "uuid-here" }`
* **Response:** `204 NoContent`

#### `POST /api/coupons/toggle-coupon`
Toggles the active state of a coupon. (Requires Admin token).
* **Request Body:** `{ "id": "uuid-here" }`
* **Response:** `204 NoContent`

---

### 2.4 Customer Management

All endpoints are grouped under `/api/customers`.

#### `POST /api/customers/list-admin-customers`
Retrieves customers with search filters. (Requires Admin token).
* **Request Body:** `{ "search": "customer name" }`
* **Response:** `200 OK` -> `IEnumerable<Customer>`

#### `POST /api/customers/detail-admin-customer`
Retrieves customer details. (Requires Admin token).
* **Request Body:** `{ "id": "customer-id" }`
* **Response:** `200 OK` -> `Customer`

#### `PUT /api/customers/update-profile`
Updates the logged-in customer's profile. (Requires Customer token).
* **Request Body:** `UpdateProfileDto`
* **Response:** `204 NoContent`

---

### 2.5 Expense Management

All endpoints are grouped under `/api/expenses`.

#### `POST /api/expenses/list-admin-expenses`
Lists expenses with search filters. (Requires Admin token).
* **Request Body:** `ExpenseFilterDto`
* **Response:** `200 OK` -> `IEnumerable<Expense>`

#### `POST /api/expenses/create-expense`
Creates a new expense log. (Requires Admin token).
* **Request Body:** `ExpenseDto`
* **Response:** `201 Created` -> `Expense`

#### `POST /api/expenses/update-expense`
Updates an existing expense. (Requires Admin token).
* **Request Body:** `ExpenseDto` (Ensure the `id` field is set)
* **Response:** `204 NoContent`

#### `POST /api/expenses/delete-expense`
Deletes an expense log. (Requires Admin token).
* **Request Body:** `{ "id": "uuid-here" }`
* **Response:** `204 NoContent`

---

### 2.6 Order Management

All endpoints are grouped under `/api/orders`.

#### `POST /api/orders/checkout-order`
Submits a cart checkout order.
* **Request Body:** `CheckoutDto`
* **Response:** `200 OK` -> `Order` (Returns full details with generated order code)

#### `GET /api/orders/my-history`
Gets the logged-in user's order history. (Requires Customer token).
* **Response:** `200 OK` -> `IEnumerable<Order>`

#### `POST /api/orders/list-admin-orders`
Retrieves all orders with filters. (Requires Admin token).
* **Request Body:** `OrderAdminFilterDto`
* **Response:** `200 OK` -> `IEnumerable<Order>`

#### `POST /api/orders/update-order-status`
Updates order status (e.g. Pending, Confirmed, Shipped, Delivered, Cancelled). Confirmed triggers email. (Requires Admin token).
* **Request Body:** `OrderStatusUpdateDto`
* **Response:** `204 NoContent`

#### `POST /api/orders/update-order-details`
Allows editing order customer/shipping details after creation.
* **Request Body:** `UpdateOrderDto`
* **Response:** `204 NoContent`

---

### 2.7 Product Management

All endpoints are grouped under `/api/products`.

#### `POST /api/products/list-products`
Gets product catalog with filters.
* **Request Body:** `ProductFilterDto`
* **Response:** `200 OK` -> `IEnumerable<Product>`

#### `POST /api/products/list-homepage-sections`
Gets active products grouped by landing status.
* **Response:** `200 OK` -> `HomepageSectionsDto`

#### `POST /api/products/detail-product`
Gets a single product's detail by ID.
* **Request Body:** `{ "id": "product-uuid" }`
* **Response:** `200 OK` -> `Product`

#### `POST /api/products/create-product`
Creates a product with variant configs. (Requires Admin token).
* **Request Body:** `ProductUpsertDto`
* **Response:** `200 OK` -> `Product`

#### `POST /api/products/update-product`
Updates a product posting. (Requires Admin token).
* **Request Body:** `ProductUpsertDto` (Ensure the `id` field is set)
* **Response:** `204 NoContent`

#### `POST /api/products/delete-product`
Deletes a product posting. (Requires Admin token).
* **Request Body:** `{ "id": "uuid-here" }`
* **Response:** `204 NoContent`

#### `POST /api/products/toggle-product`
Toggles product active status (`Visible`). (Requires Admin token).
* **Request Body:** `{ "id": "uuid-here" }`
* **Response:** `204 NoContent`

---

### 2.8 Reports & Dashboard

All endpoints are grouped under `/api/reports`.

#### `GET /api/reports/dashboard-summary`
Gets analytics overview (sales, orders count, categories counts, expenses total). (Requires Admin token).
* **Response:** `200 OK` -> Returns key-value summary.

---

### 2.9 Settings & Configurations

All endpoints are grouped under `/api/settings`.

#### `GET /api/settings/store-config`
Gets phone, email, shipping cost, and threshold.
* **Response:** `200 OK`

#### `GET /api/settings/homepage-config`
Gets hero sliders, banners, and titles.
* **Response:** `200 OK`

#### `PUT /api/settings/update-store-config`
Updates general configurations. (Requires Admin token).
* **Request Body:** `UpdateStoreSettingsDto`
* **Response:** `204 NoContent`

#### `PUT /api/settings/update-homepage-config`
Updates hero titles and banner images. (Requires Admin token).
* **Request Body:** `UpdateHomepageSettingsDto`
* **Response:** `204 NoContent`

#### `POST /api/settings/homepage-overview`
Retrieves consolidated homepage data (Settings, Categories, and Products) in a single request.
* **Request Body:** `{}` (or empty body)
* **Response:** `200 OK` -> `HomepageDataDto`

---

## 3. Request & Response DTO Structures

### `CartItemDto`
```json
{
  "productId": "Guid",
  "variantId": "string? (Optional)",
  "size": "string? (Optional)",
  "flavor": "string? (Optional)",
  "quantity": "int"
}
```

### `CheckoutDto`
```json
{
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "shippingAddress": "string",
  "shippingCity": "string",
  "couponCode": "string? (Optional)",
  "items": [ { ...CartItemDto } ]
}
```

### `ValidateCouponDto`
```json
{
  "code": "string",
  "items": [ { ...CartItemDto } ]
}
```

### `ProductUpsertDto`
```json
{
  "id": "Guid? (Null for creation)",
  "name": "string",
  "category": "string",
  "description": "string",
  "featured": "bool",
  "bestSeller": "bool",
  "newArrival": "bool",
  "visible": "bool",
  "variantType": "string (none, size, flavor, both)",
  "variants": [
    {
      "id": "string",
      "size": "string",
      "flavor": "string",
      "price": "decimal",
      "discountPrice": "decimal",
      "stockQuantity": "int",
      "sku": "string",
      "image": "string (base64 or url)",
      "isAvailable": "bool"
    }
  ],
  "price": "decimal",
  "discountPrice": "decimal",
  "stock": "int",
  "mainImage": "string (base64)",
  "images": ["string (base64)"]
}
```

---

## 4. Validation & Business Rules

1. **Cart Variant Selection**:
   - If `VariantType` is not `"none"`, the client must send either the explicit `variantId` OR the selected `size` and `flavor` attributes in `CartItemDto`.
   - The backend automatically resolves the correct price and decrements stock accordingly.
2. **Required Order Fields**: Checkout payloads must contain non-empty shipping fields. Empty fields are rejected with a `400 BadRequest`.
3. **Admin Actions Validation**: Endpoints under the Admin role constraints check user token roles. Unauthorized requests return `401 Unauthorized` or `403 Forbidden`.

---

## 5. Frontend Integration Best Practices

- **Image Uploading**: Upload slider, banner, or product images as base64 strings. The backend resolves the data and saves it locally.
- **Debounced Search Inputs**: Implement a debounce of 300-500ms for catalog search and expense filter inputs to prevent overwhelming database queries.
- **Handling Server-Side Totals**: Use the coupon validate response values (`subtotal`, `discountAmount`, `newTotal`) directly to display payment details in the cart checkout UI.
