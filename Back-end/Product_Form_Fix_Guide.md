# Front-end Integration Guide: Add & Edit Product Forms Fix

If the frontend application is receiving a `400 Bad Request` or validation errors when calling the product creation (`create-product`) or update (`update-product`) endpoints, follow the instructions below to configure the request payloads correctly.

---

## 1. Required Headers & Format
* **Content-Type**: Must be **`multipart/form-data`** (Not `application/json`). This is because the API supports file uploads for product/variant images.
* **Authorization**: Must include the Admin bearer token:
  `Authorization: Bearer <ADMIN_JWT_TOKEN>`

---

## 2. Create Product Endpoint
* **Method & URL**: `POST /api/products/create-product`
* **Request Type**: `multipart/form-data` (FormData)

### Required & Optional Form Fields:
* **`name`** (string, required): Supplement name in English.
* **`nameAr`** (string, required): Supplement name in Arabic.
* **`category`** (string, required): The category name (e.g. `"Vitamins"`).
* **`description`** (string, required): Product description in English.
* **`descriptionAr`** (string, required): Product description in Arabic.
* **`variantType`** (string, required): Must be one of `none`, `size`, `flavor`, `both`.
* **`price`** (decimal, required when `variantType` is `"none"`): Base price.
* **`discountPrice`** (decimal, optional): Fixed discount price (not percentage). Set to `0` if no discount.
* **`stock`** (int, optional): Initial stock quantity.
* **`sku`** (string, optional): Product SKU code.
* **`imageType`** (string): Type of formulation, must be one of `powder`, `capsule`, `liquid`, `bar`, `tablet`, `other`.
* **`imageColor`** (string): Valid hex color code for background rendering (e.g., `"#FF8A75"`).
* **`mainImageFile`** (File/Blob, optional): The main product image file.
* **`imageFiles`** (List of Files/Blobs, optional): Gallery image files.
* **`ingredients`[]** (List of strings, optional): English active ingredients.
* **`ingredientsAr`[]** (List of strings, optional): Arabic active ingredients.
* **`usage`** (string, optional): Usage instructions in English.
* **`usageAr`** (string, optional): Usage instructions in Arabic.
* **`benefits`[]** (List of strings, optional): English formulation benefits.
* **`benefitsAr`[]** (List of strings, optional): Arabic formulation benefits.

#### Append Lists/Arrays to FormData:
When appending list items (like `ingredientsAr` or `benefitsAr`) to `FormData`, append them as separate key-value pairs with the same key name:
```javascript
const formData = new FormData();
// ... append other fields ...
formData.append("ingredientsAr", "بيتا ألانين");
formData.append("ingredientsAr", "إل سيترولين");
```

---

## 3. Update/Edit Product Endpoint
* **Method & URL**: `POST /api/products/update-product`
* **Request Type**: `multipart/form-data` (FormData)

### Form Fields:
* Send **all fields listed in the Create Product section**, plus:
* **`id`** (Guid, required): The unique identifier (ID) of the product being updated.
* **`existingImages`[]** (List of strings, optional): A list of paths/URLs of already uploaded gallery images to keep on the server (e.g., `"/uploads/filename.jpg"`).

---

## 4. Nested Product Variants Configuration
If `variantType` is not `"none"` (e.g. `"size"`, `"flavor"`, or `"both"`), you must append the variant list properties to the `FormData` using flat dot-notated array keys.

### Variant Form Fields structure:
* **`variants[i].id`** (string, optional): Variant ID (include only when updating existing variants).
* **`variants[i].size`** (string)
* **`variants[i].flavor`** (string)
* **`variants[i].price`** (decimal)
* **`variants[i].discountPrice`** (decimal)
* **`variants[i].stockQuantity`** (int)
* **`variants[i].sku`** (string)
* **`variants[i].isAvailable`** (bool)
* **`variants[i].imageFile`** (File/Blob, optional): Variant image upload.
* **`variants[i].image`** (string, optional): Legacy base64/URL.

### Example in JavaScript:
```javascript
const formData = new FormData();
formData.append("id", "2e928cd0-7d01-409c-b4a9-2fd5c2031f5b");
formData.append("name", "Valens Whey Premium");
formData.append("nameAr", "فالينز واي بريميوم");
formData.append("category", "Whey Protein");
formData.append("description", "Premium Whey Protein Isolate");
formData.append("descriptionAr", "واي بروتين معزول فاخر");
formData.append("variantType", "size");

// First Variant
formData.append("variants[0].size", "1kg");
formData.append("variants[0].price", "1200");
formData.append("variants[0].stockQuantity", "50");
formData.append("variants[0].isAvailable", "true");

// Second Variant
formData.append("variants[1].size", "2kg");
formData.append("variants[1].price", "2200");
formData.append("variants[1].stockQuantity", "30");
formData.append("variants[1].isAvailable", "true");

// Call API
fetch("http://localhost:5054/api/products/update-product", {
  method: "POST",
  headers: {
    "Authorization": "Bearer " + adminToken
  },
  body: formData
});
```
