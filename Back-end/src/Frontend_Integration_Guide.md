# Valens E-commerce Backend — Complete Frontend Integration Guide

**Base API URL:** `http://valens-api.runasp.net` (or local dev URL e.g. `http://localhost:5054`)  
**Swagger Docs:** `/swagger`  
**Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`  
**Data Format:** JSON (application/json) for standard requests, `multipart/form-data` for file uploads.

---

## 1. Authentication & Account Management (`/api/auth`)

### 1.1 Customer Registration
* **Endpoint:** `POST /api/auth/register-customer`
* **Content-Type:** `application/json`
* **Request Payload (`RegisterDto`):**
  ```json
  {
    "email": "sarah.hassan@example.com",
    "password": "SecurePassword123!",
    "fullName": "Sarah Hassan",
    "phone": "01234567890",
    "address": "12 El-Galaa St, Dokki",
    "city": "Giza"
  }
  ```
* **Response Payload (`AuthResponseDto`):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "refreshToken": "7c8e9b55...",
    "email": "sarah.hassan@example.com",
    "fullName": "Sarah Hassan",
    "role": "Customer",
    "phone": "01234567890",
    "address": "12 El-Galaa St, Dokki",
    "city": "Giza"
  }
  ```

### 1.2 User Login (Admin & Customer)
* **Endpoint:** `POST /api/auth/login-user`
* **Request Payload (`LoginDto`):**
  ```json
  {
    "email": "sarah.hassan@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response Payload (`AuthResponseDto`):**
  Same as registration. The `role` property indicates if the user is a `"Customer"` or `"Admin"`.

### 1.3 Forgot Password (Send OTP)
* **Endpoint:** `POST /api/auth/forgot-password`
* **Request Payload:**
  ```json
  {
    "email": "sarah.hassan@example.com"
  }
  ```
* **Response:** `200 OK` with confirmation message.

### 1.4 Reset Password with OTP
* **Endpoint:** `POST /api/auth/reset-password-otp`
* **Request Payload:**
  ```json
  {
    "otpCode": "123456",
    "newPassword": "NewSecurePassword123!",
    "confirmPassword": "NewSecurePassword123!"
  }
  ```
* **Response:** `200 OK` on success.

### 1.5 Change Customer Password
* **Endpoint:** `POST /api/auth/change-customer-password`
* **Headers:** `Authorization: Bearer <Customer Token>`
* **Request Payload:**
  ```json
  {
    "oldPassword": "SecurePassword123!",
    "newPassword": "NewSecurePassword123!",
    "confirmPassword": "NewSecurePassword123!"
  }
  ```
* **Response:** `200 OK` on success.

### 1.6 Change Admin Password
* **Endpoint:** `POST /api/auth/change-admin-password`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:** Same as customer password change.
* **Response:** `200 OK` on success.

### 1.7 Refresh JWT Token
* **Endpoint:** `POST /api/auth/refresh-token`
* **Request Payload (`TokenRequestDto`):**
  ```json
  {
    "accessToken": "ExpiredAccessTokenHere",
    "refreshToken": "ValidRefreshTokenHere"
  }
  ```
* **Response:** `200 OK` -> Returns a fresh `AuthResponseDto` with updated tokens.

### 1.8 Revoke Refresh Token
* **Endpoint:** `POST /api/auth/revoke-token`
* **Request Payload:**
  ```json
  {
    "refreshToken": "RefreshTokenToRevoke"
  }
  ```
* **Response:** `200 OK` on success.

---

## 2. Category Management (`/api/categories`)

### 2.1 List Storefront Categories (Active Only)
* **Endpoint:** `GET /api/categories/list-active-product-categories`
* **Usage:** Use this for the public store navbar, homepage, and when populating the categories dropdown on product add/edit forms.
* **Response Payload:**
  ```json
  [
    {
      "id": "e92b1a13-8a3b-419b-bcfa-12003c28bc00",
      "name": "Vitamins",
      "isActive": true,
      "createdAt": "2026-06-28T22:55:18Z",
      "updatedAt": "2026-06-28T22:55:18Z"
    }
  ]
  ```

### 2.2 List Admin Categories (All)
* **Endpoint:** `GET /api/categories/list-admin-product-categories`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Usage:** Use strictly for the admin category management page.
* **Response:** Returns list of all active & hidden categories.

### 2.3 Create Category
* **Endpoint:** `POST /api/categories/create-product-category`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:**
  ```json
  {
    "name": "Proteins",
    "isActive": true
  }
  ```
* **Response:** `201 Created` with the new Category object.

### 2.4 Update Category
* **Endpoint:** `POST /api/categories/update-product-category`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:**
  ```json
  {
    "id": "e92b1a13-8a3b-419b-bcfa-12003c28bc00",
    "name": "Proteins & Powders",
    "isActive": true
  }
  ```
* **Response:** `204 NoContent` on success.

### 2.5 Delete Category
* **Endpoint:** `POST /api/categories/delete-product-category`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:**
  ```json
  {
    "id": "e92b1a13-8a3b-419b-bcfa-12003c28bc00"
  }
  ```
* **Response:** `204 NoContent` on success.

### 2.6 Toggle Category Status
* **Endpoint:** `POST /api/categories/toggle-product-category`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:**
  ```json
  {
    "id": "e92b1a13-8a3b-419b-bcfa-12003c28bc00"
  }
  ```
* **Response:** `204 NoContent` on success (Toggles `isActive` property).

---

## 3. Coupon Management (`/api/coupons`)

### 3.1 Validate Coupon in Cart
* **Endpoint:** `POST /api/coupons/validate-coupon`
* **Request Payload (`ValidateCouponDto`):**
  ```json
  {
    "code": "VALENS15",
    "items": [
      {
        "productId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
        "variantId": "var-1704256799000 (optional)",
        "size": "2kg (optional)",
        "flavor": "Chocolate (optional)",
        "quantity": 2
      }
    ]
  }
  ```
* **Response Payload:**
  ```json
  {
    "code": "VALENS15",
    "discountType": "Percentage",
    "discountValue": 15.00,
    "minOrderAmount": 500.00,
    "subtotal": 2400.00,
    "discountAmount": 360.00,
    "newTotal": 2040.00
  }
  ```
* **Important Business Logic:**
  - If a product is already discounted (i.e. has `discountPrice > 0`), the coupon **cannot** be applied to it **unless** the coupon's percentage/fixed discount value is greater than the product's own discount amount.
  - If the coupon is applied, the discount is calculated against the **original base price** (`price`), not the `discountPrice`.
  - Otherwise, the product discount remains and the coupon does not apply to this specific item.

### 3.2 List Admin Coupons (with Stats & Orders)
* **Endpoint:** `GET /api/coupons/list-admin`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Response Payload (`IEnumerable<CouponDetailsDto>`):**
  ```json
  [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "code": "VALENS15",
      "discountType": "Percentage",
      "discountValue": 15.00,
      "expiryDate": "2026-12-31T23:59:59Z (or null if never expires)",
      "minOrderAmount": 500.00,
      "usageCount": 3,
      "maxUsage": 100,
      "isActive": true,
      "ownerName": "Sarah Hassan (or null/empty)",
      "createdAt": "2026-06-28T22:55:18Z",
      "totalOrders": 3,
      "totalProductsBought": 6,
      "totalRevenue": 6120.00,
      "orders": [
        {
          "orderId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
          "orderNumber": "VAL-1704256799000",
          "customerName": "Sarah Hassan",
          "orderDate": "2026-06-29T12:00:00Z",
          "status": "DELIVERED",
          "total": 2040.00,
          "productsCount": 2,
          "productNames": ["Whey Premium (2kg Chocolate)"]
        }
      ]
    }
  ]
  ```

### 3.3 Create Coupon
* **Endpoint:** `POST /api/coupons/create-coupon`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload (`CouponDto`):**
  ```json
  {
    "code": "VALENS15",
    "discountType": "Percentage", // or "Fixed"
    "discountValue": 15.00,
    "minOrderAmount": 500.00,
    "maxUsage": 100, // (optional, omit or set null for unlimited)
    "expiryDate": "2026-12-31T23:59:59Z", // (optional, omit or set null for never expires)
    "isActive": true,
    "ownerName": "Sarah Hassan" // (optional)
  }
  ```
* **Response:** `201 Created` with the new Coupon.

### 3.4 Update Coupon
* **Endpoint:** `POST /api/coupons/update-coupon`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload (`CouponDto` with `id`):** Same as Create.
* **Response:** `204 NoContent` on success.

### 3.5 Delete Coupon
* **Endpoint:** `POST /api/coupons/delete-coupon`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:** `IdRequestDto`
* **Response:** `204 NoContent`.

### 3.6 Toggle Coupon Status
* **Endpoint:** `POST /api/coupons/toggle-coupon`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:** `IdRequestDto`
* **Response:** `204 NoContent`.

---

## 4. Return & Refund Ledger (`/api/returns`)

### 4.1 Log a Return (Admin Only)
* **Endpoint:** `POST /api/returns/create`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload (`CreateReturnDto`):**
  ```json
  {
    "orderId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
    "returnReason": "Customer cancelled before delivery",
    "isRestoredToStock": true, // Adds item quantities back to product/variant stock
    "refundAmount": 2040.00,
    "notes": "Full return processed successfully.",
    "items": [
      {
        "productId": "e92b1a13-8a3b-419b-bcfa-12003c28bc00",
        "variantId": "var-1704256799000",
        "quantity": 2
      }
    ] // (optional - if omitted or empty, it returns the entire order)
  }
  ```
* **Response Payload (`OrderReturn`):**
  ```json
  {
    "id": "f5a2b1a1-8a3b-419b-bcfa-12003c28bd77",
    "orderId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
    "orderNumber": "VAL-1704256799000",
    "returnDate": "2026-06-30T14:30:00Z",
    "customerName": "Sarah Hassan",
    "returnedFormulations": "Whey Premium (2kg Chocolate) x 2",
    "returnReason": "Customer cancelled before delivery",
    "isRestoredToStock": true,
    "refundAmount": 2040.00,
    "notes": "Full return processed successfully.",
    "createdAt": "2026-06-30T14:30:00Z",
    "updatedAt": "2026-06-30T14:30:00Z"
  }
  ```

### 4.2 List Returns (Returns Ledger)
* **Endpoint:** `GET /api/returns/list`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Response Payload (`IEnumerable<OrderReturn>`):** Returns all logged returns sorted by date.

---

## 5. Order Management & Checkout (`/api/orders`)

### 5.1 Checkout Preview
* **Endpoint:** `POST /api/orders/preview-checkout`
* **Usage:** Call this dynamically (debounced) whenever the checkout inputs change to recalculate totals, shipping fees for different governorates, and coupon discounts.
* **Request Payload (`CheckoutDto`):**
  ```json
  {
    "shippingCity": "Cairo",
    "couponCode": "VALENS15",
    "items": [
      {
        "productId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
        "variantId": "var-1704256799000",
        "quantity": 2
      }
    ]
  }
  ```
* **Response Payload (`CheckoutPreviewDto`):**
  ```json
  {
    "subtotal": 2400.00,
    "shippingCost": 40.00, // dynamically fetched based on governorate
    "discountAmount": 360.00,
    "total": 2080.00
  }
  ```

### 5.2 Submit Checkout Order
* **Endpoint:** `POST /api/orders/checkout-order`
* **Headers:** `Authorization: Bearer <Customer Token>` (Optional. If authenticated, name, email, phone, and address are automatically loaded if omitted).
* **Request Payload (`CheckoutDto`):**
  ```json
  {
    "customerName": "Sarah Hassan",
    "customerEmail": "sarah.hassan@example.com",
    "customerPhone": "01234567890",
    "shippingAddress": "12 El-Galaa St, Dokki",
    "shippingCity": "Giza",
    "couponCode": "VALENS15",
    "items": [
      {
        "productId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
        "variantId": "var-1704256799000",
        "quantity": 2
      }
    ]
  }
  ```
* **Response Payload:**
  ```json
  {
    "message": "Order created successfully and is being prepared.",
    "orderNumber": "VAL-1704256799000",
    "orderId": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
    "total": 2080.00,
    "paymentMethod": "Cash on Delivery"
  }
  ```

### 5.3 Order History (Customer)
* **Endpoint:** `GET /api/orders/my-history`
* **Headers:** `Authorization: Bearer <Customer Token>`
* **Query Parameters:** `pageNumber` (int, default: 1), `pageSize` (int, default: 10)
* **Response Payload:** `PaginatedList<Order>`

### 5.4 List Admin Orders
* **Endpoint:** `POST /api/orders/list-admin-orders`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload (`OrderAdminFilterDto`):**
  ```json
  {
    "search": "Sarah (optional)",
    "category": "Proteins (optional)",
    "pageNumber": 1,
    "pageSize": 10
  }
  ```
* **Response Payload:** `PaginatedList<Order>` (Includes nested items list)

### 5.5 Update Order Status
* **Endpoint:** `POST /api/orders/update-order-status`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:**
  ```json
  {
    "id": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
    "status": "CONFIRMED"
  }
  ```
* **Response:** `204 NoContent`.

### 5.6 Update Order Status by Order Number
* **Endpoint:** `POST /api/orders/update-order-status-by-number`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:**
  ```json
  {
    "orderNumber": "VAL-1704256799000",
    "status": "DELIVERED"
  }
  ```
* **Response:** `204 NoContent`.

### 5.7 Update Order Details (Post-Checkout Edit)
* **Endpoint:** `POST /api/orders/update-order-details`
* **Request Payload:**
  ```json
  {
    "id": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6",
    "customerName": "Sarah Hassan Modified",
    "customerPhone": "01234567890",
    "shippingAddress": "New Dokki Address St",
    "shippingCity": "Giza"
  }
  ```
* **Response:** `204 NoContent`.

---

## 6. Product Management (`/api/products`)

### 6.1 Get Product Catalog (Paginated with Filters)
* **Endpoint:** `POST /api/products/list-products`
* **Request Payload (`ProductFilterDto`):**
  ```json
  {
    "category": "Vitamins (optional)",
    "search": "C-1000 (optional)",
    "minPrice": 100.00, // (optional)
    "maxPrice": 2000.00, // (optional)
    "sortBy": "price_asc", // (options: price_asc, price_desc, name_asc, name_desc, newest)
    "pageNumber": 1,
    "pageSize": 10
  }
  ```
* **Response Payload:** `PaginatedList<Product>`

### 6.2 Get Homepage Sections
* **Endpoint:** `POST /api/products/list-homepage-sections`
* **Response Payload (`HomepageSectionsDto`):**
  ```json
  {
    "featured": [...List of Products...],
    "bestSellers": [...List of Products...],
    "newArrivals": [...List of Products...]
  }
  ```

### 6.3 Get Single Product Details
* **Endpoint:** `POST /api/products/detail-product`
* **Request Payload:**
  ```json
  {
    "id": "8e9b55bd-fa94-4cf4-910d-6a86d11598d6"
  }
  ```
* **Response Payload:** Returns full `Product` schema including its `variants` list.

### 6.4 Create Product (Admin Only)
* **Endpoint:** `POST /api/products/create-product`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Content-Type:** `multipart/form-data`
* **FormData Fields Structure:**
  - `name`: "Whey Premium"
  - `nameAr`: "واي بريميوم"
  - `category`: "Proteins"
  - `description`: "Premium Whey isolate"
  - `descriptionAr`: "واي بروتين معزول فاخر"
  - `variantType`: "size" (or "flavor", "both", "none")
  - `price`: 1200.00 *(Only required if variantType is "none")*
  - `discountPrice`: 1080.00 *(Only required if variantType is "none")*
  - `stock`: 50 *(Only required if variantType is "none")*
  - `sku`: "W-PREM-1"
  - `imageType`: "powder" (powder, capsule, liquid, bar, tablet, other)
  - `imageColor`: "#FF8A75"
  - `mainImageFile`: *(File upload)*
  - `imageFiles`: *(Multiple File uploads)*
  - `ingredientsAr`: "بيتا ألانين"
  - `ingredientsAr`: "واي بروتين" *(Append multiple values under the same key)*
  - **Nested Variants array (when variantType != "none"):**
    - `variants[0].size`: "1kg"
    - `variants[0].price`: 1200.00
    - `variants[0].discountPrice`: 1080.00
    - `variants[0].stockQuantity`: 30
    - `variants[0].sku`: "WP-1KG"
    - `variants[0].isAvailable`: true
    - `variants[0].imageFile`: *(File upload)*
    - `variants[1].size`: "2kg"
    - `variants[1].price`: 2200.00
    - ...
* **Response Payload:** Returns the created `Product` object.

### 6.5 Update Product (Admin Only)
* **Endpoint:** `POST /api/products/update-product`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Content-Type:** `multipart/form-data`
* **FormData Fields:** Send all fields listed in Create, plus:
  - `id`: "8e9b55bd-fa94-4cf4-910d-6a86d11598d6"
  - `existingImages`: "/uploads/image-1.jpg" *(List of existing server URLs to preserve)*
  - `variants[0].id`: "var-1704256799000" *(Include existing variant IDs to update them, omit ID to add a new variant)*

### 6.6 Delete Product
* **Endpoint:** `POST /api/products/delete-product`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:** `IdRequestDto`
* **Response:** `204 NoContent`.

### 6.7 Toggle Product Visibility
* **Endpoint:** `POST /api/products/toggle-product`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Request Payload:** `IdRequestDto`
* **Response:** `204 NoContent`.

---

## 7. Reports & Analytics (`/api/reports`)

### 7.1 Dashboard Report Summary
* **Endpoint:** `GET /api/reports/dashboard-summary`
* **Headers:** `Authorization: Bearer <Admin Token>`
* **Response Payload:**
  ```json
  {
    "totalSales": 15200.50, // Gross sales before returns
    "netSales": 13160.50, // Net sales (TotalSales - RefundAmounts)
    "totalRefunds": 2040.00, // Total returned refund amounts
    "totalExpenses": 2500.00,
    "netProfit": 10660.50, // Net profit (NetSales - TotalExpenses)
    "salesCount": 18,
    "averageOrderValue": 844.47,
    "salesOverTime": [
      { "date": "2026-06-25", "amount": 4200.00 },
      { "date": "2026-06-26", "amount": 3500.50 }
    ],
    "salesByCategory": [
      { "category": "Proteins", "amount": 8900.00 }
    ],
    "expensesByCategory": [
      { "category": "Shipping", "amount": 1200.00 }
    ]
  }
  ```

---

## 8. Store Settings & Governorate Shipping (`/api/settings`)

### 8.1 List Egyptian Governorates (Public)
* **Endpoint:** `GET /api/settings/governorates`
* **Usage:** Use this dropdown to populate the customer city/governorate selection at checkout.
* **Response Payload:**
  ```json
  [
    {
      "id": "c1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o",
      "governorateName": "Cairo",
      "shippingCost": 40.00,
      "createdAt": "2026-06-28T22:55:18Z",
      "updatedAt": "2026-06-28T22:55:18Z"
    }
  ]
  ```

### 8.2 Create Governorate Shipping Rate (Admin)
* **Endpoint:** `POST /api/settings/create-governorate-shipping`
* **Request Payload:**
  ```json
  {
    "governorateName": "Sohag",
    "shippingCost": 80.00
  }
  ```
* **Response:** `201 Created` with the new governorate config.

### 8.3 Update Governorate Shipping Rate (Admin)
* **Endpoint:** `PUT /api/settings/update-governorate-shipping`
* **Request Payload:**
  ```json
  {
    "id": "c1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o",
    "shippingCost": 45.00
  }
  ```
* **Response:** `204 NoContent`.

---

## 9. Integration Best Practices & Troubleshooting

### 9.1 Dynamic Image Loading (No Prefixes Needed!)
The backend now automatically intercepts and formats all image URL outputs before sending them to the client. This means fields like `mainImage`, `images`, and variant `image` are returned as **absolute URLs** (e.g. `https://valens-api.runasp.net/uploads/products/abc.jpg`). 
- **Action Required:** Bind the URL directly to your HTML/JSX image element: `<img src={product.mainImage} />`. No manual string concats or backend base-URL prefixes are needed!
- **Image Subfolder Paths on Server:**
  - Product main and gallery images are saved under: `/uploads/products/...`
  - Variant specific images are saved under: `/uploads/variants/...`
  - Homepage banners, hero background, and sliders are saved under: `/uploads/settings/...`

### 9.2 Checkout Validation Rules
- ** Egyptian Phone Numbers:** Must follow: `^01[0-2,5]\d{8}$` (e.g. `01012345678`).
- **Required Fields:** For guest checkouts, contact details are validated on the server. Always pass the exact selected governorate name to the `shippingCity` parameter to ensure correct shipping calculations.

### 9.3 Standard Error Responses
The API returns a `400 Bad Request` with structured validations when fields are missing or improperly formatted:
```json
{
  "errors": {
    "customerPhone": ["Phone number must be a valid Egyptian phone format (e.g. 01012345678)."],
    "items[0].quantity": ["Quantity must be greater than 0."]
  }
}
```
Always display these validation descriptions in the UI form labels to guide users.
