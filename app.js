(() => {
  const pageNames = {
    dashboard: "Resumen", incidents: "Incidentes", assets: "Activos",
    vulnerabilities: "Vulnerabilidades", risks: "Riesgos", secureai: "SecureAI",
    reports: "Informes", audit: "Auditoría", team: "Equipo"
  };
  const incidentRows = [
    ["INC-2026-048", "Intento de acceso no autorizado", "Crítico", "Abierto", "Laura Méndez", "Hoy, 09:42"],
    ["INC-2026-047", "Correo de phishing reportado", "Alto", "En revisión", "Nash Méndez", "Hoy, 08:16"],
    ["INC-2026-046", "Equipo con actividad inusual", "Medio", "En revisión", "Carlos Ruiz", "Ayer, 16:30"],
    ["INC-2026-045", "Pérdida de dispositivo móvil", "Bajo", "Resuelto", "Ana Torres", "Ayer, 11:05"]
  ];
  const assetRows = [
    ["AST-001", "Servidor de producción", "Servidor", "Infraestructura", "Activo", "12/04/2026"],
    ["AST-002", "Portátil — Finanzas 04", "Portátil", "Finanzas", "Activo", "22/06/2026"],
    ["AST-003", "Firewall perimetral", "Red", "Infraestructura", "Activo", "08/02/2026"],
    ["AST-004", "BD Clientes principal", "Base de datos", "Tecnología", "En revisión", "15/03/2026"]
  ];
  const vulnRows = [
    ["VUL-031", "OpenSSL desactualizado", "Servidor de producción", "Crítica", "Pendiente", "30 nov. 2026"],
    ["VUL-030", "Parche de seguridad pendiente", "Portátil — Finanzas 04", "Alta", "En curso", "28 nov. 2026"],
    ["VUL-029", "Configuración TLS débil", "Firewall perimetral", "Media", "Pendiente", "05 dic. 2026"],
    ["VUL-028", "Permisos de acceso excesivos", "BD Clientes principal", "Alta", "En curso", "02 dic. 2026"]
  ];
  const riskRows = [
    ["RSK-014", "Exposición de datos de clientes", "Alta", "Crítico", "Mitigación en curso"],
    ["RSK-013", "Interrupción del servicio", "Media", "Alto", "Planificado"],
    ["RSK-012", "Robo de credenciales", "Alta", "Alto", "Mitigación en curso"],
    ["RSK-011", "Pérdida de equipo", "Baja", "Medio", "Aceptado"]
  ];
  const auditRows = [
    ["Nash Méndez", "Actualizó gravedad del incidente", "INC-2026-047", "Hoy, 09:21", "Actualización"],
    ["Laura Méndez", "Creó un nuevo incidente", "INC-2026-048", "Hoy, 09:42", "Creación"],
    ["Carlos Ruiz", "Adjuntó evidencia", "INC-2026-046", "Ayer, 16:35", "Archivo"],
    ["Nash Méndez", "Inició sesión", "—", "Ayer, 15:10", "Acceso"]
  ];
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const badge = (value, kind) => '<span class="' + kind + '">' + esc(value) + '</span>';
  const incidentTable = rows => rows.map(r => '<tr class="filter-row"><td><div class="incident-title">' + esc(r[1]) + '</div><div class="incident-id">' + esc(r[0]) + '</div></td><td>' + badge(r[2], 'severity-badge ' + (r[2] === "Crítico" || r[2] === "Alto" ? "high" : r[2] === "Medio" ? "medium" : "low")) + '</td><td>' + badge(r[3], 'status-badge ' + (r[3] === "Abierto" ? "open" : r[3] === "Resuelto" ? "resolved" : "progress")) + '</td><td>' + esc(r[4]) + '</td><td>' + esc(r[5]) + '</td><td><button class="row-menu" aria-label="Más opciones">···</button></td></tr>').join("");
  const simpleTable = (rows, classes, badgeIndex) => rows.map(row => '<tr class="filter-row">' + row.map((cell, i) => '<td>' + (i === 0 ? '<span class="incident-title">' + esc(cell) + '</span>' : i === (badgeIndex === undefined ? row.length - 1 : badgeIndex) && classes ? badge(cell, classes(cell)) : esc(cell)) + '</td>').join("") + '</tr>').join("");
  function heading(title, subtitle, action) {
    return '<div class="page-heading"><div><p class="eyebrow">CENTRO DE SEGURIDAD</p><h1>' + title + '</h1><p>' + subtitle + '</p></div><div class="heading-actions"><button class="date-filter" data-action="date">▦ &nbsp; Últimos 30 días &nbsp;⌄</button>' + (action || '') + '</div></div>';
  }
  function stat(label, value, delta, icon, tone) {
    return '<article class="stat-card"><div class="stat-head">' + label + '<span class="stat-icon ' + tone + '">' + icon + '</span></div><div class="stat-number">' + value + '</div><div class="stat-foot">' + delta + '</div></article>';
  }
  function sectionTitle(title, subtitle, link, page) {
    return '<div class="panel-heading"><div class="table-title"><h2>' + title + '</h2><p>' + subtitle + '</p></div><button class="view-all" data-page="' + page + '">' + link + ' →</button></div>';
  }
  function dashboard() {
    return heading("Buenos días, Nash <span class=\"wave\">✳</span>", "Este es el estado de seguridad de NovaTech Solutions.", '<button class="primary-button" data-page="incidents"><span class="button-plus">＋</span> Nuevo incidente</button>') +
      '<section class="stats-grid">' +
      stat("Incidentes activos", "12", '<span class="trend-down">↓ 8.2%</span> vs. mes anterior', "◉", "teal") +
      stat("Activos protegidos", "248", '<span class="trend-up">↑ 12</span> incorporados este mes', "▧", "blue") +
      stat("Vulnerabilidades", "08", '<span class="trend-down">↓ 3</span> desde la última revisión', "◇", "amber") +
      stat("Puntuación de riesgo", "72<span class=\"stat-suffix\">/100</span>", '<span class="trend-up">↑ 4.5%</span> mejora este mes', "△", "purple") + '</section>' +
      '<section class="dashboard-grid"><article class="panel"><div class="panel-heading"><div><h2>Panorama de seguridad</h2><p>Actividad de incidentes y vulnerabilidades durante el periodo</p></div><div class="legend"><span class="legend-item"><i class="legend-dot"></i>Incidentes</span><span class="legend-item"><i class="legend-dot blue-dot"></i>Vulnerabilidades</span></div></div>' +
      '<div class="chart-wrap"><div class="chart-labels-y"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div><div class="chart-grid-lines"><span></span><span></span><span></span><span></span><span></span></div><svg class="chart-svg" viewBox="0 0 600 170" preserveAspectRatio="none" aria-label="Gráfica de actividad"><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#159c84" stop-opacity=".18"/><stop offset="1" stop-color="#159c84" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="M0 131 C45 125 50 85 100 94 S160 119 200 82 S250 78 300 91 S350 52 400 61 S450 91 500 40 S550 53 600 24 L600 170 L0 170Z"/><path class="chart-line" d="M0 131 C45 125 50 85 100 94 S160 119 200 82 S250 78 300 91 S350 52 400 61 S450 91 500 40 S550 53 600 24"/><path class="chart-line secondary" d="M0 145 C45 137 55 124 100 132 S155 100 200 116 S255 135 300 110 S355 130 400 101 S455 111 500 85 S555 100 600 72"/><circle class="chart-point" cx="500" cy="40" r="4"/><circle class="chart-point secondary" cx="500" cy="85" r="4"/></svg><div class="chart-labels-x"><span>1 nov.</span><span>5 nov.</span><span>10 nov.</span><span>15 nov.</span><span>20 nov.</span><span>25 nov.</span><span>30 nov.</span></div></div></article>' +
      '<article class="panel"><div class="panel-heading"><div><h2>Incidentes por gravedad</h2><p>Distribución actual</p></div><button class="panel-link" data-page="incidents">Ver todos</button></div><div class="severity-list">' +
      '<div class="severity-row"><span class="severity-label"><i class="severity-color" style="background:#dc6262"></i>Crítica</span><div class="severity-bar"><span style="width:22%;background:#dc6262"></span></div><b class="severity-value">4</b></div>' +
      '<div class="severity-row"><span class="severity-label"><i class="severity-color" style="background:#e6a13d"></i>Alta</span><div class="severity-bar"><span style="width:48%;background:#e6a13d"></span></div><b class="severity-value">9</b></div>' +
      '<div class="severity-row"><span class="severity-label"><i class="severity-color" style="background:#6386df"></i>Media</span><div class="severity-bar"><span style="width:72%;background:#6386df"></span></div><b class="severity-value">14</b></div>' +
      '<div class="severity-row"><span class="severity-label"><i class="severity-color" style="background:#48aa8f"></i>Baja</span><div class="severity-bar"><span style="width:36%;background:#48aa8f"></span></div><b class="severity-value">7</b></div></div><div class="severity-caption"><span class="caption-check">✓</span> Sin cambios críticos en las últimas 24 horas</div></article></section>' +
      '<section class="bottom-grid"><article class="table-panel">' + sectionTitle("Incidentes recientes", "Seguimiento de los eventos más recientes", "Ver todos", "incidents") + '<div class="table-scroll"><table class="data-table"><thead><tr><th>INCIDENTE</th><th>GRAVEDAD</th><th>ESTADO</th><th>RESPONSABLE</th><th>FECHA</th><th></th></tr></thead><tbody>' + incidentTable(incidentRows.slice(0, 3)) + '</tbody></table></div><div class="table-footer"><span>Mostrando 3 de 12 incidentes</span><span>Actualizado hace 4 min</span></div></article>' +
      '<article class="panel"><div class="panel-heading"><div><h2>Actividad reciente</h2><p>Últimas acciones en tu organización</p></div><button class="panel-link" data-page="audit">Ver auditoría</button></div><div class="activity-list">' +
      '<div class="activity-item"><span class="activity-icon red">!</span><div class="activity-copy"><b>Laura Méndez</b> reportó un incidente crítico<small>Intento de acceso no autorizado · hace 18 min</small></div></div>' +
      '<div class="activity-item"><span class="activity-icon blue">◇</span><div class="activity-copy"><b>Nash Méndez</b> asignó una vulnerabilidad<small>OpenSSL desactualizado · hace 1 h</small></div></div>' +
      '<div class="activity-item"><span class="activity-icon green">✓</span><div class="activity-copy"><b>Carlos Ruiz</b> resolvió un incidente<small>Pérdida de dispositivo móvil · hace 3 h</small></div></div>' +
      '<div class="activity-item"><span class="activity-icon amber">＋</span><div class="activity-copy"><b>Ana Torres</b> registró un nuevo activo<small>Portátil — Marketing 02 · hace 5 h</small></div></div></div></article></section>';
  }
  function tablePage(key) {
    const config = {
      incidents: ["Incidentes", "Registra, asigna y da seguimiento a los incidentes de seguridad.", "＋ Nuevo incidente", ["INCIDENTE","GRAVEDAD","ESTADO","RESPONSABLE","FECHA"], incidentTable(incidentRows)],
      assets: ["Activos", "Inventario de dispositivos y recursos tecnológicos de la organización.", "＋ Añadir activo", ["CÓDIGO","ACTIVO","TIPO","DEPARTAMENTO","ESTADO","ÚLTIMA REVISIÓN"], simpleTable(assetRows, v => "status-badge " + (v === "Activo" ? "resolved" : "progress"), 4)],
      vulnerabilities: ["Vulnerabilidades", "Prioriza hallazgos y controla su proceso de remediación.", "＋ Registrar hallazgo", ["CÓDIGO","HALLAZGO","ACTIVO AFECTADO","CRITICIDAD","ESTADO","FECHA LÍMITE"], simpleTable(vulnRows, v => "severity-badge " + (v === "Crítica" || v === "Alta" ? "high" : "medium"), 3)],
      risks: ["Riesgos", "Evalúa y prioriza los riesgos de seguridad de NovaTech Solutions.", "＋ Nueva evaluación", ["CÓDIGO","RIESGO","PROBABILIDAD","NIVEL","TRATAMIENTO"], simpleTable(riskRows, v => "risk-badge " + (v === "Crítico" || v === "Alto" ? "high" : "medium"), 3)],
      audit: ["Auditoría", "Historial verificable de acciones realizadas en tu organización.", "⇩ Exportar", ["USUARIO","ACCIÓN","REGISTRO","FECHA","TIPO"], simpleTable(auditRows, v => "status-badge " + (v === "Acceso" ? "progress" : "resolved"), 4)]
    }[key];
    const rows = config[4];
    return (key === "risks" ? "" : heading(config[0], config[1], '<button class="primary-button" data-action="' + (key === "audit" ? "export" : "new-record") + '"><span class="button-plus">' + config[2].slice(0,1) + '</span>' + config[2].slice(2) + '</button>')) +
      '<div class="module-toolbar"><div class="toolbar-left"><select class="filter-select" aria-label="Filtrar por estado"><option value="">Todos los estados</option><option>Abierto</option><option>En revisión</option><option>En curso</option><option>Resuelto</option><option>Pendiente</option></select><select class="filter-select" aria-label="Filtrar por gravedad"><option value="">Todas las gravedades</option><option>Crítica</option><option>Alta</option><option>Media</option><option>Baja</option></select></div><div class="toolbar-right"><label class="table-search"><span>⌕</span><input class="table-filter" type="search" placeholder="Buscar registro..."></label><button class="secondary-button" data-action="filter">☷ &nbsp; Filtros</button></div></div>' +
      '<article class="table-panel full-table"><div class="table-scroll"><table class="data-table"><thead><tr>' + config[3].map(h => '<th>' + h + '</th>').join("") + '</tr></thead><tbody>' + rows + '</tbody></table></div><div class="table-footer"><span>Mostrando ' + (key === "incidents" ? "4 de 12" : "4 de 24") + ' registros</span><span>‹ &nbsp; 1 &nbsp; 2 &nbsp; 3 &nbsp; … &nbsp; 6 &nbsp; ›</span></div></article>';
  }
  function risksPage() {
    return heading("Riesgos", "Evalúa y prioriza los riesgos de seguridad de NovaTech Solutions.", '<button class="primary-button" data-action="new-record">＋ Nueva evaluación</button>') +
      '<section class="stats-grid">' + stat("Riesgos identificados","18",'<span class="trend-up">4</span> en tratamiento','△','purple') + stat("Nivel crítico","3","Requieren atención inmediata","!","amber") + stat("Riesgos mitigados","11",'<span class="trend-up">↑ 2</span> este mes','✓','teal') + stat("Puntuación global","72/100",'<span class="trend-up">↑ 4.5%</span> vs. mes anterior','◉','blue') + '</section>' +
      '<section class="two-column"><article class="feature-card"><h2>Matriz de riesgo</h2><p>Distribución de riesgos según probabilidad e impacto.</p><div class="risk-matrix">' + Array.from({length:25},(_,i)=>'<div class="risk-cell ' + ([8,13,18,22].includes(i) ? "active-cell" : "") + '"></div>').join("") + '</div><div class="risk-labels"><span>Impacto bajo</span><span>Impacto alto</span></div><div class="risk-labels"><span>Probabilidad baja</span><span>Probabilidad alta</span></div></article><article class="feature-card"><h2>Exposición de riesgo</h2><p>El nivel de exposición general se mantiene en un rango moderado.</p><div class="risk-meter"><span style="width:72%"></span></div><b>72 <small>/ 100</small></b><p>3 riesgos críticos y 5 altos necesitan seguimiento prioritario.</p><button class="secondary-button" data-action="export">Descargar evaluación</button></article></section><div style="height:15px"></div>' + tablePage("risks");
  }
  function secureAi() {
    return heading("SecureAI", "Asistente de seguridad con contexto autorizado de tu organización.", "") +
      '<section class="ai-layout"><article class="panel ai-chat"><div class="ai-intro"><span class="ai-orb">✳</span><div><h2>SecureAI</h2><p><i class="status-dot"></i> Conectado al espacio NovaTech Solutions</p></div></div><div class="ai-msg"><b>Hola, Nash.</b> Puedo ayudarte a analizar incidentes, resumir tendencias y priorizar riesgos usando la información disponible para tu organización. ¿Qué necesitas revisar?</div><div class="ai-suggestions"><button class="suggestion-chip">Resume los incidentes críticos</button><button class="suggestion-chip">¿Qué riesgos requieren atención?</button><button class="suggestion-chip">Prepara un resumen ejecutivo</button></div><form class="ai-input-row" id="ai-form"><input id="ai-input" autocomplete="off" placeholder="Pregunta sobre la seguridad de tu organización..." aria-label="Mensaje para SecureAI"><button class="primary-button" type="submit">Enviar&nbsp; ↑</button></form><p class="ai-note">SecureAI ofrece recomendaciones. Verifica la información antes de tomar decisiones.</p></article><aside class="ai-aside"><article class="feature-card"><h2>Contexto de SecureAI</h2><p>SecureAI solo utiliza información autorizada de tu organización activa.</p><div class="secure-list"><div class="secure-item"><b>Organización</b>NovaTech Solutions</div><div class="secure-item"><b>Fuentes disponibles</b>Incidentes, activos y riesgos</div><div class="secure-item"><b>Privacidad</b>Datos aislados por organización</div></div></article><article class="feature-card"><h2>Conversaciones recientes</h2><p>No hay conversaciones guardadas en esta demostración.</p></article></aside></section>';
  }
  function reports() {
    const cards = [["SEGURIDAD","Resumen ejecutivo de seguridad","Indicadores y estado general de ciberseguridad."],["INCIDENTES","Análisis de incidentes","Tendencias, gravedad y tiempo de resolución."],["ACTIVOS","Inventario de activos","Resumen del inventario tecnológico."],["RIESGOS","Evaluación de riesgos","Riesgos identificados y acciones de mitigación."],["VULNERABILIDADES","Estado de vulnerabilidades","Hallazgos por criticidad y remediación."],["AUDITORÍA","Registro de actividad","Acciones registradas durante el periodo."]];
    return heading("Informes", "Consulta y prepara informes de seguridad de tu organización.", '<button class="secondary-button" data-action="export">⇩ Exportar informe</button>') + '<section class="report-cards">' + cards.map(c=>'<article class="feature-card report-card"><div class="stat-icon teal">▤</div><div class="report-type">'+c[0]+'</div><h3>'+c[1]+'</h3><p>'+c[2]+'</p><button data-action="export">Generar informe →</button></article>').join("") + '</section>';
  }
  function team() {
    const people = [["NM","Nash Méndez","Administrador empresarial"],["LM","Laura Méndez","Analista de seguridad"],["CR","Carlos Ruiz","Analista de seguridad"],["AT","Ana Torres","Auditor"]];
    return heading("Equipo", "Usuarios con acceso a NovaTech Solutions.", '<button class="primary-button" data-action="new-record">＋ Invitar usuario</button>') + '<section class="team-list">' + people.map(p=>'<article class="team-member"><span class="member-avatar">'+p[0]+'</span><div class="member-info"><b>'+p[1]+'</b><small>'+p[2]+'</small></div><span class="member-state">● Activo</span><button class="row-menu" aria-label="Opciones para '+p[1]+'">···</button></article>').join("") + '</section>';
  }
  const content = document.getElementById("page-content");
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("mobile-scrim");
  function notify(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.getElementById("toast-region").appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }
  function render(key) {
    if (!pageNames[key]) key = "dashboard";
    document.getElementById("breadcrumb-current").textContent = pageNames[key];
    document.querySelectorAll(".nav-item").forEach(a => a.classList.toggle("active", a.dataset.page === key));
    content.innerHTML = key === "dashboard" ? dashboard() :
      ["incidents","assets","vulnerabilities","audit"].includes(key) ? tablePage(key) :
      key === "risks" ? risksPage() : key === "secureai" ? secureAi() :
      key === "reports" ? reports() : team();
  }
  function navigate(key) {
    if (!pageNames[key]) return;
    if (location.hash.slice(1) !== key) location.hash = key;
    render(key);
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  document.addEventListener("click", event => {
    const pageLink = event.target.closest("[data-page]");
    if (pageLink) {
      event.preventDefault();
      navigate(pageLink.dataset.page);
      return;
    }
    const action = event.target.closest("[data-action]");
    if (action) {
      const messages = {
        "new-record":"Formulario de demostración. La conexión con Laravel está pendiente.",
        "export":"La exportación estará disponible al integrar el backend.",
        "notifications":"Tienes 3 alertas pendientes de revisar.",
        "help":"Centro de ayuda: documentación disponible próximamente.",
        "profile":"Perfil de Nash Méndez · Administrador empresarial.",
        "organization":"Organización activa: NovaTech Solutions.",
        "upgrade":"La gestión de planes está fuera del alcance de esta versión."
      };
      notify(messages[action.dataset.action] || "Filtros de demostración");
    }
    const chip = event.target.closest(".suggestion-chip");
    if (chip) {
      const input = document.getElementById("ai-input");
      input.value = chip.textContent;
      input.focus();
    }
  });
  document.addEventListener("input", event => {
    if (event.target.matches(".table-filter")) {
      const query = event.target.value.trim().toLocaleLowerCase("es");
      document.querySelectorAll(".filter-row").forEach(row => row.hidden = !row.innerText.toLocaleLowerCase("es").includes(query));
    }
    if (event.target.matches("#global-search")) {
      const query = event.target.value.trim().toLocaleLowerCase("es");
      document.querySelectorAll(".filter-row").forEach(row => row.hidden = !row.innerText.toLocaleLowerCase("es").includes(query));
    }
  });
  document.addEventListener("change", event => {
    if (event.target.matches(".filter-select") && event.target.value) {
      const query = event.target.value.toLocaleLowerCase("es");
      document.querySelectorAll(".filter-row").forEach(row => row.hidden = !row.innerText.toLocaleLowerCase("es").includes(query));
    }
  });
  document.addEventListener("submit", event => {
    if (event.target.id === "ai-form") {
      event.preventDefault();
      const input = document.getElementById("ai-input");
      const question = input.value.trim();
      if (!question) return;
      const user = document.createElement("div");
      user.className = "ai-msg user";
      user.textContent = question;
      const chat = event.target.closest(".ai-chat");
      chat.insertBefore(user, event.target);
      const answer = document.createElement("div");
      answer.className = "ai-msg";
      answer.innerHTML = "<b>Respuesta de demostración.</b> Para responder con datos reales, SecureAI debe conectarse al servicio de Laravel y consultar únicamente información autorizada de esta organización.";
      chat.insertBefore(answer, event.target);
      input.value = "";
      chat.scrollTop = chat.scrollHeight;
    }
  });
  document.getElementById("menu-toggle").addEventListener("click", () => {
    sidebar.classList.toggle("open");
    scrim.classList.toggle("show");
  });
  scrim.addEventListener("click", () => {
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
  });
  window.addEventListener("hashchange", () => render(location.hash.slice(1)));
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.getElementById("global-search").focus();
    }
    if (event.key === "Escape") {
      sidebar.classList.remove("open");
      scrim.classList.remove("show");
    }
  });
  render(location.hash.slice(1) || "dashboard");
})();