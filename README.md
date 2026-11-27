# SecureBusiness · Frontend Fases 1 y 2

Interfaz responsive para la plataforma de gestión de ciberseguridad SecureBusiness. La Fase 1 establece la identidad visual y el dashboard; la Fase 2 incorpora las pantallas de operación de activos tecnológicos e incidentes.

## Tecnologías

- HTML semántico, CSS y JavaScript nativo.
- Bootstrap 5.3.9 para la cuadrícula y controles base; estilos propios en `styles.css`.
- La documentación del proyecto establece Laravel MVC y MySQL para el sistema completo. La rama actual conserva una estructura estática de frontend y no modifica backend ni base de datos.

## Ejecutar

Abre `index.html` en un navegador moderno o sirve la carpeta desde la raíz del proyecto:

```sh
python -m http.server 8000
```

Visita `http://localhost:8000`. Bootstrap se carga desde jsDelivr, por lo que requiere conexión a internet.

## Fase 1

- Identidad visual, paleta y estilos reutilizables.
- Sidebar, navegación superior y diseño responsive.
- Dashboard con indicadores, gráfica, alertas visuales y resumen de incidentes.

## Fase 2

- **Activos:** listado adaptable a escritorio y móvil, búsqueda por nombre/código/responsable, filtros por categoría y estado, registro, edición y vista de detalle.
- **Incidentes:** listado y filtros por texto, estado y severidad; formulario de registro; vista de detalle con severidad, prioridad, responsable, activo relacionado e historial de seguimiento; actualización demostrativa de estado y responsable.
- **Formularios:** validación de campos requeridos y longitudes, mensajes de error, confirmaciones y estados visuales.
- Los datos y cambios son ficticios y viven en memoria; al recargar se restauran los datos de ejemplo. La interfaz los identifica como demostración.

## Integración con backend

No se han inventado ni llamado endpoints. La integración requiere que el backend defina y documente, para activos e incidentes, los servicios disponibles y sus campos; altas, consultas y actualizaciones permitidas; categorías, estados, severidades y prioridades válidos; relaciones con responsables y activos; validaciones y reglas de autorización por organización. El historial de incidentes también necesita una operación autorizada para registrar notas y cambios de estado. Cuando Jen confirme ese contrato, se podrá sustituir el repositorio de demostración en `app.js` por el adaptador de servicios correspondiente.

## Archivos

- `index.html`: shell de la aplicación, dashboard de Fase 1 y punto de montaje de vistas.
- `styles.css`: tokens de identidad, componentes de Fase 1 y estilos responsive de las vistas operativas.
- `app.js`: navegación móvil, datos de demostración, filtros, formularios, detalles e historial en memoria.
- `README.md`: alcance y pasos para ejecutar y probar la demostración.

## Probar manualmente

1. Abre el dashboard y cambia entre Resumen, Activos e Incidentes.
2. En Activos, busca y filtra registros; abre un detalle y registra o edita un activo.
3. En Incidentes, filtra registros; reporta un incidente; abre un detalle, asigna responsable, cambia estado y añade una nota.
4. Repite a un ancho de móvil y comprueba que los listados cambian a tarjetas y que el menú lateral se puede abrir y cerrar.
5. Recarga para confirmar que los cambios de demostración se reinician.

No se implementan otros módulos ni funcionalidades de backend en esta fase.