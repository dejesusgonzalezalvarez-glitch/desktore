# DESKTORE — Plan de productos, precios, márgenes y AOV

Análisis del plan de productos (fuente: `Plan_Productos_Precios_Margenes.pdf`) y su implementación en el tema Shopify (Horizon 4.2.0). Mercado: EE. UU. · Proveedor: Zendrop · Tráfico: Meta Ads (móvil) · Presupuesto de prueba: US$100.

---

## 1. Análisis de precios y márgenes

Márgenes brutos = precio − costo (sin envío, comisiones ni publicidad, como se solicitó).

### Productos individuales

| # | Producto | Costo | Precio | Margen $ | Margen % | Veredicto |
|---|----------|-------|--------|----------|----------|-----------|
| 1 | Ergonomic Mouse Wrist Rest Pad (estrella) | $1.86–3.61 | $17.99 | $14.38–16.13 | 80–90% | ✅ Cumple la regla 4x–5x |
| 2 | Lux Keyboard Wrist Rest Pad | $4.85 | $19.99 | $15.14 | 75.7% | ✅ |
| 3 | Magnetic Cable Clips 8-Pack | $12.86 | $24.99 | $12.13 | 48.5% | ⚠️ Costo alto. Solo en bundles ✅ (como planeaste) |
| 4 | Silicone Cable Ties 16-Pack | $12.39 | $24.99 | $12.60 | 50.4% | ⚠️ Costo alto. Solo en bundles ✅ |
| 5 | Magic Cleaning Cloth | $1.38 | No se vende | — | — | 🎁 Solo regalo (valor percibido $7.99) |

### Bundles

| Bundle | Contenido | Costo | Precio | Margen $ | Margen % | Valor percibido | Ahorro cliente |
|--------|-----------|-------|--------|----------|----------|-----------------|----------------|
| **The Comfort Duo** (B1) | Mouse + Keyboard wrist rest | $6.71–8.46 | **$29.99** | $21.53–23.28 | **71.8–77.6%** | $37.98 | $7.99 (21%) |
| **Complete Desk Setup** (B2) | 2 wrist rests + clips + cloth 🎁 | $22.70 | **$44.99** | $22.29 | **49.5%** | $70.96 | $25.97 (36.6%) |
| **Pro Desk Setup** (B3) | 2 wrist rests + clips + ties + cloth 🎁 | $35.09 | **$59.99** | $24.90 | **41.5%** ⚠️ | $95.95 | $35.96 (37.5%) |

### Confirmaciones y ajustes

- **B1 ($29.99): confirmado.** Margen excelente y es el imán de AOV.
- **B2 ($44.99): confirmado.** 49.5% es aceptable para un bundle con accesorios de costo alto.
- **B3 ($59.99): ajustar a $64.99.** Con 41.5% bruto, después de comisiones (~3%, ≈ $1.80) y envío absorbido (≈ $5) queda ~30%. A $64.99 el margen bruto sube a 46% ($29.90) manteniendo un ahorro atractivo (34%). Alternativa: renegociar el costo de las cable ties ($12.39 es muy alto para un 16-pack).
- **Regalos (cloth):** funciona como valor percibido a $7.99 con costo real $1.38. Correcto mantenerlo como regalo.

---

## 2. Configuración en Shopify (paso a paso, sin apps obligatorias)

### 2.1 Crear los 3 bundles (método recomendado: producto propio por bundle)

1. Admin → Products → **Add product** para cada bundle:
   - "DESKTORE Comfort Duo" → $29.99, compare-at $37.98, SKU `DSK-DUO`.
   - "DESKTORE Complete Desk Setup" → $44.99, compare-at $70.96, SKU `DSK-COMPLETE`.
   - "DESKTORE Pro Desk Setup" → $64.99 (ajustado), compare-at $95.95, SKU `DSK-PRO`.
2. En cada producto: 1 sola variante (Default Title), inventario continuo, "Track quantity" OFF si el proveedor es print-on-demand.
3. **Ventaja del producto propio:** Zendrop lo empaqueta como un solo envío y tu costo contable es único ($8.46 / $22.70 / $35.09). No hay descuadre de inventario ni de costos entre la ficha y el proveedor.
4. Ocultar los bundles de las colecciones si quieres que solo aparezcan en la página del producto estrella: Admin → Products → Collections → excluir o usar tag `bundle` + navegación filtrada. Con el selector implementado en el tema **no necesitan estar visibles** en catálogo.

### 2.2 Regalo automático (Magic Cloth)

Opción recomendada (sin app, sin riesgo de inventario):
1. Crea "Magic Cleaning Cloth (Gift)" con precio **$0.00** y "Track quantity" OFF (Shopify permite variantes a $0).
2. En el tema ya está el campo **Free gift note** por oferta (ej. "Free magic cleaning cloth included ($7.99 value)").
3. Si quieres que el regalo aparezca como línea en el carrito, dos caminos:
   - **Manual (100% gratis):** en cada ficha de bundle, añade un requisito de pedido o simplemente inclúyelo en el bundle del proveedor (Zendrop) y comunícalo con el Free gift note. _Recomendado para el lanzamiento._
   - **Automático:** app gratuita tipo "Buy X Get Y" (Shopify Flow + regla de carrito, o apps de regalos). Coste $0 y evita errores humanos. Añádela solo cuando pases de ~10 pedidos/día.
4. **Evitar descuadres:** el regalo nunca lleva inventario rastreado y el bundle se compra al proveedor como una sola unidad. Así el costo contable por pedido siempre coincide con la tabla del punto 1.

### 2.3 Envío gratis en el admin

Admin → Settings → Shipping and delivery → tarifa "Free shipping" con **condición: order total ≥ $29** (ver punto 4 para el cálculo del umbral).

---

## 3. Página del producto estrella (ya implementado en el tema)

Se añadió la sección **"Bundle offers"** (`sections/bundle-offers.liquid`) al template `product.ergonomic-mouse-wrist-res.json`, justo debajo de la ficha:

- 4 tarjetas de oferta tipo radio: **Single / Comfort Duo (Most popular, preseleccionado) / Complete Desk Setup / Pro Desk Setup**.
- Precio tachado (compare-at), **ahorro en dólares** ("Save $7.99") y badge "Most popular".
- Botón único "Add to cart — $XX.XX" que añade la oferta seleccionada en 1 clic (Ajax API, sin app) y abre el carrito (drawer) automáticamente.
- Nota de envío y paquetes separados bajo el botón.

**Para activarlo del todo:** en el editor del tema, asigna los productos de bundle a las ofertas 2, 3 y 4 (hoy apuntan a vacío; se ocultan hasta asignarlos). La oferta 1 usa el producto actual.

---

## 4. Envío gratis con umbral: cálculo y decisión

Datos del catálogo: singles $17.99 / $19.99 · B1 $29.99 · B2 $44.99 · B3 $64.99.

- **$35 (umbral "típico"): descartado.** El comprador de B1 ($29.99, la oferta recomendada) quedaría a **$5.01** del envío gratis **sin ningún add-on disponible** (clips y ties no se venden sueltos). Zona muerta = fricción.
- **$29 (recomendado).** B1 desbloquea el envío gratis al instante (refuerza la oferta más popular). Comprador de single: "add $11.01" → su siguiente compra racional es B1 o un segundo pad, ambos desbloquean. Sin zonas muertas.
- Barra de progreso implementada en drawer y página de carrito con mensajes: "_You're $X.XX away from free shipping_" → "_Nice — you've unlocked free shipping._"
- Umbral configurable en el editor: **Theme settings → Desktore — Free shipping & cart**.

**Costo real:** Zendrop cobra ~$4–6 por envío US en estos pesos. Con márgenes de 48–90% en los productos vendidos, absorber el envío desde $29 es seguro (peor caso: par de pads → margen $30+ − $5 envío).

---

## 5. Upsells y cross-sells por etapa

| Punto de contacto | Qué ofrecer | Precio | Estado |
|---|---|---|---|
| Página del producto estrella | Selector de 4 ofertas (single → B1 → B2 → B3) con B1 preseleccionado | $17.99→$64.99 | ✅ Implementado |
| Carrito (drawer) | Barra de envío gratis + nota de paquetes separados | — | ✅ Implementado |
| Carrito (página) | Bloque "BUNDLES" (cross-sell de producto) + barra de envío | — | ✅ Implementado |
| Checkout | No tocar (Shopify limita upsells nativos; no meter apps en checkout para no romper confianza) | — | — |
| Post-compra | Página de agradecimiento: bloque de pedido con "Add cable clips to your next order"? No recomendado en fase 1. Cuando haya tráfico: one-click upsell de cord clips solo si validas que llega en paquete separado | $24.99 | Fase 2 |

**Regla de oro:** clips y ties **solo** aparecen dentro de bundles (multiplican el AOV sin canibalizar). El cloth **nunca** se vende.

---

## 6. Paquetes separados (Zendrop Fulfillment vs Amazon Products)

Si mezclas productos fulfilled por Zendrop con productos de Amazon en un mismo pedido, pueden llegar **en paquetes separados** y en fechas distintas.

- ✅ Implementado: nota en el carrito (drawer + página): _"Items in your order may arrive in separate packages."_ (editable en Theme settings → Desktore).
- Nota en la página del producto bajo el botón: _"Delivery in 5-10 business days. Items in an order may arrive in separate packages."_
- Recomendación adicional: en bundles, usar siempre unidades del **mismo fulfillment** (todos Zendrop) para que el bundle llegue junto. Los bundles actuales lo cumplen.

---

## 7. Prueba de impacto (presupuesto $100)

### Métricas a vigilar

| Métrica | Dónde | Objetivo orientativo fase 1 |
|---|---|---|
| AOV | Shopify Analytics | ≥ $30 (vs ~$19 si solo vendieras singles) |
| Bundle attach rate | % de pedidos con bundle | ≥ 35% |
| Conversión (CVR) | Meta + Shopify | ≥ 1.5–2% en móvil con $50 de prueba |
| Margen por pedido | Calculado: margen − envío − comisión | ≥ $12 |
| Free shipping unlock rate | % pedidos ≥ $29 | ≥ 60% |
| Reembolsos | Shopify | < 5% |

### A/B test con poco tráfico

Con $100 y ~$1–1.5 CPM móvil, tendrás ~1,500–3,000 impresiones y pocas decenas de clics. **No testees micro-detalles.** Testea solo este cambio grande, 7 días cada versión:

- **Versión A:** oferta preseleccionada = **Single** ($17.99).
- **Versión B:** oferta preseleccionada = **Comfort Duo** ($29.99, "Most popular").

Cambio en 30 segundos: editor del tema → sección "BUNDLES" → oferta B1 → "Selected by default". Mide **AOV y bundle attach rate**, no CVR. Si B no baja la conversión y sube el AOV, quédate con B.

---

## 8. Textos (inglés) implementados

- Sección: **BUNDLES** — _One-click bundles. Free US shipping on orders over $29._
- **Just the mouse wrist rest** — _One Ergonomic Mouse Wrist Rest Pad for your current setup._ · $17.99
- **The Comfort Duo** `MOST POPULAR` — _Mouse + keyboard wrist rest. The classic desk comfort upgrade._ · $29.99 · ~~$37.98~~ · **Save $7.99**
- **The Complete Desk Setup** — _Both wrist rests + 8 magnetic cable clips to keep your desk tidy._ · $44.99 · ~~$70.96~~ · **Save $25.97** · ✓ _Free magic cleaning cloth included ($7.99 value)_
- **The Pro Desk Setup** — _Both wrist rests + magnetic cable clips + 16 silicone cable ties._ · $64.99 · ~~$95.95~~ · **Save $30.96** · ✓ _Free magic cleaning cloth included ($7.99 value)_
- Botón: **Add to cart — $29.99** · Nota: _Delivery in 5-10 business days. Items in an order may arrive in separate packages._
- Barra carrito: _You're $11.01 away from free shipping._ → _Nice — you've unlocked free shipping._ (+ nota de paquetes separados)

Sin promesas médicas: solo "comfort", "support", "upgrade".

---

## 9. Orden de prioridad con el presupuesto de $100

| Prioridad | Acción | Coste |
|---|---|---|
| 1 | **Verificar muestra** del mouse wrist rest + foto propia (si no, usar fotos del proveedor con permiso) | $20–35 |
| 2 | Dominio `desktore.com` (si sigue libre) | $10–20 |
| 3 | Crear los 3 productos de bundle en Shopify ($29.99 / $44.99 / $64.99) y asignarlos al selector del tema | $0 |
| 4 | Configurar envío gratis ≥ $29 en Shopify Shipping | $0 |
| 5 | 2-3 creatividades en CapCut desde clips del proveedor (vertical 9:16) | $0 |
| 6 | Prueba Meta Ads: 1 campaña, 1 conjunto, mejor creativo, $30–50 | $30–50 |

**Antes de gastar en ads:** que la página del producto tenga las 4 ofertas asignadas y funcione el add-to-cart del bundle. Sin eso, estarías pagando clics para una página a medio configurar.

---

## 10. Estado de implementación en el tema

- [x] Paleta de marca aplicada (#171717 / #F7F7F5 / #C5C7C9 / #777C80) y tipografías Manrope + Inter
- [x] Sección "BUNDLES" con 4 ofertas, ahorro, badge y add-to-cart sin app (`sections/bundle-offers.liquid` + `assets/bundle-offers.js`)
- [x] Precios de bundles actualizados ($29.99 / $44.99 / $64.99)
- [x] Barra de envío gratis umbral $29 en drawer y carrito (`snippets/free-shipping-bar.liquid`)
- [x] Nota de paquetes separados en carrito y página de producto
- [x] Announcement bar: "Free US shipping on orders over $29" + eslogan
- [x] Cross-sell del carrito renombrado a "BUNDLES"
- [ ] **Tú:** crear los 3 productos bundle en Shopify y asignarlos en el editor del tema
- [ ] **Tú:** configurar la tarifa de envío gratis ≥ $29 en Shopify Shipping
- [ ] **Tú:** verificar muestra y crear las creatividades

> Los precios finales, márgenes y umbral asumen los costos indicados por Zendrop y pueden variar con el envío real, comisiones de pago y el costo final del proveedor. Reverificar con la primera muestra.
