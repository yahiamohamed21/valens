# Valens E-commerce Backend — Frontend Integration Guide

**Base URL:** `http://valens-api.runasp.net` (or local dev URL e.g. `http://localhost:5000` / `https://localhost:5001`)  
**Swagger UI Path:** `/swagger`  
**Authentication:** Authorization Header with Bearer Token (`Authorization: Bearer <JWT_TOKEN>`).

---

## Table of Contents

1. [Architecture & Design](#1-architecture--design)
2. [API Endpoints Reference](#2-api-endpoints-reference)
   - [2.1 Authentication & Token Management](#21-authentication--token-management)
   - [2.2 Category Management](#22-category-management)
   - [2.3 Coupon Management](#23-coupon-management)
   - [2.4 Customer Management](#24-customer-management)
   - [2.5 Expense Management](#25-expense-management)
   - [2.6 Order Management](#26-order-management)
   - [2.7 Product Management](#27-product-management)
   - [2.8 Reports & Dashboard](#28-reports--dashboard)
   - [2.9 Settings & Governorate Shipping](#29-settings--governorate-shipping)
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
| **Order Number System** | Order numbers are automatically generated as a sequential counter with the prefix `VL-` (e.g., `VL-10001`, `VL-10002`, ...). The counter starts at `10001` and auto-increments with every new order. |
| **Server-Side Checkout Calculations** | Cart totals, coupon constraints, and stock reserves are validated dynamically in a database transaction to prevent user tampering. |
| **Visibility Status Toggles** | Simple toggle endpoints allow immediate storefront activation or deactivation of categories (`IsActive`), products (`Visible`), and coupons (`IsActive`). |
| **Global CamelCase Formatting** | All JSON request payloads and response payloads are parsed in `camelCase` format on the API boundary. |

---

## 2. API Endpoints Reference

### 2.1 Authentication & Token Management

All endpoints are grouped under `/api/auth`.

#### `POST /api/auth/register-customer`
Registers a new customer.
* **Request Body:** `RegisterDto` (application/json)
* **Response:** `200 OK` -> `AuthResponseDto`

#### `POST /api/settings/create-admin-account`
Creates/registers a new admin account. Restricted strictly to existing logged-in admins. (Requires Admin token).
* **Request Body:** `RegisterDto` (application/json)
* **Response:** `200 OK` -> `AuthResponseDto` (Tokens will be returned as empty strings to keep your current admin session active).

#### `POST /api/auth/login-user`
Authenticates a user (Customer or Admin) and returns a JWT token.
* **Request Body:** `LoginDto` (application/json)
* **Response:** `200 OK` -> `AuthResponseDto`

#### `POST /api/auth/forgot-password`
Generates and sends a 6-digit OTP code to the provided email.
* **Request Body:** `ForgotPasswordRequestDto` (application/json)
* **Response:** `200 OK` -> `{ "message": "OTP verification code sent to your email." }`

#### `POST /api/auth/reset-password-otp`
Resets the password using the OTP.
* **Request Body:** `ResetPasswordWithOtpDto` (application/json)
* **Response:** `200 OK` -> `{ "message": "Password has been reset successfully." }`

#### `POST /api/auth/change-customer-password`
Changes the logged-in customer's password. (Requires Customer token).
* **Request Body:** `ChangePasswordDto` (application/json)
* **Response:** `200 OK` -> `{ "message": "Password updated successfully." }`

#### `POST /api/auth/change-admin-password`
Changes the logged-in admin's password. (Requires Admin token).
* **Request Body:** `ChangePasswordDto` (application/json)
* **Response:** `200 OK` -> `{ "message": "Admin password updated successfully." }`

#### `POST /api/auth/refresh-token`
Exchanges an expired access token and a valid refresh token for a new token pair.
* **Request Body:** `TokenRequestDto` (application/json)
* **Response:** `200 OK` -> `AuthResponseDto`

#### `POST /api/auth/revoke-token`
Revokes/invalidates a user's refresh token.
* **Request Body:** `RevokeTokenDto` (application/json)
* **Response:** `200 OK` -> `{ "message": "Refresh token revoked successfully." }`

---

### 2.2 Category Management

All endpoints are grouped under `/api/categories`.

#### `GET /api/categories/list-active-product-categories`
Gets active categories for customer storefront.
* **Response:** `200 OK` -> `IEnumerable<Category>`

#### `GET /api/categories/list-admin-product-categories`
Gets all categories (active & inactive) for admin panel. (Requires Admin token).
* **Response:** `200 OK` -> `IEnumerable<Category>`

> [!WARNING]
> **Important note for Dropdowns:** When populating the category selection dropdown on the Admin Product Creation/Edit forms, the frontend **MUST** call `/api/categories/list-active-product-categories` (active only). The `/api/categories/list-admin-product-categories` endpoint returns all categories, including hidden/inactive ones, and is intended strictly for the Admin Category Management page.

#### `POST /api/categories/create-product-category`
Creates a new category. (Requires Admin token).
* **Request Body:** `CategoryDto` (application/json)
* **Response:** `211 Created` -> `Category`

#### `POST /api/categories/update-product-category`
Updates an existing category. (Requires Admin token).
* **Request Body:** `UpdateCategoryDto` (application/json)
* **Response:** `204 NoContent`

#### `POST /api/categories/delete-product-category`
Deletes a category. (Requires Admin token).
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `204 NoContent`

#### `POST /api/categories/toggle-product-category`
Toggles active status of a category. (Requires Admin token).
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `204 NoContent`

---

### 2.3 Coupon Management

All endpoints are grouped under `/api/coupons`.

#### `POST /api/coupons/validate-coupon`
Validates a coupon code against the cart items. Calculates subtotal, discount, and new total.
* **Request Body:** `ValidateCouponDto` (application/json)
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
* **Request Body:** `CouponDto` (application/json)
* **Response:** `201 Created` -> `Coupon`

#### `POST /api/coupons/update-coupon`
Updates an existing coupon. (Requires Admin token).
* **Request Body:** `CouponDto` (Ensure the `id` field is set) (application/json)
* **Response:** `204 NoContent`

#### `POST /api/coupons/delete-coupon`
Deletes a coupon. (Requires Admin token).
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `204 NoContent`

#### `POST /api/coupons/toggle-coupon`
Toggles the active state of a coupon. (Requires Admin token).
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `204 NoContent`

---

### 2.4 Customer Management

All endpoints are grouped under `/api/customers`.

#### `POST /api/customers/list-admin-customers`
Retrieves customers with search filters. (Requires Admin token).
* **Request Body:** `CustomerAdminFilterDto` (application/json)
* **Response:** `200 OK` -> `PaginatedList<Customer>`

#### `POST /api/customers/detail-admin-customer`
Retrieves customer details. (Requires Admin token).
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `200 OK` -> `Customer`

#### `PUT /api/customers/update-profile`
Updates the logged-in customer's profile. (Requires Customer token).
* **Request Body:** `UpdateProfileDto` (application/json)
* **Response:** `204 NoContent`

---

### 2.5 Expense Management

All endpoints are grouped under `/api/expenses`.

#### `POST /api/expenses/list-admin-expenses`
Lists expenses with search filters. (Requires Admin token).
* **Request Body:** `ExpenseFilterDto` (application/json)
* **Response:** `200 OK` -> `PaginatedList<Expense>`

#### `POST /api/expenses/create-expense`
Creates a new expense log. (Requires Admin token).
* **Request Body:** `ExpenseDto` (application/json)
* **Response:** `201 Created` -> `Expense`

#### `POST /api/expenses/update-expense`
Updates an existing expense. (Requires Admin token).
* **Request Body:** `ExpenseDto` (Ensure the `id` field is set) (application/json)
* **Response:** `204 NoContent`

#### `POST /api/expenses/delete-expense`
Deletes an expense log. (Requires Admin token).
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `204 NoContent`

---

### 2.6 Order Management

All endpoints are grouped under `/api/orders`.

#### `POST /api/orders/preview-checkout` (Alias: `POST /api/orders/checkout-preview`)
Calculates and previews checkout numbers (subtotal, shipping cost, discount amount, and total) before submitting an actual order. Useful for reactive UI checkout updates (e.g. when governorate changes or coupon is entered).
* **Request Body:** `CheckoutDto` (application/json) (contact/address fields can be empty, but `shippingCity`, `couponCode`, and `items` should be populated)
* **Response:** `200 OK` -> `CheckoutPreviewDto`

#### `POST /api/orders/checkout-order` (Alias: `POST /api/orders/checkout`)
Submits a cart checkout order.
* **If Logged-in (Authenticated):** Auto-fills missing profile shipping details on the server side using the customer's database profile.
* **If Guest (Anonymous):** Full contact/shipping details are strictly required in the payload.
* **Request Body:** `CheckoutDto` (application/json)
* **Response:** `200 OK` -> `Order` (Returns full details with generated order code)

#### `GET /api/orders/my-history`
Gets the logged-in user's order history. (Requires Customer token).
* **Query Parameters:** `pageNumber` (int, default: 1), `pageSize` (int, default: 10)
* **Response:** `200 OK` -> `PaginatedList<Order>`

#### `POST /api/orders/list-admin-orders`
Retrieves all orders with filters. (Requires Admin token).
* **Request Body:** `OrderAdminFilterDto` (application/json)
* **Response:** `200 OK` -> `PaginatedList<Order>`

#### `POST /api/orders/update-order-status`
Updates order status. (Requires Admin token).
* **Request Body:** `OrderStatusUpdateDto` (application/json)
* **Response:** `204 NoContent`

#### `POST /api/orders/update-order-status-by-number`
Updates order status using the visible order code/number (e.g., `VL-10003`). (Requires Admin token).
* **Request Body:** `UpdateOrderStatusByNumberDto` (application/json)
* **Response:** `204 NoContent`

#### `POST /api/orders/update-order-details`
Allows editing order customer/shipping details after creation.
* **Request Body:** `UpdateOrderDto` (application/json)
* **Response:** `204 NoContent`

---

### 2.7 Product Management

All endpoints are grouped under `/api/products`.

#### `POST /api/products/list-products`
Gets product catalog with filters.
* **Request Body:** `ProductFilterDto` (application/json)
* **Response:** `200 OK` -> `PaginatedList<Product>`

#### `POST /api/products/list-homepage-sections`
Gets active products grouped by landing status.
* **Response:** `200 OK` -> `HomepageSectionsDto`

#### `POST /api/products/detail-product`
Gets a single product's detail by ID.
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `200 OK` -> `Product`

#### `POST /api/products/create-product`
Creates a product with variant configs. Supports multipart file uploads and base64. (Requires Admin token).
* **Request Type:** `multipart/form-data`
* **Request Body:** `ProductUpsertDto`
* **Response:** `200 OK` -> `Product`

#### `POST /api/products/update-product`
Updates a product posting. Supports multipart file uploads, base64, and keeping existing images. (Requires Admin token).
* **Request Type:** `multipart/form-data`
* **Request Body:** `ProductUpsertDto` (Ensure the `id` field is set)
* **Response:** `204 NoContent`

#### `POST /api/products/delete-product`
Deletes a product posting. (Requires Admin token).
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `204 NoContent`

#### `POST /api/products/toggle-product`
Toggles product active status (`Visible`). (Requires Admin token).
* **Request Body:** `IdRequestDto` (application/json)
* **Response:** `204 NoContent`

---

### 2.8 Reports & Dashboard

All endpoints are grouped under `/api/reports`.

#### `GET /api/reports/dashboard-summary`
Gets analytics overview. (Requires Admin token).
* **Response:** `200 OK`
  ```json
  {
    "totalSales": 15200.50,
    "totalExpenses": 2500.00,
    "netProfit": 12700.50,
    "salesCount": 18,
    "averageOrderValue": 844.47,
    "salesOverTime": [
      { "date": "2026-06-25", "amount": 4200.00 },
      { "date": "2026-06-26", "amount": 3500.50 }
    ],
    "salesByCategory": [
      { "category": "Proteins", "amount": 8900.00 },
      { "category": "Creatine", "amount": 6300.50 }
    ],
    "expensesByCategory": [
      { "category": "Shipping", "amount": 1200.00 },
      { "category": "Marketing", "amount": 1300.00 }
    ]
  }
  ```

---

### 2.9 Settings & Governorate Shipping

All endpoints are grouped under `/api/settings`.

#### `GET /api/settings/store-config`
Gets store phone, email, global shipping cost, and threshold.
* **Response:** `200 OK`

#### `GET /api/settings/homepage-config`
Gets hero sliders, banners, and landing page details.
* **Response:** `200 OK`

#### `PUT /api/settings/update-store-config`
Updates general configurations. (Requires Admin token).
* **Request Body:** `UpdateStoreSettingsDto` (application/json)
* **Response:** `204 NoContent`

#### `PUT /api/settings/update-homepage-config`
Updates hero titles, banner images, and homepage sliders. (Requires Admin token).
* **Request Type:** `multipart/form-data`
* **Request Body:** `UpdateHomepageSettingsDto`
* **Response:** `204 NoContent`

#### `POST /api/settings/homepage-overview`
Retrieves consolidated homepage data (Settings, Categories, and Products) in a single request.
* **Request Body:** `{}` (or empty body)
* **Response:** `200 OK` -> `HomepageDataDto`

#### `GET /api/settings/governorates`
Gets the list of all 27 Egyptian governorates and their customizable shipping rates. (Public).
* **Response:** `200 OK`
  ```json
  [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "governorateName": "Cairo",
      "shippingCost": 40.00,
      "createdAt": "2026-06-28T22:55:18Z",
      "updatedAt": "2026-06-28T22:55:18Z"
    },
    {
      "id": "4da85f64-5717-4562-b3fc-2c963f66afa6",
      "governorateName": "Giza",
      "shippingCost": 50.00,
      "createdAt": "2026-06-28T22:55:18Z",
      "updatedAt": "2026-06-28T22:55:18Z"
    }
  ]
  ```

#### `PUT /api/settings/update-governorate-shipping`
Updates the shipping cost of a specific governorate. (Requires Admin token).
* **Request Body:** `UpdateGovernorateShippingDto` (application/json)
* **Response:** `204 NoContent`

#### `POST /api/settings/create-governorate-shipping`
Adds a new governorate and its specific shipping cost. (Requires Admin token).
* **Request Body:** `CreateGovernorateShippingDto` (application/json)
* **Response:** `201 Created` -> returns the created `GovernorateShipping` object

---

## 3. Request & Response DTO Structures

All parameters are represented in JSON format (unless using `multipart/form-data` uploads).

### Auth DTOs

#### `RegisterDto`
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "Sarah Hassan",
  "phone": "01234567890",
  "address": "Giza Street, Near Pyramids",
  "city": "Giza"
}
```

#### `LoginDto`
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### `AuthResponseDto`
```json
{
  "token": "eyJhbGciOi...",
  "refreshToken": "7c8e9b55...",
  "email": "user@example.com",
  "fullName": "Sarah Hassan",
  "role": "Customer",
  "phone": "01234567890",
  "address": "Giza Street, Near Pyramids",
  "city": "Giza"
}
```

#### `ForgotPasswordRequestDto`
```json
{
  "email": "user@example.com"
}
```

#### `ResetPasswordWithOtpDto`
```json
{
  "otpCode": "123456",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

#### `ChangePasswordDto`
```json
{
  "oldPassword": "SecurePassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

#### `TokenRequestDto`
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "7c8e9b55..."
}
```

#### `RevokeTokenDto`
```json
{
  "refreshToken": "7c8e9b55..."
}
```

---

### Category DTOs

#### `CategoryDto`
```json
{
  "name": "Whey Protein",
  "isActive": true
}
```

#### `UpdateCategoryDto`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Whey Protein Premium",
  "isActive": true
}
```

---

### Common DTOs

#### `IdRequestDto`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

---

### Coupon DTOs

#### `CouponDto`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6 (Include only for updates)",
  "code": "VALENS10",
  "discountType": "percentage",
  "discountValue": 10.00,
  "minOrderAmount": 500.00,
  "maxUsage": 100,
  "expiryDate": "2026-12-31T23:59:59Z",
  "isActive": true
}
```

#### `ValidateCouponDto`
```json
{
  "code": "VALENS10",
  "items": [
    {
      "productId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
      "variantId": "variant-uuid-here (optional)",
      "size": "1kg (optional)",
      "flavor": "Chocolate (optional)",
      "quantity": 2
    }
  ]
}
```

---

### Customer DTOs

#### `CustomerAdminFilterDto`
```json
{
  "search": "Sarah"
}
```

#### `UpdateProfileDto`
```json
{
  "fullName": "Sarah Hassan",
  "phone": "01234567890",
  "address": "Giza Street, Near Pyramids",
  "city": "Giza"
}
```

---

### Expense DTOs

#### `ExpenseFilterDto`
```json
{
  "search": "Promo",
  "category": "Marketing"
}
```

#### `ExpenseDto`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6 (Include only for updates)",
  "title": "Gym Banner Printing",
  "amount": 250.00,
  "category": "Marketing",
  "date": "2026-06-28T12:00:00Z"
}
```

---

### Order DTOs

#### `CartItemDto`
```json
{
  "productId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
  "variantId": "variant-uuid-here (optional)",
  "size": "1kg (optional)",
  "flavor": "Chocolate (optional)",
  "quantity": 2
}
```

#### `CheckoutDto`
```json
{
  "customerName": "Sarah Hassan",
  "customerEmail": "sarah@example.com",
  "customerPhone": "01234567890",
  "shippingAddress": "Giza Street, Near Pyramids",
  "shippingCity": "Giza",
  "couponCode": "VALENS10",
  "items": [
    {
      "productId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
      "variantId": "variant-uuid-here",
      "quantity": 2
    }
  ]
}
```

#### `CheckoutPreviewDto`
```json
{
  "subtotal": 850.00,
  "shippingCost": 60.00,
  "discountAmount": 100.00,
  "total": 810.00
}
```

#### `OrderAdminFilterDto`
```json
{
  "search": "Sarah",
  "category": "Proteins"
}
```

#### `OrderStatusUpdateDto`
```json
{
  "id": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
  "status": "CONFIRMED"
}
```

#### `UpdateOrderDto`
```json
{
  "id": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
  "customerName": "Sarah Hassan",
  "customerPhone": "01234567890",
  "shippingAddress": "New Giza Address",
  "shippingCity": "Giza"
}
```

#### `UpdateOrderStatusByNumberDto`
```json
{
  "orderNumber": "VL-10003",
  "status": "PREPARING"
}
```

---

### Common & Pagination DTOs

#### `PaginatedList<T>`
Envelope used for all listing results.
```json
{
  "items": [
    // Array of elements of type T (e.g. Product, Order, Customer, Expense)
  ],
  "pageNumber": 1,
  "totalPages": 5,
  "totalCount": 48,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

---

### Product DTOs

#### `ProductFilterDto`
```json
{
  "category": "Proteins",
  "search": "Whey",
  "minPrice": 100.00,
  "maxPrice": 2000.00,
  "sortBy": "price_asc"
}
```

#### `ProductUpsertDto` (Must be sent as form data `multipart/form-data` if uploading files)
* **id**: `Guid?` (null for creation)
* **name**: `string`
* **nameAr**: `string` (Arabic equivalent)
* **category**: `string`
* **description**: `string`
* **descriptionAr**: `string` (Arabic equivalent)
* **featured**: `bool`
* **bestSeller**: `bool`
* **newArrival**: `bool`
* **visible**: `bool`
* **variantType**: `string` (`none`, `size`, `flavor`, `both`)
* **price**: `decimal`
* **discountPrice**: `decimal`
* **size**: `string`
* **stock**: `int`
* **sku**: `string`
* **mainImage**: `string` (Legacy base64)
* **images**: `List<string>` (Legacy list of base64)
* **mainImageFile**: `IFormFile?` (File upload)
* **imageFiles**: `List<IFormFile>?` (List of file uploads)
* **existingImages**: `List<string>?` (List of existing image paths to keep)
* **ingredients**: `List<string>`
* **ingredientsAr**: `List<string>` (Arabic equivalent)
* **usage**: `string`
* **usageAr**: `string` (Arabic equivalent)
* **benefits**: `List<string>`
* **benefitsAr**: `List<string>` (Arabic equivalent)
* **imageType**: `string` (`powder`, `pill`, `liquid`)
* **imageColor**: `string` (hex color)
* **variants**: `List<VariantUpsertDto>`
  - Format for nested form lists: `variants[0].size`, `variants[0].flavor`, `variants[0].price`, `variants[0].imageFile`, etc.

#### `VariantUpsertDto`
* **id**: `string` (unique variant ID)
* **size**: `string`
* **flavor**: `string`
* **price**: `decimal`
* **discountPrice**: `decimal`
* **stockQuantity**: `int`
* **sku**: `string`
* **image**: `string` (base64)
* **imageFile**: `IFormFile?` (File upload)
* **isAvailable**: `bool`

---

### Settings & Governorate DTOs

#### `UpdateStoreSettingsDto`
```json
{
  "shippingCost": 60.00,
  "freeShippingThreshold": 1500.00,
  "contactPhone": "01234567890",
  "contactEmail": "support@valens.com"
}
```

#### `UpdateHomepageSettingsDto` (Sent as form data `multipart/form-data`)
* **homepageHeroTitle**: `string`
* **homepageHeroSubtitle**: `string`
* **homepageDiscountBannerText**: `string`
* **heroImage**: `string` (Base64)
* **promoBannerImage**: `string` (Base64)
* **homepageSliderImages**: `List<string>` (List of Base64 strings)
* **heroImageFile**: `IFormFile?` (File upload)
* **promoBannerImageFile**: `IFormFile?` (File upload)
* **homepageSliderImageFiles**: `List<IFormFile>?` (List of file uploads)
* **existingSliderImages**: `List<string>?` (List of existing URLs to keep)

#### `UpdateGovernorateShippingDto`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "shippingCost": 45.00
}
```

#### `CreateGovernorateShippingDto`
```json
{
  "governorateName": "Cairo",
  "shippingCost": 40.00
}
```

---

## 4. Validation & Business Rules

### General Input Rules
- **Non-Negative Values**: All pricing, stock quantities, and expenses must be greater than or equal to `0`. Negative values are rejected immediately.
- **Phone Numbers**: Must follow the official Egyptian phone format: `^01[0-2,5]\d{8}$` (e.g. `01012345678`, `01212345678`, `01112345678`, `01512345678`).

### Checkout Validation Matrix
- **Authenticated Checkout**: If the request contains a valid JWT Token, the client does not need to submit the full shipping details in the `CheckoutDto` object. The server dynamically pulls the profile data (`fullName`, `email`, `phone`, `address`, `city`) to construct the shipping ledger.
- **Guest Checkout**: If the request is anonymous (no token), `customerName`, `customerEmail`, `customerPhone`, `shippingAddress`, and `shippingCity` are **strictly required**. Missing fields result in validation errors.

### Order Status Flow
Order statuses must strictly match one of the following uppercase strings:
1. `NEW ORDER` (Default status assigned on checkout)
2. `CONFIRMED` (Triggers automatic order confirmation email to the user)
3. `PREPARING`
4. `SHIPPED`
5. `DELIVERED`
6. `CANCELLED`
7. `REJECTED`
8. `RETURNED`

---

## 5. Frontend Integration Best Practices

- **Dynamic Shipping Dropdown**: Load governorates at application startup using `GET /api/settings/governorates`. Display these governorates in a dropdown list on the shipping section of the checkout page. Use the chosen governorate's name as the value of `shippingCity` in the checkout DTO to calculate shipping costs correctly.
- **Debounced Inputs**: Use a debounce window (300-500ms) on product searches and expense list filters to limit API hits.
- **Base64 vs. Multipart Form Data**:
  - The API fully supports both modes.
  - For simple JSON applications, you can bind files as Base64 strings using the legacy parameters (e.g., `mainImage`).
  - For standard file selections, use `multipart/form-data` mapping file inputs to `mainImageFile`, `imageFiles`, or `heroImageFile`.
- **Handling validation responses**: The global `ValidationFilter` responds to validation errors with a HTTP status code `400 BadRequest` and returns camelCase error properties in the response:
  ```json
  {
    "errors": {
      "customerPhone": ["Phone number must be a valid Egyptian phone format (e.g. 01012345678)."],
      "items[0].quantity": ["Quantity must be greater than 0."]
    }
  }
  ```
