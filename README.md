# SecureBusiness · Fase 1 del frontend

Base visual responsive para el dashboard de gestión de ciberseguridad de SecureBusiness. Esta fase establece la identidad visual, los estilos reutilizables, la navegación principal y la composición del dashboard.

## Tecnologías

- HTML semántico, CSS y JavaScript nativo.
- Bootstrap 5.3.9 para grid, utilidades y componentes base; CSS de la aplicación en `styles.css`.
- La documentación del proyecto define Laravel MVC y MySQL para el sistema completo. El repositorio actual aún no contiene un esqueleto Laravel, por lo que esta entrega permanece como frontend estático y no modifica backend ni base de datos.

## Ejecutar

Abre `index.html` en un navegador moderno. También puedes servir la carpeta con un servidor estático, por ejemplo:

```sh
python -m http.server 8000
```

Después visita `http://localhost:8000`. Bootstrap se carga desde jsDelivr, por lo que requiere conexión a internet.

## Incluido en Fase 1

- Paleta de colores y variables CSS de SecureBusiness.
- Sidebar, navegación superior e indicador de organización de demostración.
- Dashboard responsive con indicadores, gráfica SVG, alertas visuales y resumen de incidentes.
- Menú lateral móvil accesible mediante teclado y botón de navegación.
- Datos ficticios identificados como demostración.

Los enlaces de otros módulos aparecen deshabilitados como referencia de navegación futura. No se implementa su funcionalidad.

## Estructura

- `index.html`: shell semántico y contenido del dashboard.
- `styles.css`: paleta, componentes y breakpoints responsive.
- `app.js`: comportamiento accesible del menú móvil.

## Pendiente para fases posteriores

Conectar datos reales y permisos desde Laravel, integrar la plantilla con Blade cuando exista la estructura backend y definir los módulos en las fases siguientes.