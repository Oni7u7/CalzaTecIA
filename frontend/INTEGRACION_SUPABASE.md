# Integración Completa con Supabase

Este documento describe la integración completa del frontend con Supabase, incluyendo todos los servicios y hooks creados.

## 📋 Tablas Conectadas

### ✅ Tablas Principales Conectadas

1. **Usuarios y Roles** (`usuarios`, `roles`)
   - CRUD completo de usuarios
   - Gestión de roles y permisos
   - Relaciones con tiendas y supervisores

2. **Tiendas** (`tiendas`)
   - CRUD completo de tiendas
   - Estadísticas en tiempo real (ventas, inventario, rotación)
   - Gestión de personal

3. **Productos** (`productos`)
   - CRUD completo de productos
   - Búsqueda por texto, categoría, etc.
   - Productos con inventario por tienda

4. **Inventario** (`inventario`, `movimientos_inventario`)
   - Consulta de inventario por tienda
   - Inventario global consolidado
   - Ajustes y transferencias entre tiendas
   - Alertas de bajo stock

5. **Ventas** (`ventas`, `venta_items`)
   - Crear ventas con items
   - Consulta de ventas con filtros
   - Estadísticas de ventas
   - Cancelación de ventas con reversión de inventario

6. **KPIs** (`kpis`, `kpi_historico`)
   - Cálculo de KPIs en tiempo real
   - Histórico de KPIs
   - Métricas por tienda

7. **Capacitación** (`competencias`, `capacitacion_usuarios`)
   - Gestión de competencias por rol
   - Asignación de capacitaciones
   - Seguimiento de progreso
   - Aprobación de capacitaciones

## 📁 Estructura de Archivos

### Servicios (`frontend/src/lib/supabase/`)

```
supabase/
├── usuarios.ts      # Servicios de usuarios y roles
├── tiendas.ts      # Servicios de tiendas
├── productos.ts    # Servicios de productos
├── inventario.ts   # Servicios de inventario
├── ventas.ts       # Servicios de ventas
├── kpis.ts         # Servicios de KPIs
└── capacitacion.ts # Servicios de capacitación
```

### Hooks Personalizados (`frontend/src/hooks/`)

```
hooks/
├── useUsuarios.ts    # Hook para usuarios
├── useTiendas.ts     # Hook para tiendas
├── useProductos.ts   # Hook para productos
├── useInventario.ts  # Hook para inventario
└── useVentas.ts      # Hook para ventas
```

## 🔧 Uso de los Servicios

### Ejemplo: Usar productos en un componente

```typescript
import { useProductos } from '@/hooks/useProductos'

export default function MiComponente() {
  const { productos, loading, error, refetch } = useProductos({
    activo: true,
    categoria: 'Deportivo',
    limite: 20
  })

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {productos.map(producto => (
        <div key={producto.id}>{producto.nombre}</div>
      ))}
    </div>
  )
}
```

### Ejemplo: Crear una venta

```typescript
import { crearVenta } from '@/lib/supabase/ventas'

const handleVenta = async () => {
  const venta = await crearVenta({
    vendedor_id: userId,
    tienda_id: tiendaId,
    items: [
      {
        producto_id: 'producto-id',
        cantidad: 2,
        precio_unitario: 1299,
        talla: '42'
      }
    ],
    metodo_pago: 'efectivo',
    descuento: 0
  })

  if (venta) {
    console.log('Venta creada:', venta.ticket)
  }
}
```

### Ejemplo: Obtener inventario de una tienda

```typescript
import { useInventarioTienda } from '@/hooks/useInventario'

export default function InventarioPage() {
  const { inventario, loading, refetch } = useInventarioTienda('tienda-id', {
    categoria: 'Deportivo',
    bajo_stock: true
  })

  return (
    <div>
      {inventario.map(item => (
        <div key={item.id}>
          {item.producto?.nombre}: {item.cantidad} unidades
        </div>
      ))}
    </div>
  )
}
```

## 🎯 Componentes Actualizados

Los siguientes componentes ahora usan datos reales de Supabase:

1. **`frontend/src/app/cliente/page.tsx`**
   - Productos desde Supabase
   - Creación de ventas en Supabase

2. **`frontend/src/app/admin/usuarios/page.tsx`**
   - Lista de usuarios desde Supabase
   - Creación de usuarios

3. **`frontend/src/app/admin/tiendas/page.tsx`**
   - Lista de tiendas desde Supabase
   - Estadísticas en tiempo real

4. **`frontend/src/app/admin/inventario/page.tsx`**
   - Inventario global consolidado
   - Filtros y búsqueda

5. **`frontend/src/app/vendedor/inventario/page.tsx`**
   - Inventario por tienda
   - Ajustes de inventario

## ⚡ Optimizaciones Implementadas

1. **Hooks con caché automático**
   - Los hooks manejan el estado de carga y errores
   - Refetch automático cuando cambian las dependencias

2. **Queries optimizadas**
   - Uso de índices de Supabase
   - Paginación para grandes volúmenes
   - Filtros eficientes

3. **Relaciones optimizadas**
   - Uso de `select` con joins para obtener relaciones
   - Evita múltiples queries

4. **Manejo de errores**
   - Try-catch en todos los servicios
   - Logs de errores para debugging
   - Valores por defecto seguros

## 🔐 Seguridad

- Todas las queries usan RLS (Row Level Security) de Supabase
- Validación de datos en el frontend
- Sanitización de inputs

## 📝 Próximos Pasos

1. **Autenticación real**
   - Implementar login con Supabase Auth
   - Manejo de sesiones
   - Tokens JWT

2. **Validación de formularios**
   - Usar Zod para validación
   - Mensajes de error amigables

3. **Optimizaciones adicionales**
   - Caché con React Query
   - Optimistic updates
   - Infinite scroll para listas grandes

4. **Reportes**
   - Generación de reportes PDF/Excel
   - Gráficas con datos reales

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén en `.env.local`

### Error: "Row Level Security policy violation"
- Verifica que las políticas RLS estén configuradas en Supabase
- Asegúrate de que el usuario tenga permisos para acceder a las tablas

### Datos no se actualizan
- Usa `refetch()` del hook para forzar actualización
- Verifica que los filtros no estén excluyendo los datos

## 📚 Referencias

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)


