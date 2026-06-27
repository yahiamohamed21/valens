# Valens E-commerce — Frontend Integration Guide

**Base URL:** `http://localhost:5054` (HTTP) or `https://localhost:7299` (HTTPS)
**Authentication Scheme:** Bearer Token JWT passed in the `Authorization` header.

---

## Table of Contents

1. [Architecture & Design](#1-architecture--design)
2. [API Endpoints Reference](#2-api-endpoints-reference)
3. [Request & Response DTOs](#3-request--response-dto-structures)
4. [Validation & Business Rules](#4-validation--business-rules)
5. [Frontend Integration Best Practices](#5-frontend-integration-best-practices)

---

## 1. Architecture & Design

The Valens API supports a full-featured e-commerce ecosystem consisting of products with sizes/flavors, cart validation, custom coupons, expense logs, and reporting.

### Key Concepts

| Concept | Detail |
|---------|--------|
| **Product Variants** | Products support multi-attribute combinations (`size`, `flavor`, or `both`). If the product has variants, stock quantities and prices must be read from the chosen variant rather than the base product. |
| **Order Codes** | Orders are assigned a unique, numeric-based code matching the format `VL-[yyyyMMddHHmmssfff]` (e.g., `VL-20260627194000123`). |
| **Server-Side Coupon Calculations** | The client passes the cart items directly to the coupon validator. The backend recalculates item prices securely from the database to prevent total tampering. |
| **Dynamic Visibility toggles** | Active states for categories, products, and coupons can be flipped using quick post toggles, immediately updating their visibility on the customer storefront. |

---

## 2. API Endpoints Reference

### 2.1 Authentication & Profile

#### `POST /api/auth/register-customer`
Registers a new customer.
**Request Body:** `RegisterDto`
**Response:** `200 OK` -> `AuthResponseDto`

#### `POST /api/auth/login-user`
Authenticates a user (Customer or Admin) and returns a JWT token.
**Request Body:** `LoginDto`
**Response:** `200 OK` -> `AuthResponseDto`

#### `POST /api/auth/forgot-password`
Generates and sends a 6-digit OTP code to the provided email.
**Request Body:** `{ "email": "user@example.com" }`
**Response:** `200 OK` -> `{ "message": "OTP verification code sent to your email." }`

#### `POST /api/auth/reset-password-otp`
Resets the password. **Does not require re-typing the email**; the backend automatically retrieves the associated email from the OTP code record.
**Request Body:**
```json
{
  "otpCode": "123456",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```
**Response:** `200 OK` -> `{ "message": "Password has been reset successfully." }`

#### `POST /api/auth/change-customer-password`
Changes the logged-in customer's password. (Requires customer token).
**Request Body:** `ChangePasswordDto`
**Response:** `200 OK` -> `{ "message": "Password updated successfully." }`

#### `POST /api/auth/change-admin-password`
Changes the logged-in admin's password. (Requires admin token).
**Request Body:** `ChangePasswordDto`

---

### 2.2 Homepage & Settings

#### `POST /api/settings/homepage-overview`
Consolidated endpoint for the storefront homepage. Retrieves all settings, active categories, and grouped products (Featured, Best Sellers, New Arrivals) in a single request.
**Request Body:** `{}` (or empty body)
**Response:** `200 OK`
```json
{
  "settings": {
    "homepageHeroTitle": "Premium Sports Supplements",
    "homepageHeroSubtitle": "Fuel your body.",
    "homepageDiscountBannerText": "Use code FIRST10",
    "heroImage": "/uploads/hero-uuid.jpg",
    "promoBannerImage": "/uploads/promo-uuid.jpg",
    "homepageSliderImages": ["/uploads/img1.jpg"]
  },
  "categories": [ { ...Category } ],
  "products": {
    "featured": [ { ...Product } ],
    "bestSellers": [],
    "newArrivals": []
  }
}
```

---

### 2.3 Product Management

#### `POST /api/products/list-products`
Retrieves products filtered by category, search text, and sorting.
**Request Body:**
```json
{
  "category": "Whey Protein",
  "search": "Gold",
  "minPrice": 500.0,
  "maxPrice": 3000.0,
  "sortBy": "price_asc" // Options: price_asc, price_desc, name_asc, name_desc, newest
}
```
**Response:** `200 OK` -> `IEnumerable<Product>`

#### `POST /api/products/detail-product`
Gets detail for a product.
**Request Body:** `{ "id": "uuid-here" }`
**Response:** `200 OK` -> `Product`

#### `POST /api/products/create-product`
Creates a product with base64 image uploading and variant configurations. (Requires Admin).
**Request Body:** `ProductUpsertDto`

#### `POST /api/products/toggle-product`
Toggles product storefront visibility (`Visible`). (Requires Admin).
**Request Body:** `{ "id": "uuid-here" }`
**Response:** `204 NoContent`

---

### 2.4 Coupon System

#### `POST /api/coupons/validate-coupon`
Validates a coupon code against current cart items. Calculates the actual subtotal, discount, and new total.
**Request Body:**
```json
{
  "code": "FIRST10",
  "items": [
    {
      "productId": "8a38db4f-8f83-4a11-a83d-eb88812c3f81",
      "size": "1kg",
      "flavor": "Chocolate",
      "quantity": 2
    }
  ]
}
```
**Response:** `200 OK`
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

#### `POST /api/coupons/toggle-coupon`
Toggles coupon status (`IsActive`). (Requires Admin).
**Request Body:** `{ "id": "uuid-here" }`
**Response:** `204 NoContent`

---

### 2.5 Orders

#### `POST /api/orders/checkout-order`
Submits a checkout order. Support guest checkouts or logged-in accounts.
**Request Body:**
```json
{
  "customerName": "Abdo Customer",
  "customerEmail": "abdo@customer.com",
  "customerPhone": "01012345678",
  "shippingAddress": "123 St",
  "shippingCity": "Cairo",
  "couponCode": "FIRST10",
  "items": [
    {
      "productId": "8a38db4f-8f83-4a11-a83d-eb88812c3f81",
      "size": "1kg",
      "flavor": "Chocolate",
      "quantity": 1
    }
  ]
}
```
**Response:** `200 OK` -> Returns the order details.

#### `POST /api/orders/update-order-details`
Allows updating shipping/customer details of an order after creation.
**Request Body:**
```json
{
  "id": "order-guid",
  "customerName": "Abdo Edited",
  "customerPhone": "01099999999",
  "shippingAddress": "456 St",
  "shippingCity": "Giza"
}
```
**Response:** `204 NoContent`

---

## 3. Request & Response DTO Structures

### `CartItemDto`
Passed in Slices for Coupon Validation and Checkout.
```json
{
  "productId": "Guid",
  "variantId": "string? (Optional)",
  "size": "string? (Optional)",
  "flavor": "string? (Optional)",
  "quantity": "int"
}
```

### `ProductUpsertDto`
Used to Create or Update products.
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

1. **Required Fields for Checkout**: All checkout properties (`CustomerName`, `CustomerEmail`, `CustomerPhone`, `ShippingAddress`, `ShippingCity`) are strictly required. Emtpy strings will cause a validation error.
2. **Variant Resolution during Checkout/Coupon Validation**:
   - If a product has variants (`variantType != "none"`), the backend attempts to match it using the `variantId` first.
   - If `variantId` is empty or null, it falls back to matching by the values of the `size` and `flavor` properties.
   - If no matching variant is found or there is insufficient stock, it rejects the operation.
3. **Admin Actions Roles**: All endpoints prefixed with `update-`, `create-`, `delete-`, `toggle-`, `list-admin-` (except where specified) require the `Admin` role in the Bearer JWT.

---

## 5. Frontend Integration Best Practices

- **Image Uploads**: Standardize on sending images as base64 string payloads. The backend decodes them, saves them into the static assets directory, and returns the public `/uploads/file-name.ext` path.
- **Immediate Coupon Display**: Use `POST /api/coupons/validate-coupon` to calculate the discount amount and new total when the user clicks "Apply" on the cart page. It updates the layout instantly.
- **Settings Caching**: Fetch `POST /api/settings/homepage-overview` once when the homepage loads and store it in your state management layer to avoid redundant API queries.
