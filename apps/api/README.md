# API Backend – Documentación de Rutas con cURL (Dummy Data)

Este documento lista las rutas disponibles del backend y provee ejemplos de cURL en bash con la URL completa, cuerpos (`body`), parámetros (`query params` y `path params`) y respuestas de ejemplo con su estructura y propiedades.

- URL base por defecto: `http://localhost:3000`
- Nota: Si cambiaste el puerto (env `PORT`), ajusta las URLs.
- Todas las rutas aceptan y retornan JSON.

## Salud

Verifica que el servicio esté activo.

```bash
curl -sS 'http://localhost:3000/health'
```

Respuesta:
```json
{ "status": "ok" }
```

---

## Usuarios (`/users`)

Listar usuarios (opcional: `limit`, `offset`, `active=true|false`):
```bash
curl -sS 'http://localhost:3000/users?limit=20&offset=0&active=true'
```

Obtener por `id`:
```bash
curl -sS 'http://localhost:3000/users/USER_ID_123'
```

Crear usuario (campos mínimos: `email`, `password`):
```bash
curl -sS -X POST 'http://localhost:3000/users' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@grema.com",
    "password": "Secreta123!",
    "role": "admin",
    "active": true,
    "firstName": "Ada",
    "lastName": "Lovelace"
  }'
```

Actualizar usuario:
```bash
curl -sS -X PUT 'http://localhost:3000/users/USER_ID_123' \
  -H 'Content-Type: application/json' \
  -d '{ "active": false, "role": "manager" }'
```

Eliminar usuario:
```bash
curl -sS -X DELETE 'http://localhost:3000/users/USER_ID_123'
```

Respuesta típica (lista):
```json
[
  {
    "id": "USER_ID_123",
    "email": "admin@grema.com",
    "role": "admin",
    "active": true,
    "firstName": "Ada",
    "lastName": "Lovelace",
    "lastLogin": "2025-11-18T15:00:00.000Z",
    "createdAt": "2025-11-10T10:00:00.000Z",
    "updatedAt": "2025-11-18T15:00:00.000Z"
  }
]
```

---

## Órdenes (`/orders`)

Listar órdenes con filtros:

Query params soportados: `limit`, `offset`, `q`, `minDate`, `maxDate`, `orderBy` (ej. `createdAt`), `orderDir` (`asc|desc`), `include` (`items,billingAddress,shippingAddress`).

```bash
curl -sS 'http://localhost:3000/orders?limit=10&offset=0&q=ORD&include=items,billingAddress,shippingAddress&orderBy=createdAt&orderDir=desc'
```

Obtener por `id` (con `include` opcional):
```bash
curl -sS 'http://localhost:3000/orders/PO_0001?include=items,billingAddress,shippingAddress'
```

Crear orden (payload con `order`, `items`, direcciones opcionales):
```bash
curl -sS -X POST 'http://localhost:3000/orders' \
  -H 'Content-Type: application/json' \
  -d '{
    "order": {
      "id": "PO_0001",
      "orderNumber": "ORD-1004",
      "email": "olivia@example.com",
      "firstName": "Olivia",
      "lastName": "Davis",
      "paymentMethod": "card",
      "phone": "+50670000000",
      "shippingAmount": 2500,
      "subtotalAmount": 15000,
      "notes": "Entregar antes del mediodía"
    },
    "items": [
      { "itemId": "ITEM_ABC", "name": "Camiseta algodón", "quantity": 2, "price": 7500 },
      { "itemId": "ITEM_DEF", "name": "Pantalón lino", "quantity": 1, "price": 15000, "discountAmount": 1500 }
    ],
    "billingAddress": {
      "firstName": "Olivia",
      "lastName": "Davis",
      "line1": "Avenida Central 123",
      "city": "San José",
      "country": "CR"
    },
    "shippingAddress": {
      "firstName": "Olivia",
      "lastName": "Davis",
      "line1": "Avenida Central 123",
      "city": "San José",
      "country": "CR"
    }
  }'
```

Actualizar orden (reemplaza items si se envían):
```bash
curl -sS -X PUT 'http://localhost:3000/orders/PO_0001' \
  -H 'Content-Type: application/json' \
  -d '{
    "order": { "notes": "Agregar un regalo" },
    "items": [ { "itemId": "ITEM_ABC", "name": "Camiseta algodón", "quantity": 3, "price": 7500 } ]
  }'
```

Eliminar orden:
```bash
curl -sS -X DELETE 'http://localhost:3000/orders/PO_0001'
```

Respuesta típica (con `include`):
```json
{
  "id": "PO_0001",
  "orderNumber": "ORD-1004",
  "email": "olivia@example.com",
  "firstName": "Olivia",
  "lastName": "Davis",
  "paymentMethod": "card",
  "phone": "+50670000000",
  "shippingAmount": 2500,
  "subtotalAmount": 15000,
  "items": [
    { "id": "OI_1", "orderId": "PO_0001", "itemId": "ITEM_ABC", "name": "Camiseta algodón", "quantity": 2, "price": 7500 },
    { "id": "OI_2", "orderId": "PO_0001", "itemId": "ITEM_DEF", "name": "Pantalón lino", "quantity": 1, "price": 15000, "discountAmount": 1500 }
  ],
  "billingAddress": { "id": "ADDR_1", "line1": "Avenida Central 123", "city": "San José", "country": "CR" },
  "shippingAddress": { "id": "ADDR_2", "line1": "Avenida Central 123", "city": "San José", "country": "CR" },
  "createdAt": "2025-11-18T15:00:00.000Z",
  "updatedAt": "2025-11-18T15:30:00.000Z"
}
```

---

## Productos (`/products`)

Listar productos (opcional: `limit`, `offset`):
```bash
curl -sS 'http://localhost:3000/products?limit=20&offset=0'
```

Obtener por `id`:
```bash
curl -sS 'http://localhost:3000/products/ITEM_ABC'
```

Crear producto:
```bash
curl -sS -X POST 'http://localhost:3000/products' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Camiseta algodón orgánico",
    "sku": "TEE-ORG-001",
    "price": 7500,
    "stock": 100,
    "familyId": 1,
    "colorId": 2,
    "materialId": 3,
    "categoryId": "CAT_TSHIRT"
  }'
```

Actualizar producto:
```bash
curl -sS -X PUT 'http://localhost:3000/products/ITEM_ABC' \
  -H 'Content-Type: application/json' \
  -d '{ "price": 7900, "stock": 95 }'
```

Eliminar producto:
```bash
curl -sS -X DELETE 'http://localhost:3000/products/ITEM_ABC'
```

Respuesta típica:
```json
{
  "id": "ITEM_ABC",
  "name": "Camiseta algodón orgánico",
  "sku": "TEE-ORG-001",
  "price": 7500,
  "stock": 100,
  "familyId": 1,
  "colorId": 2,
  "materialId": 3,
  "categoryId": "CAT_TSHIRT",
  "createdAt": "2025-11-10T10:00:00.000Z",
  "updatedAt": "2025-11-18T15:00:00.000Z"
}
```

---

## Categorías (`/categories`)

Listar categorías:
```bash
curl -sS 'http://localhost:3000/categories?limit=50&offset=0'
```

Obtener por `id`:
```bash
curl -sS 'http://localhost:3000/categories/CAT_TSHIRT'
```

Crear categoría:
```bash
curl -sS -X POST 'http://localhost:3000/categories' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Camisetas",
    "slug": "camisetas",
    "description": "Categoría de camisetas",
    "parentId": null
  }'
```

Actualizar categoría:
```bash
curl -sS -X PUT 'http://localhost:3000/categories/CAT_TSHIRT' \
  -H 'Content-Type: application/json' \
  -d '{ "description": "Camisetas y franelas" }'
```

Eliminar categoría:
```bash
curl -sS -X DELETE 'http://localhost:3000/categories/CAT_TSHIRT'
```

Respuesta típica:
```json
{
  "id": "CAT_TSHIRT",
  "name": "Camisetas",
  "slug": "camisetas",
  "description": "Categoría de camisetas",
  "parentId": null,
  "createdAt": "2025-11-10T10:00:00.000Z",
  "updatedAt": "2025-11-18T15:00:00.000Z"
}
```

---

## Materiales (`/materials`)

```bash
curl -sS 'http://localhost:3000/materials'
curl -sS 'http://localhost:3000/materials/3'
curl -sS -X POST 'http://localhost:3000/materials' -H 'Content-Type: application/json' -d '{ "name": "Algodón", "description": "Orgánico" }'
curl -sS -X PUT 'http://localhost:3000/materials/3' -H 'Content-Type: application/json' -d '{ "description": "Orgánico certificado" }'
curl -sS -X DELETE 'http://localhost:3000/materials/3'
```

Respuesta ejemplo:
```json
{ "id": 3, "name": "Algodón", "description": "Orgánico" }
```

---

## Colores (`/colors`)

```bash
curl -sS 'http://localhost:3000/colors'
curl -sS 'http://localhost:3000/colors/2'
curl -sS -X POST 'http://localhost:3000/colors' -H 'Content-Type: application/json' -d '{ "name": "Azul", "hex": "#0000FF" }'
curl -sS -X PUT 'http://localhost:3000/colors/2' -H 'Content-Type: application/json' -d '{ "hex": "#0033FF" }'
curl -sS -X DELETE 'http://localhost:3000/colors/2'
```

---

## Tipos de Cierre (`/closure-types`)

```bash
curl -sS 'http://localhost:3000/closure-types?limit=10&offset=0'
curl -sS 'http://localhost:3000/closure-types/5'
curl -sS -X POST 'http://localhost:3000/closure-types' -H 'Content-Type: application/json' -d '{ "name": "Cremallera", "description": "Metálica" }'
curl -sS -X PUT 'http://localhost:3000/closure-types/5' -H 'Content-Type: application/json' -d '{ "description": "Plástico resistente" }'
curl -sS -X DELETE 'http://localhost:3000/closure-types/5'
```

---

## Almacenes (`/warehouses`)

```bash
curl -sS 'http://localhost:3000/warehouses'
curl -sS 'http://localhost:3000/warehouses/WH_001'
curl -sS -X POST 'http://localhost:3000/warehouses' -H 'Content-Type: application/json' -d '{ "name": "Principal", "location": "San José, CR", "status": "active", "capacity": 10000 }'
curl -sS -X PUT 'http://localhost:3000/warehouses/WH_001' -H 'Content-Type: application/json' -d '{ "status": "maintenance" }'
curl -sS -X DELETE 'http://localhost:3000/warehouses/WH_001'
```

Respuesta ejemplo:
```json
{ "id": "WH_001", "name": "Principal", "location": "San José, CR", "status": "active", "capacity": 10000 }
```

---

## Stock de Almacén (`/warehouse-stocks`)

```bash
curl -sS 'http://localhost:3000/warehouse-stocks?limit=20&offset=0'
curl -sS 'http://localhost:3000/warehouse-stocks/WS_0001'
curl -sS -X POST 'http://localhost:3000/warehouse-stocks' -H 'Content-Type: application/json' -d '{ "warehouseId": "WH_001", "itemId": "ITEM_ABC", "quantity": 500 }'
curl -sS -X PUT 'http://localhost:3000/warehouse-stocks/WS_0001' -H 'Content-Type: application/json' -d '{ "quantity": 450 }'
curl -sS -X DELETE 'http://localhost:3000/warehouse-stocks/WS_0001'
```

---

## Movimientos de Stock (`/stock-movements`)

```bash
curl -sS 'http://localhost:3000/stock-movements?limit=20&offset=0'
curl -sS 'http://localhost:3000/stock-movements/SKM_0001'
curl -sS -X POST 'http://localhost:3000/stock-movements' -H 'Content-Type: application/json' -d '{ "type": "in", "warehouseId": "WH_001", "itemId": "ITEM_ABC", "quantity": 50, "reason": "Compra" }'
curl -sS -X PUT 'http://localhost:3000/stock-movements/SKM_0001' -H 'Content-Type: application/json' -d '{ "reason": "Ajuste" }'
curl -sS -X DELETE 'http://localhost:3000/stock-movements/SKM_0001'
```

---

## Descuentos (`/discounts`)

```bash
curl -sS 'http://localhost:3000/discounts?limit=20&offset=0'
curl -sS 'http://localhost:3000/discounts/10'
curl -sS -X POST 'http://localhost:3000/discounts' -H 'Content-Type: application/json' -d '{ "name": "Black Friday", "percentage": 10, "startDate": "2025-11-20", "endDate": "2025-11-30", "active": true }'
curl -sS -X PUT 'http://localhost:3000/discounts/10' -H 'Content-Type: application/json' -d '{ "active": false }'
curl -sS -X DELETE 'http://localhost:3000/discounts/10'
```

---

## Descuentos por Categoría (`/discount-categories`)

```bash
curl -sS 'http://localhost:3000/discount-categories?limit=20&offset=0&discountId=10'
curl -sS 'http://localhost:3000/discount-categories/1001'
curl -sS -X POST 'http://localhost:3000/discount-categories' -H 'Content-Type: application/json' -d '{ "discountId": 10, "categoryId": "CAT_TSHIRT" }'
curl -sS -X PUT 'http://localhost:3000/discount-categories/1001' -H 'Content-Type: application/json' -d '{ "categoryId": "CAT_PANTS" }'
curl -sS -X DELETE 'http://localhost:3000/discount-categories/1001'
```

---

## Descuentos por Familia (`/discount-families`)

```bash
curl -sS 'http://localhost:3000/discount-families?limit=20&offset=0&discountId=10'
curl -sS 'http://localhost:3000/discount-families/2001'
curl -sS -X POST 'http://localhost:3000/discount-families' -H 'Content-Type: application/json' -d '{ "discountId": 10, "familyId": 1 }'
curl -sS -X PUT 'http://localhost:3000/discount-families/2001' -H 'Content-Type: application/json' -d '{ "familyId": 2 }'
curl -sS -X DELETE 'http://localhost:3000/discount-families/2001'
```

---

## Descuentos por Producto (`/discount-products`)

```bash
curl -sS 'http://localhost:3000/discount-products?limit=20&offset=0&discountId=10'
curl -sS 'http://localhost:3000/discount-products/3001'
curl -sS -X POST 'http://localhost:3000/discount-products' -H 'Content-Type: application/json' -d '{ "discountId": 10, "productId": "ITEM_ABC" }'
curl -sS -X PUT 'http://localhost:3000/discount-products/3001' -H 'Content-Type: application/json' -d '{ "productId": "ITEM_DEF" }'
curl -sS -X DELETE 'http://localhost:3000/discount-products/3001'
```

---

## Descuentos por Usuario (`/discount-users`)

```bash
curl -sS 'http://localhost:3000/discount-users?limit=20&offset=0&discountId=10'
curl -sS 'http://localhost:3000/discount-users/4001'
curl -sS -X POST 'http://localhost:3000/discount-users' -H 'Content-Type: application/json' -d '{ "discountId": 10, "userId": "USER_ID_123" }'
curl -sS -X PUT 'http://localhost:3000/discount-users/4001' -H 'Content-Type: application/json' -d '{ "userId": "USER_ID_456" }'
curl -sS -X DELETE 'http://localhost:3000/discount-users/4001'
```

---

## Documentos (`/documents`)

Listar con filtros (`userId`, `type`, `mimeType`, `q`, `orderBy`, `orderDir`):
```bash
curl -sS 'http://localhost:3000/documents?limit=20&offset=0&userId=USER_ID_123&type=image&mimeType=image/png&q=logo&orderBy=createdAt&orderDir=desc'
```

Obtener por `id`:
```bash
curl -sS 'http://localhost:3000/documents/DOC_001'
```

Crear documento:
```bash
curl -sS -X POST 'http://localhost:3000/documents' \
  -H 'Content-Type: application/json' \
  -d '{
    "user": { "connect": { "id": "USER_ID_123" } },
    "type": "image",
    "title": "Logo",
    "name": "Logo principal",
    "fileName": "logo.png",
    "url": "https://cdn.example.com/logo.png",
    "mimeType": "image/png"
  }'
```

Actualizar documento:
```bash
curl -sS -X PUT 'http://localhost:3000/documents/DOC_001' \
  -H 'Content-Type: application/json' \
  -d '{ "title": "Logo actualizado" }'
```

Eliminar documento:
```bash
curl -sS -X DELETE 'http://localhost:3000/documents/DOC_001'
```

Respuesta ejemplo:
```json
{
  "id": "DOC_001",
  "userId": "USER_ID_123",
  "type": "image",
  "title": "Logo",
  "name": "Logo principal",
  "fileName": "logo.png",
  "url": "https://cdn.example.com/logo.png",
  "mimeType": "image/png",
  "createdAt": "2025-11-18T15:00:00.000Z"
}
```

---

## Cuentas OAuth (`/oauth-accounts`)

Listar (`userId` opcional):
```bash
curl -sS 'http://localhost:3000/oauth-accounts?limit=20&offset=0&userId=USER_ID_123'
```

Obtener por `id`:
```bash
curl -sS 'http://localhost:3000/oauth-accounts/OAUTH_001'
```

Crear cuenta OAuth:
```bash
curl -sS -X POST 'http://localhost:3000/oauth-accounts' \
  -H 'Content-Type: application/json' \
  -d '{
    "provider": "google",
    "providerAccountId": "google-abcdef",
    "userId": "USER_ID_123",
    "accessToken": "ya29.a0AfH6SMDUMMY",
    "refreshToken": "1//0gDUMMY",
    "tokenType": "Bearer",
    "expiresAt": "2025-11-30T00:00:00.000Z",
    "scope": "profile email"
  }'
```

Actualizar cuenta OAuth:
```bash
curl -sS -X PUT 'http://localhost:3000/oauth-accounts/OAUTH_001' \
  -H 'Content-Type: application/json' \
  -d '{ "scope": "email" }'
```

Eliminar cuenta OAuth:
```bash
curl -sS -X DELETE 'http://localhost:3000/oauth-accounts/OAUTH_001'
```

---

## Gastos (`/expenses`)

```bash
curl -sS 'http://localhost:3000/expenses?limit=20&offset=0'
curl -sS 'http://localhost:3000/expenses/EXP_0001'
curl -sS -X POST 'http://localhost:3000/expenses' -H 'Content-Type: application/json' -d '{ "description": "Compra de materiales", "amount": 35000, "date": "2025-11-18", "category": "Materiales" }'
curl -sS -X PUT 'http://localhost:3000/expenses/EXP_0001' -H 'Content-Type: application/json' -d '{ "amount": 36000 }'
curl -sS -X DELETE 'http://localhost:3000/expenses/EXP_0001'
```

---

### Notas finales

- Los `id` mostrados son dummy y los cuerpos son ejemplos plausibles basados en el esquema Prisma y los controladores.
- Si algún endpoint requiere relaciones Prisma (ej. `{ connect: { id } }`), se ilustró con ejemplos simples.
- Para respuestas, se muestran estructuras representativas; tu entorno puede incluir campos adicionales.