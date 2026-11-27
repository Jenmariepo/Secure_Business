(() => {
  "use strict";

  const initialAssets = [
    {id:"AST-001",name:"Servidor de producción",category:"Servidor",owner:"Luis Ramírez",department:"Infraestructura",location:"Centro de datos",serial:"SB-SRV-0118",status:"Activo",criticality:"Crítica",reviewDate:"26 nov. 2026",notes:"Servidor principal de aplicaciones empresariales."},
    {id:"AST-002",name:"Portátil — Finanzas 04",category:"Portátil",owner:"Carlos Ruiz",department:"Finanzas",location:"Oficina principal",serial:"SB-LT-2044",status:"Activo",criticality:"Alta",reviewDate:"20 nov. 2026",notes:"Equipo asignado al departamento de Finanzas."},
    {id:"AST-003",name:"Firewall perimetral",category:"Red",owner:"Marta Santos",department:"Infraestructura",location:"Centro de datos",serial:"SB-NW-3302",status:"Activo",criticality:"Crítica",reviewDate:"18 nov. 2026",notes:"Dispositivo de seguridad perimetral."},
    {id:"AST-004",name:"BD Clientes principal",category:"Base de datos",owner:"Nash Méndez",department:"Tecnología",location:"Centro de datos",serial:"SB-DB-1007",status:"En mantenimiento",criticality:"Crítica",reviewDate:"14 nov. 2026",notes:"Base de datos de demostración, sin datos reales."},
    {id:"AST-005",name:"Portátil — Marketing 02",category:"Portátil",owner:"Ana Torres",department:"Marketing",location:"Oficina principal",serial:"SB-LT-2091",status:"Activo",criticality:"Media",reviewDate:"12 nov. 2026",notes:"Equipo asignado al departamento de Marketing."},
    {id:"AST-006",name:"Servidor de respaldo",category:"Servidor",owner:"Luis Ramírez",department:"Infraestructura",location:"Centro de datos",serial:"SB-SRV-0120",status:"Retirado",criticality:"Alta",reviewDate:"02 nov. 2026",notes:"Activo retirado para revisión de inventario."}
  ];
  const initialIncidents = [
    {id:"INC-2026-048",title:"Intento de acceso no autorizado",category:"Acceso no autorizado",severity:"Crítica",priority:"Urgente",status:"Abierto",reporter:"Laura Méndez",assignee:"Nash Méndez",assetId:"AST-001",reportedAt:"Hoy, 09:42",description:"Se detectaron varios intentos de inicio de sesión desde una ubicación inusual.",history:[{when:"Hoy, 09:42",actor:"Laura Méndez",note:"Incidente reportado y pendiente de investigación."}]},
    {id:"INC-2026-047",title:"Correo de phishing reportado",category:"Phishing",severity:"Alta",priority:"Alta",status:"En investigación",reporter:"Nash Méndez",assignee:"Laura Méndez",assetId:"",reportedAt:"Hoy, 08:16",description:"Un usuario reportó un correo sospechoso que solicita credenciales corporativas.",history:[{when:"Hoy, 08:16",actor:"Nash Méndez",note:"Se recibió el reporte y se asignó para revisión."}]},
    {id:"INC-2026-046",title:"Equipo con actividad inusual",category:"Actividad sospechosa",severity:"Media",priority:"Normal",status:"En investigación",reporter:"Carlos Ruiz",assignee:"Carlos Ruiz",assetId:"AST-002",reportedAt:"Ayer, 16:30",description:"El equipo registró actividad fuera de su horario habitual.",history:[{when:"Ayer, 16:30",actor:"Carlos Ruiz",note:"Actividad marcada para investigación."}]},
    {id:"INC-2026-045",title:"Pérdida de dispositivo móvil",category:"Pérdida de dispositivo",severity:"Baja",priority:"Normal",status:"Resuelto",reporter:"Ana Torres",assignee:"Ana Torres",assetId:"AST-005",reportedAt:"Ayer, 11:05",description:"Se reportó la pérdida temporal de un dispositivo móvil de la organización.",history:[{when:"Ayer, 11:05",actor:"Ana Torres",note:"Se confirmó la recuperación del dispositivo y se cerró el seguimiento."}]},
    {id:"INC-2026-044",title:"Interrupción breve del servicio",category:"Disponibilidad",severity:"Alta",priority:"Alta",status:"Contenido",reporter:"Luis Ramírez",assignee:"Luis Ramírez",assetId:"AST-003",reportedAt:"24 nov. 2026, 14:20",description:"El servicio presentó una interrupción breve durante una revisión programada.",history:[{when:"24 nov. 2026, 14:20",actor:"Luis Ramírez",note:"Servicio restaurado; se mantiene observación."}]}
  ];

  // Repositorio en memoria para la demostración. Se sustituirá por un adaptador de servicios cuando Jen publique la integración del backend; aquí no se asume ningún endpoint.
  const demoRepository = {assets:initialAssets, incidents:initialIncidents};
  const state = {assets:demoRepository.assets.map(item => ({...item})), incidents:demoRepository.incidents.map(item => ({...item,history:item.history.map(entry => ({...entry}))}))};
  const dashboardView = document.getElementById("dashboard");
  const moduleView = document.getElementById("module-view");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const menuToggle = document.getElementById("menu-toggle");
  const pageNames = {dashboard:"Resumen",assets:"Activos",incidents:"Incidentes"};
  const people = ["Nash Méndez","Laura Méndez","Carlos Ruiz","Ana Torres","Luis Ramírez","Marta Santos"];
  const categories = ["Servidor","Portátil","Red","Base de datos","Software","Otro"];
  const incidentCategories = ["Acceso no autorizado","Malware","Phishing","Actividad sospechosa","Disponibilidad","Pérdida de dispositivo","Otro"];
  const assetStatuses = ["Activo","En mantenimiento","Retirado"];
  const incidentStatuses = ["Abierto","En investigación","Contenido","Resuelto"];
  const severities = ["Crítica","Alta","Media","Baja"];
  const priorities = ["Urgente","Alta","Normal","Baja"];
  const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const icon = id => '<svg class="icon" aria-hidden="true"><use href="#i-' + id + '"></use></svg>';
  const getAsset = id => state.assets.find(item => item.id === id);
  const getIncident = id => state.incidents.find(item => item.id === id);
  const selected = (value,current) => value === current ? " selected" : "";
  const statusSlug = value => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replaceAll(" ","-");

  function ensureDialogAndToasts() {
    if (!document.getElementById("record-dialog")) {
      const dialog = document.createElement("dialog");
      dialog.id = "record-dialog";
      dialog.className = "record-dialog";
      dialog.setAttribute("aria-labelledby","dialog-title");
      dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
      });
      document.body.appendChild(dialog);
    }
    if (!document.getElementById("toast-region")) {
      const region = document.createElement("div");
      region.id = "toast-region";
      region.className = "toast-region";
      region.setAttribute("aria-live","polite");
      region.setAttribute("aria-atomic","true");
      document.body.appendChild(region);
    }
  }

  function notify(message,type) {
    const toast = document.createElement("div");
    toast.className = "app-toast " + (type === "error" ? "toast-error" : "toast-success");
    toast.setAttribute("role",type === "error" ? "alert" : "status");
    toast.textContent = message;
    document.getElementById("toast-region").appendChild(toast);
    window.setTimeout(() => toast.remove(),3600);
  }

  function openDialog(title,subtitle,body,wide) {
    const dialog = document.getElementById("record-dialog");
    dialog.classList.toggle("dialog-wide",Boolean(wide));
    dialog.innerHTML = '<div class="dialog-panel"><header class="dialog-header"><div><p class="eyebrow">DATOS DE DEMOSTRACIÓN</p><h2 id="dialog-title">' + escapeHtml(title) + '</h2><p>' + escapeHtml(subtitle) + '</p></div><button class="dialog-close" type="button" data-action="close-dialog" aria-label="Cerrar ventana">×</button></header><div class="dialog-body">' + body + '</div></div>';
    if (!dialog.open) dialog.showModal();
    const focusTarget = dialog.querySelector("input,select,textarea,button");
    if (focusTarget) focusTarget.focus();
  }

  function closeDialog() {
    const dialog = document.getElementById("record-dialog");
    if (dialog && dialog.open) dialog.close();
  }

  function pageHeading(title,description,actionLabel,action) {
    return '<section class="page-heading module-page-heading"><div><p class="eyebrow">FASE 2 · OPERACIÓN PRINCIPAL</p><h1>' + title + '</h1><p class="page-subtitle">' + description + '</p></div><div class="module-heading-actions"><span class="demo-note"><i></i> Datos ficticios · cambios temporales</span><button class="btn btn-primary app-primary-button" type="button" data-action="' + action + '">' + '<span class="button-plus" aria-hidden="true">＋</span><span>' + actionLabel + '</span></button></div></section>';
  }

  function statCard(label,value,caption,tone,mark) {
    return '<div class="col-12 col-sm-6 col-xl-3"><article class="stat-card h-100"><div class="stat-top"><span>' + label + '</span><span class="stat-icon ' + tone + '">' + mark + '</span></div><div class="stat-value">' + value + '</div><div class="stat-meta">' + caption + '</div></article></div>';
  }

  function selectOptions(options,current,placeholder) {
    return (placeholder ? '<option value="">' + placeholder + '</option>' : "") + options.map(value => '<option value="' + escapeHtml(value) + '"' + selected(value,current) + '>' + escapeHtml(value) + '</option>').join("");
  }

  function textField(label,name,value,required,wide,placeholder,minlength) {
    const req = required ? ' required aria-required="true"' : "";
    const min = minlength ? ' minlength="' + minlength + '"' : "";
    return '<div class="' + (wide ? "col-12" : "col-md-6") + '"><div class="field-wrap"><label for="field-' + name + '">' + label + (required ? ' <span class="required-mark">*</span>' : "") + '</label><input class="form-control" id="field-' + name + '" name="' + name + '" type="text" value="' + escapeHtml(value) + '" placeholder="' + escapeHtml(placeholder || "") + '"' + req + min + '><div class="invalid-feedback"></div></div></div>';
  }

  function selectField(label,name,value,options,required,wide) {
    const req = required ? ' required aria-required="true"' : "";
    return '<div class="' + (wide ? "col-12" : "col-md-6") + '"><div class="field-wrap"><label for="field-' + name + '">' + label + (required ? ' <span class="required-mark">*</span>' : "") + '</label><select class="form-select" id="field-' + name + '" name="' + name + '"' + req + '>' + selectOptions(options,value,required ? "Selecciona una opción" : "Sin asignar") + '</select><div class="invalid-feedback"></div></div></div>';
  }

  function textareaField(label,name,value,required,wide,placeholder,minlength) {
    const req = required ? ' required aria-required="true"' : "";
    const min = minlength ? ' minlength="' + minlength + '"' : "";
    return '<div class="' + (wide ? "col-12" : "col-md-6") + '"><div class="field-wrap"><label for="field-' + name + '">' + label + (required ? ' <span class="required-mark">*</span>' : "") + '</label><textarea class="form-control" id="field-' + name + '" name="' + name + '" rows="3" placeholder="' + escapeHtml(placeholder || "") + '"' + req + min + '>' + escapeHtml(value) + '</textarea><div class="invalid-feedback"></div></div></div>';
  }

  function formActions(cancelLabel,submitLabel) {
    return '<div class="form-actions"><span class="required-hint"><span class="required-mark">*</span> Campo obligatorio</span><div><button class="btn btn-light app-secondary-button" type="button" data-action="close-dialog">' + cancelLabel + '</button><button class="btn btn-primary app-primary-button" type="submit">' + submitLabel + '</button></div></div>';
  }

  function assetStateBadge(value) {
    return '<span class="record-status asset-status-' + statusSlug(value) + '"><i></i>' + escapeHtml(value) + '</span>';
  }

  function severityBadge(value) {
    return '<span class="record-pill severity-' + statusSlug(value) + '">' + escapeHtml(value) + '</span>';
  }

  function priorityBadge(value) {
    return '<span class="record-pill priority-' + statusSlug(value) + '">' + escapeHtml(value) + '</span>';
  }

  function incidentStateBadge(value) {
    return '<span class="record-status incident-status-' + statusSlug(value) + '"><i></i>' + escapeHtml(value) + '</span>';
  }

  function moduleToolbar(type) {
    if (type === "assets") {
      return '<section class="module-toolbar"><label class="module-search"><span>⌕</span><input id="asset-search" type="search" placeholder="Buscar por nombre, código o responsable..." aria-label="Buscar activos"></label><div class="filter-group"><select class="form-select filter-control" id="asset-category" aria-label="Filtrar por categoría">' + selectOptions(categories,"","Todas las categorías") + '</select><select class="form-select filter-control" id="asset-status" aria-label="Filtrar por estado">' + selectOptions(assetStatuses,"","Todos los estados") + '</select><button class="btn app-secondary-button" data-action="reset-assets" type="button">Limpiar</button></div></section>';
    }
    return '<section class="module-toolbar"><label class="module-search"><span>⌕</span><input id="incident-search" type="search" placeholder="Buscar por título, código o responsable..." aria-label="Buscar incidentes"></label><div class="filter-group"><select class="form-select filter-control" id="incident-status" aria-label="Filtrar por estado">' + selectOptions(incidentStatuses,"","Todos los estados") + '</select><select class="form-select filter-control" id="incident-severity" aria-label="Filtrar por severidad">' + selectOptions(severities,"","Todas las severidades") + '</select><button class="btn app-secondary-button" data-action="reset-incidents" type="button">Limpiar</button></div></section>';
  }

  function assetRow(item) {
    return '<tr data-asset-record="' + escapeHtml(item.id) + '"><td><div class="record-primary">' + escapeHtml(item.name) + '</div><div class="record-secondary">' + escapeHtml(item.id) + ' · ' + escapeHtml(item.serial || "Sin número de serie") + '</div></td><td>' + escapeHtml(item.category) + '</td><td><span class="person-chip"><i>' + escapeHtml(item.owner.split(" ").map(part=>part[0]).slice(0,2).join("")) + '</i>' + escapeHtml(item.owner) + '</span><small class="department-note">' + escapeHtml(item.department) + '</small></td><td>' + assetStateBadge(item.status) + '</td><td>' + severityBadge(item.criticality) + '</td><td>' + escapeHtml(item.reviewDate) + '</td><td><div class="row-actions"><button type="button" class="table-action" data-action="asset-details" data-id="' + escapeHtml(item.id) + '">Ver</button><button type="button" class="table-action" data-action="asset-edit" data-id="' + escapeHtml(item.id) + '" aria-label="Editar ' + escapeHtml(item.name) + '">Editar</button></div></td></tr>';
  }

  function assetCard(item) {
    return '<article class="mobile-record-card" data-asset-record="' + escapeHtml(item.id) + '"><div class="mobile-record-top"><div><div class="record-primary">' + escapeHtml(item.name) + '</div><div class="record-secondary">' + escapeHtml(item.id) + '</div></div>' + assetStateBadge(item.status) + '</div><div class="mobile-record-meta"><span><small>Categoría</small><b>' + escapeHtml(item.category) + '</b></span><span><small>Responsable</small><b>' + escapeHtml(item.owner) + '</b></span><span><small>Criticidad</small><b>' + severityBadge(item.criticality) + '</b></span></div><div class="mobile-record-actions"><button class="btn app-secondary-button" data-action="asset-details" data-id="' + escapeHtml(item.id) + '" type="button">Ver detalle</button><button class="btn app-secondary-button" data-action="asset-edit" data-id="' + escapeHtml(item.id) + '" type="button">Editar</button></div></article>';
  }

  function renderAssets() {
    const active = state.assets.filter(item => item.status === "Activo").length;
    const maintenance = state.assets.filter(item => item.status === "En mantenimiento").length;
    const critical = state.assets.filter(item => item.criticality === "Crítica").length;
    return pageHeading("Activos tecnológicos","Inventario, responsables y estado de los recursos de la organización.","Registrar activo","new-asset") +
      '<section class="row g-3 stats-grid module-stats" aria-label="Resumen de activos">' +
      statCard("Activos registrados",String(state.assets.length),"En el inventario demo","tone-blue",icon("box")) +
      statCard("Activos activos",String(active),"Disponibles en la organización","tone-teal",icon("check")) +
      statCard("En mantenimiento",String(maintenance),"Pendientes de revisión","tone-amber",icon("clock")) +
      statCard("Criticidad crítica",String(critical),"Requieren mayor protección","tone-coral",icon("shield")) + '</section>' +
      moduleToolbar("assets") +
      '<section class="surface-card module-table-card"><div class="section-heading module-list-heading"><div><h2>Inventario de activos</h2><p><span id="asset-visible-count">' + state.assets.length + '</span> registros · datos ficticios</p></div><span class="demo-note"><i></i> Solo en esta sesión</span></div>' +
      '<div class="table-responsive desktop-records"><table class="table align-middle mb-0 operation-table"><thead><tr><th>ACTIVO</th><th>CATEGORÍA</th><th>RESPONSABLE</th><th>ESTADO</th><th>CRITICIDAD</th><th>ÚLTIMA REVISIÓN</th><th>ACCIONES</th></tr></thead><tbody>' + state.assets.map(assetRow).join("") + '</tbody></table><div class="empty-state" id="asset-empty" hidden>No hay activos que coincidan con la búsqueda o los filtros.</div></div>' +
      '<div class="mobile-record-list">' + state.assets.map(assetCard).join("") + '<div class="empty-state" id="asset-empty-mobile" hidden>No hay activos que coincidan con la búsqueda o los filtros.</div></div></section>' +
      '<p class="module-disclaimer">Las altas y ediciones de esta demostración viven en memoria y se reinician al recargar la página.</p>';
  }

  function incidentRow(item) {
    const asset = getAsset(item.assetId);
    return '<tr data-incident-record="' + escapeHtml(item.id) + '"><td><div class="record-primary">' + escapeHtml(item.title) + '</div><div class="record-secondary">' + escapeHtml(item.id) + ' · ' + escapeHtml(item.category) + '</div></td><td>' + severityBadge(item.severity) + '</td><td>' + priorityBadge(item.priority) + '</td><td>' + incidentStateBadge(item.status) + '</td><td><span class="person-chip"><i>' + escapeHtml(item.assignee.split(" ").map(part=>part[0]).slice(0,2).join("")) + '</i>' + escapeHtml(item.assignee) + '</span></td><td>' + escapeHtml(item.reportedAt) + (asset ? '<small class="department-note">Activo: ' + escapeHtml(asset.name) + '</small>' : "") + '</td><td><button class="table-action" type="button" data-action="incident-details" data-id="' + escapeHtml(item.id) + '">Ver detalle</button></td></tr>';
  }

  function incidentCard(item) {
    return '<article class="mobile-record-card" data-incident-record="' + escapeHtml(item.id) + '"><div class="mobile-record-top"><div><div class="record-primary">' + escapeHtml(item.title) + '</div><div class="record-secondary">' + escapeHtml(item.id) + ' · ' + escapeHtml(item.reportedAt) + '</div></div>' + incidentStateBadge(item.status) + '</div><div class="incident-pills">' + severityBadge(item.severity) + priorityBadge(item.priority) + '</div><div class="mobile-record-meta"><span><small>Responsable</small><b>' + escapeHtml(item.assignee) + '</b></span><span><small>Categoría</small><b>' + escapeHtml(item.category) + '</b></span></div><div class="mobile-record-actions"><button class="btn app-secondary-button" type="button" data-action="incident-details" data-id="' + escapeHtml(item.id) + '">Abrir seguimiento</button></div></article>';
  }

  function renderIncidents() {
    const active = state.incidents.filter(item => item.status !== "Resuelto").length;
    const critical = state.incidents.filter(item => item.severity === "Crítica").length;
    const resolved = state.incidents.filter(item => item.status === "Resuelto").length;
    return pageHeading("Incidentes de seguridad","Registra, clasifica y da seguimiento a los incidentes.","Reportar incidente","new-incident") +
      '<section class="row g-3 stats-grid module-stats" aria-label="Resumen de incidentes">' +
      statCard("Incidentes registrados",String(state.incidents.length),"Historial de demostración","tone-blue",icon("alert")) +
      statCard("En seguimiento",String(active),"Abiertos o en tratamiento","tone-amber",icon("clock")) +
      statCard("Severidad crítica",String(critical),"Requieren revisión prioritaria","tone-coral",icon("alert")) +
      statCard("Resueltos",String(resolved),"En los registros de demostración","tone-teal",icon("check")) + '</section>' +
      moduleToolbar("incidents") +
      '<section class="surface-card module-table-card"><div class="section-heading module-list-heading"><div><h2>Registro de incidentes</h2><p><span id="incident-visible-count">' + state.incidents.length + '</span> registros · datos ficticios</p></div><span class="demo-note"><i></i> Solo en esta sesión</span></div>' +
      '<div class="table-responsive desktop-records"><table class="table align-middle mb-0 operation-table"><thead><tr><th>INCIDENTE</th><th>SEVERIDAD</th><th>PRIORIDAD</th><th>ESTADO</th><th>RESPONSABLE</th><th>REPORTADO</th><th>SEGUIMIENTO</th></tr></thead><tbody>' + state.incidents.map(incidentRow).join("") + '</tbody></table><div class="empty-state" id="incident-empty" hidden>No hay incidentes que coincidan con la búsqueda o los filtros.</div></div>' +
      '<div class="mobile-record-list">' + state.incidents.map(incidentCard).join("") + '<div class="empty-state" id="incident-empty-mobile" hidden>No hay incidentes que coincidan con la búsqueda o los filtros.</div></div></section>' +
      '<p class="module-disclaimer">Los cambios de estado y el historial se conservan solo durante esta sesión de demostración.</p>';
  }

  function assetForm(item) {
    const data = item || {name:"",category:"",owner:"",department:"",location:"",serial:"",status:"Activo",criticality:"Media",notes:""};
    return '<form class="record-form" data-form="asset" data-id="' + escapeHtml(item ? item.id : "") + '" novalidate><div class="row g-3">' +
      textField("Nombre del activo","name",data.name,true,false,"Ej. Servidor de aplicaciones",3) +
      selectField("Categoría","category",data.category,categories,true,false) +
      selectField("Responsable","owner",data.owner,people,true,false) +
      textField("Departamento","department",data.department,true,false,"Ej. Tecnología",2) +
      textField("Ubicación","location",data.location,false,false,"Ej. Centro de datos") +
      textField("Número de serie","serial",data.serial,false,false,"Identificador del fabricante") +
      selectField("Estado","status",data.status,assetStatuses,true,false) +
      selectField("Criticidad","criticality",data.criticality,severities,true,false) +
      textareaField("Notas","notes",data.notes,false,true,"Información descriptiva del activo",0) +
      '</div><div class="form-message" aria-live="polite"></div>' + formActions("Cancelar",item ? "Guardar cambios" : "Registrar activo") + '</form>';
  }

  function incidentForm() {
    return '<form class="record-form" data-form="incident" novalidate><div class="row g-3">' +
      textField("Título del incidente","title","",true,true,"Describe brevemente el incidente",5) +
      selectField("Categoría","category","",incidentCategories,true,false) +
      selectField("Severidad","severity","",severities,true,false) +
      selectField("Prioridad","priority","",priorities,true,false) +
      selectField("Responsable asignado","assignee","",people,true,false) +
      selectField("Activo relacionado","assetId","",state.assets.map(item => item.id + " — " + item.name),false,false) +
      textField("Persona que reporta","reporter","Nash Méndez",true,false,"Nombre de quien reporta",2) +
      textareaField("Descripción","description","",true,true,"Incluye los detalles conocidos y el impacto observado.",10) +
      '</div><div class="form-message" aria-live="polite"></div>' + formActions("Cancelar","Registrar incidente") + '</form>';
  }

  function openAssetDetails(id) {
    const item = getAsset(id);
    if (!item) return;
    const body = '<div class="detail-hero"><span class="detail-icon">' + icon("box") + '</span><div><p class="record-secondary">' + escapeHtml(item.id) + '</p><h3>' + escapeHtml(item.name) + '</h3><div class="incident-pills">' + assetStateBadge(item.status) + severityBadge(item.criticality) + '</div></div></div>' +
      '<div class="detail-grid"><div><small>Categoría</small><strong>' + escapeHtml(item.category) + '</strong></div><div><small>Responsable</small><strong>' + escapeHtml(item.owner) + '</strong></div><div><small>Departamento</small><strong>' + escapeHtml(item.department) + '</strong></div><div><small>Ubicación</small><strong>' + escapeHtml(item.location || "Sin especificar") + '</strong></div><div><small>Número de serie</small><strong>' + escapeHtml(item.serial || "Sin especificar") + '</strong></div><div><small>Última revisión</small><strong>' + escapeHtml(item.reviewDate) + '</strong></div><div class="detail-full"><small>Notas</small><p>' + escapeHtml(item.notes || "Sin notas registradas.") + '</p></div></div>' +
      '<div class="form-actions detail-actions"><span class="required-hint">Información ficticia del inventario demo</span><div><button class="btn app-secondary-button" type="button" data-action="close-dialog">Cerrar</button><button class="btn btn-primary app-primary-button" type="button" data-action="asset-edit" data-id="' + escapeHtml(item.id) + '">Editar activo</button></div></div>';
    openDialog("Detalle del activo","Ficha de inventario · datos de demostración",body,true);
  }

  function openIncidentDetails(id) {
    const item = getIncident(id);
    if (!item) return;
    const asset = getAsset(item.assetId);
    const history = item.history.map(entry => '<li class="timeline-item"><span class="timeline-point"></span><div><div class="timeline-meta"><strong>' + escapeHtml(entry.actor) + '</strong><time>' + escapeHtml(entry.when) + '</time></div><p>' + escapeHtml(entry.note) + '</p></div></li>').join("");
    const body = '<div class="detail-hero incident-detail-hero"><span class="detail-icon detail-icon-coral">' + icon("alert") + '</span><div><p class="record-secondary">' + escapeHtml(item.id) + ' · ' + escapeHtml(item.category) + '</p><h3>' + escapeHtml(item.title) + '</h3><div class="incident-pills">' + severityBadge(item.severity) + priorityBadge(item.priority) + incidentStateBadge(item.status) + '</div></div></div>' +
      '<div class="incident-detail-grid"><section class="detail-section"><h3>Descripción</h3><p>' + escapeHtml(item.description) + '</p><div class="detail-grid compact-detail-grid"><div><small>Reportado por</small><strong>' + escapeHtml(item.reporter) + '</strong></div><div><small>Responsable</small><strong>' + escapeHtml(item.assignee) + '</strong></div><div><small>Activo relacionado</small><strong>' + escapeHtml(asset ? asset.name : "Ninguno") + '</strong></div><div><small>Fecha de reporte</small><strong>' + escapeHtml(item.reportedAt) + '</strong></div></div></section>' +
      '<section class="detail-section tracking-section"><h3>Actualizar seguimiento</h3><form class="record-form tracking-form" data-form="tracking" data-id="' + escapeHtml(item.id) + '" novalidate><div class="field-wrap"><label for="tracking-status">Estado</label><select class="form-select" id="tracking-status" name="status" required>' + selectOptions(incidentStatuses,item.status) + '</select><div class="invalid-feedback"></div></div><div class="field-wrap"><label for="tracking-assignee">Responsable</label><select class="form-select" id="tracking-assignee" name="assignee" required>' + selectOptions(people,item.assignee) + '</select><div class="invalid-feedback"></div></div><div class="field-wrap"><label for="tracking-note">Nota de seguimiento <span class="required-mark">*</span></label><textarea class="form-control" id="tracking-note" name="note" rows="3" required minlength="3" placeholder="Describe la actualización realizada"></textarea><div class="invalid-feedback"></div></div><button class="btn btn-primary app-primary-button" type="submit">Guardar actualización</button></form></section></div>' +
      '<section class="detail-section timeline-section"><h3>Historial de seguimiento <span>' + item.history.length + '</span></h3><ol class="timeline">' + history + '</ol></section>';
    openDialog("Detalle del incidente","Seguimiento del caso · datos de demostración",body,true);
  }

  function fieldError(control) {
    const value = control.value.trim();
    if (control.required && !value) return "Completa este campo.";
    if (control.minLength > 0 && value && value.length < control.minLength) return "Escribe al menos " + control.minLength + " caracteres.";
    return "";
  }

  function validateForm(form) {
    let valid = true;
    let firstInvalid = null;
    form.querySelectorAll("input,select,textarea").forEach(control => {
      const message = fieldError(control);
      control.classList.toggle("is-invalid",Boolean(message));
      const feedback = control.closest(".field-wrap")?.querySelector(".invalid-feedback");
      if (feedback) feedback.textContent = message;
      if (message && !firstInvalid) firstInvalid = control;
      if (message) valid = false;
    });
    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  function assetFormValues(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    return {name:values.name.trim(),category:values.category,owner:values.owner,department:values.department.trim(),location:values.location.trim(),serial:values.serial.trim(),status:values.status,criticality:values.criticality,notes:values.notes.trim()};
  }

  function submitAsset(form) {
    if (!validateForm(form)) {
      notify("Revisa los campos marcados antes de continuar.","error");
      return;
    }
    const id = form.dataset.id;
    const values = assetFormValues(form);
    if (id) {
      Object.assign(getAsset(id),values,{reviewDate:"Hoy"});
      notify("Activo actualizado en los datos de demostración.");
    } else {
      const next = String(state.assets.length + 1).padStart(3,"0");
      state.assets.unshift({id:"AST-" + next,...values,reviewDate:"Hoy"});
      notify("Activo registrado en los datos de demostración.");
    }
    closeDialog();
    renderRoute();
  }

  function submitIncident(form) {
    if (!validateForm(form)) {
      notify("Revisa los campos marcados antes de continuar.","error");
      return;
    }
    const values = Object.fromEntries(new FormData(form).entries());
    const related = values.assetId ? values.assetId.split(" — ")[0] : "";
    const id = "INC-2026-" + String(49 + state.incidents.length - 5).padStart(3,"0");
    state.incidents.unshift({id,title:values.title.trim(),category:values.category,severity:values.severity,priority:values.priority,status:"Abierto",reporter:values.reporter.trim(),assignee:values.assignee,assetId:related,reportedAt:"Ahora",description:values.description.trim(),history:[{when:"Ahora",actor:values.reporter.trim(),note:"Incidente registrado en los datos de demostración."}]});
    closeDialog();
    renderRoute();
    notify("Incidente registrado en los datos de demostración.");
  }

  function submitTracking(form) {
    if (!validateForm(form)) {
      notify("Añade una nota de seguimiento antes de guardar.","error");
      return;
    }
    const item = getIncident(form.dataset.id);
    if (!item) return;
    const values = Object.fromEntries(new FormData(form).entries());
    item.status = values.status;
    item.assignee = values.assignee;
    item.history.unshift({when:"Ahora",actor:"Nash Méndez",note:values.note.trim() + " · Estado actualizado a " + values.status + "."});
    closeDialog();
    renderRoute();
    notify("Seguimiento actualizado en esta sesión.");
  }

  function filterAssets() {
    const query = (document.getElementById("asset-search")?.value || "").toLocaleLowerCase("es").trim();
    const category = document.getElementById("asset-category")?.value || "";
    const status = document.getElementById("asset-status")?.value || "";
    const matches = state.assets.filter(item => {
      const text = [item.id,item.name,item.category,item.owner,item.department,item.serial].join(" ").toLocaleLowerCase("es");
      return text.includes(query) && (!category || item.category === category) && (!status || item.status === status);
    });
    const ids = new Set(matches.map(item => item.id));
    document.querySelectorAll("[data-asset-record]").forEach(node => node.hidden = !ids.has(node.dataset.assetRecord));
    document.getElementById("asset-visible-count").textContent = String(matches.length);
    document.getElementById("asset-empty").hidden = matches.length !== 0;
    document.getElementById("asset-empty-mobile").hidden = matches.length !== 0;
  }

  function filterIncidents() {
    const query = (document.getElementById("incident-search")?.value || "").toLocaleLowerCase("es").trim();
    const status = document.getElementById("incident-status")?.value || "";
    const severity = document.getElementById("incident-severity")?.value || "";
    const matches = state.incidents.filter(item => {
      const text = [item.id,item.title,item.category,item.assignee,item.reporter,item.description].join(" ").toLocaleLowerCase("es");
      return text.includes(query) && (!status || item.status === status) && (!severity || item.severity === severity);
    });
    const ids = new Set(matches.map(item => item.id));
    document.querySelectorAll("[data-incident-record]").forEach(node => node.hidden = !ids.has(node.dataset.incidentRecord));
    document.getElementById("incident-visible-count").textContent = String(matches.length);
    document.getElementById("incident-empty").hidden = matches.length !== 0;
    document.getElementById("incident-empty-mobile").hidden = matches.length !== 0;
  }

  function renderRoute() {
    const requested = location.hash.replace("#","");
    const page = pageNames[requested] ? requested : "dashboard";
    document.getElementById("breadcrumb-current").textContent = pageNames[page];
    document.title = "SecureBusiness | " + pageNames[page];
    document.querySelectorAll(".side-link[data-page]").forEach(link => {
      const active = link.dataset.page === page;
      link.classList.toggle("is-active",active);
      if (active) link.setAttribute("aria-current","page");
      else link.removeAttribute("aria-current");
    });
    dashboardView.hidden = page !== "dashboard";
    moduleView.hidden = page === "dashboard";
    if (page === "assets") {
      moduleView.innerHTML = renderAssets();
      filterAssets();
    } else if (page === "incidents") {
      moduleView.innerHTML = renderIncidents();
      filterIncidents();
    }
    if (page !== "dashboard") window.scrollTo({top:0,behavior:"smooth"});
  }

  function closeMobileMenu(returnFocus) {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded","false");
    menuToggle.setAttribute("aria-label","Abrir menú");
    if (returnFocus) menuToggle.focus();
  }

  document.addEventListener("click",event => {
    const routeLink = event.target.closest(".side-link[data-page]");
    if (routeLink) {
      const page = routeLink.dataset.page;
      closeMobileMenu(false);
      if (location.hash === "#" + page) renderRoute();
      return;
    }
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const id = action.dataset.id;
    switch (action.dataset.action) {
      case "new-asset":
        openDialog("Registrar activo","Añade un recurso al inventario de demostración.",assetForm(null),true);
        break;
      case "asset-edit":
        closeDialog();
        openDialog("Editar activo","Actualiza la ficha de demostración del activo.",assetForm(getAsset(id)),true);
        break;
      case "asset-details":
        openAssetDetails(id);
        break;
      case "new-incident":
        openDialog("Reportar incidente","Registra los detalles iniciales del incidente.",incidentForm(),true);
        break;
      case "incident-details":
        openIncidentDetails(id);
        break;
      case "close-dialog":
        closeDialog();
        break;
      case "reset-assets":
        document.getElementById("asset-search").value = "";
        document.getElementById("asset-category").value = "";
        document.getElementById("asset-status").value = "";
        filterAssets();
        break;
      case "reset-incidents":
        document.getElementById("incident-search").value = "";
        document.getElementById("incident-status").value = "";
        document.getElementById("incident-severity").value = "";
        filterIncidents();
        break;
      default:
        break;
    }
  });

  document.addEventListener("input",event => {
    if (event.target.matches("#asset-search")) filterAssets();
    if (event.target.matches("#incident-search")) filterIncidents();
    if (event.target.matches(".record-form input,.record-form textarea,.record-form select") && event.target.classList.contains("is-invalid")) {
      const message = fieldError(event.target);
      event.target.classList.toggle("is-invalid",Boolean(message));
      const feedback = event.target.closest(".field-wrap")?.querySelector(".invalid-feedback");
      if (feedback) feedback.textContent = message;
    }
  });

  document.addEventListener("change",event => {
    if (event.target.matches("#asset-category,#asset-status")) filterAssets();
    if (event.target.matches("#incident-status,#incident-severity")) filterIncidents();
  });

  document.addEventListener("submit",event => {
    const form = event.target;
    if (!form.matches(".record-form")) return;
    event.preventDefault();
    if (form.dataset.form === "asset") submitAsset(form);
    if (form.dataset.form === "incident") submitIncident(form);
    if (form.dataset.form === "tracking") submitTracking(form);
  });

  menuToggle.addEventListener("click",() => {
    const open = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded",String(open));
    menuToggle.setAttribute("aria-label",open ? "Cerrar menú" : "Abrir menú");
    if (open) sidebar.querySelector(".side-link:not(:disabled)")?.focus();
  });
  backdrop.addEventListener("click",() => closeMobileMenu(true));
  document.addEventListener("keydown",event => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) closeMobileMenu(true);
  });
  window.matchMedia("(min-width: 992px)").addEventListener("change",event => {
    if (event.matches) closeMobileMenu(false);
  });
  window.addEventListener("hashchange",renderRoute);

  ensureDialogAndToasts();
  renderRoute();
})();