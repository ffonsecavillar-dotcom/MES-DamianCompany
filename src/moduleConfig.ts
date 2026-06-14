import type { ModuleConfig } from "./types";

const status = {
  request: ["Nuevo", "En revision", "Falta informacion", "Listo para cotizar", "Cotizado", "Rechazado", "Convertido en proyecto"],
  quote: ["Borrador", "En revision interna", "Enviada", "En negociacion", "Aprobada", "Rechazada", "Vencida", "Convertida en proyecto"],
  project: ["Pendiente", "En diseno", "En validacion", "En compra de materiales", "En fabricacion", "En ensamble", "En pruebas", "En correccion", "Listo para entrega", "Entregado", "Cerrado", "Pausado", "Cancelado"],
  work: ["Pendiente", "Por programar", "En cola", "Preparando", "En produccion", "Pausado", "Fallido", "Terminado", "En postproceso", "En calidad", "Aprobado", "Rechazado", "Cancelado"],
  task: ["Pendiente", "En progreso", "Bloqueada", "En revision", "Completada", "Cancelada"],
  machine: ["Disponible", "Ocupada", "En mantenimiento", "Fuera de servicio", "Reservada"],
  file: ["En revision", "Aprobado para cotizar", "Aprobado para fabricar", "Obsoleto", "Rechazado"],
  finance: ["Pendiente", "Pagado", "Vencido", "Pago parcial", "Facturado parcial", "Facturado completo"],
  purchase: ["Solicitada", "Cotizando", "Aprobada", "Comprada", "En transito", "Recibida parcial", "Recibida completa", "Cancelada"],
  quality: ["Pendiente", "En inspeccion", "Aprobado", "Rechazado", "Aprobado con observaciones", "En retrabajo"]
};

export const moduleConfigs: ModuleConfig[] = [
  {
    key: "clients",
    title: "Clientes",
    description: "Empresas, contactos e historial comercial.",
    primary: "name",
    statusKey: "status",
    columns: ["code", "name", "contact", "email", "phone", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "name", label: "Nombre", required: true },
      { key: "type", label: "Tipo", type: "select", options: ["Persona", "Empresa", "Institucion"] },
      { key: "contact", label: "Contacto" },
      { key: "email", label: "Correo" },
      { key: "phone", label: "Telefono" },
      { key: "status", label: "Estado", type: "select", options: ["Activo", "Inactivo", "Potencial"], required: true },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  {
    key: "requests",
    title: "Solicitudes",
    description: "Necesidades iniciales listas para evaluar o cotizar.",
    primary: "description",
    statusKey: "status",
    columns: ["code", "clientName", "type", "priority", "targetDate", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "clientId", label: "ID cliente" },
      { key: "clientName", label: "Cliente", required: true },
      { key: "type", label: "Tipo" },
      { key: "description", label: "Descripcion", type: "textarea", required: true },
      { key: "priority", label: "Prioridad", type: "select", options: ["Baja", "Media", "Alta", "Urgente"] },
      { key: "targetDate", label: "Fecha objetivo", type: "date" },
      { key: "owner", label: "Responsable" },
      { key: "status", label: "Estado", type: "select", options: status.request, required: true }
    ]
  },
  {
    key: "quotes",
    title: "Cotizaciones",
    description: "Presupuestos versionables, costos estimados y aprobacion.",
    primary: "code",
    statusKey: "status",
    columns: ["code", "clientName", "status", "currency", "estimatedCost", "margin"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "clientId", label: "ID cliente" },
      { key: "clientName", label: "Cliente", required: true },
      { key: "status", label: "Estado", type: "select", options: status.quote, required: true },
      { key: "currency", label: "Moneda" },
      { key: "validUntil", label: "Validez", type: "date" },
      { key: "deliveryEstimate", label: "Entrega estimada" },
      { key: "items", label: "Items JSON", type: "json" },
      { key: "totals", label: "Totales JSON", type: "json" },
      { key: "estimatedCost", label: "Costo estimado", type: "number" },
      { key: "margin", label: "Margen", type: "number" }
    ]
  },
  {
    key: "projects",
    title: "Proyectos",
    description: "Centro tecnico, operativo y economico de cada trabajo aprobado.",
    primary: "name",
    statusKey: "status",
    columns: ["code", "name", "clientName", "owner", "targetDate", "budget", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "name", label: "Nombre", required: true },
      { key: "clientId", label: "ID cliente" },
      { key: "clientName", label: "Cliente", required: true },
      { key: "owner", label: "Responsable" },
      { key: "startDate", label: "Inicio", type: "date" },
      { key: "targetDate", label: "Fecha objetivo", type: "date" },
      { key: "budget", label: "Presupuesto", type: "number" },
      { key: "estimatedCost", label: "Costo estimado", type: "number" },
      { key: "realCost", label: "Costo real", type: "number" },
      { key: "priority", label: "Prioridad", type: "select", options: ["Baja", "Media", "Alta", "Urgente"] },
      { key: "status", label: "Estado", type: "select", options: status.project, required: true },
      { key: "description", label: "Descripcion tecnica", type: "textarea" },
      { key: "deliverables", label: "Entregables", type: "textarea" }
    ]
  },
  {
    key: "tasks",
    title: "Tareas",
    description: "Trabajo diario por proyecto, responsable y fecha limite.",
    primary: "title",
    statusKey: "status",
    columns: ["projectName", "title", "owner", "priority", "dueDate", "hours", "status"],
    fields: [
      { key: "projectId", label: "ID proyecto" },
      { key: "projectName", label: "Proyecto", required: true },
      { key: "title", label: "Tarea", required: true },
      { key: "owner", label: "Responsable" },
      { key: "priority", label: "Prioridad", type: "select", options: ["Baja", "Media", "Alta", "Urgente"] },
      { key: "dueDate", label: "Fecha limite", type: "date" },
      { key: "hours", label: "Horas", type: "number" },
      { key: "status", label: "Estado", type: "select", options: status.task, required: true }
    ]
  },
  {
    key: "technicalFiles",
    title: "Archivos",
    description: "Versiones, aprobaciones y trazabilidad tecnica.",
    primary: "name",
    statusKey: "status",
    columns: ["projectName", "name", "version", "type", "uploadedBy", "status"],
    fields: [
      { key: "projectId", label: "ID proyecto" },
      { key: "projectName", label: "Proyecto", required: true },
      { key: "name", label: "Archivo", required: true },
      { key: "version", label: "Version", type: "number" },
      { key: "type", label: "Tipo" },
      { key: "uploadedBy", label: "Subido por" },
      { key: "url", label: "URL" },
      { key: "status", label: "Estado", type: "select", options: status.file, required: true },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  {
    key: "workOrders",
    title: "Ordenes",
    description: "Fabricacion, ensamble, pruebas y postproceso.",
    primary: "code",
    statusKey: "status",
    columns: ["code", "projectName", "type", "machineName", "operator", "realHours", "priority", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "projectId", label: "ID proyecto" },
      { key: "projectName", label: "Proyecto", required: true },
      { key: "type", label: "Tipo", required: true },
      { key: "machineId", label: "ID maquina" },
      { key: "machineName", label: "Maquina" },
      { key: "operator", label: "Operador" },
      { key: "material", label: "Material" },
      { key: "quantity", label: "Cantidad", type: "number" },
      { key: "estimatedHours", label: "Horas estimadas", type: "number" },
      { key: "realHours", label: "Horas reales", type: "number" },
      { key: "priority", label: "Prioridad", type: "select", options: ["Baja", "Media", "Alta", "Urgente"] },
      { key: "progress", label: "Avance %", type: "number" },
      { key: "status", label: "Estado", type: "select", options: status.work, required: true }
    ]
  },
  {
    key: "machines",
    title: "Maquinas",
    description: "Disponibilidad, costo horario y mantenimiento.",
    primary: "name",
    statusKey: "status",
    columns: ["code", "name", "type", "location", "hourlyCost", "hours", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "name", label: "Nombre", required: true },
      { key: "type", label: "Tipo", required: true },
      { key: "status", label: "Estado", type: "select", options: status.machine, required: true },
      { key: "location", label: "Ubicacion" },
      { key: "compatibleMaterials", label: "Materiales compatibles" },
      { key: "workArea", label: "Area/volumen" },
      { key: "hourlyCost", label: "Costo/hora", type: "number" },
      { key: "hours", label: "Horas acumuladas", type: "number" },
      { key: "nextMaintenance", label: "Proximo mantenimiento", type: "date" }
    ]
  },
  {
    key: "inventory",
    title: "Inventario",
    description: "Materiales, componentes, stock y reservas.",
    primary: "name",
    statusKey: "status",
    columns: ["code", "name", "category", "stock", "reserved", "minimum", "location", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "name", label: "Nombre", required: true },
      { key: "category", label: "Categoria", required: true },
      { key: "unit", label: "Unidad", required: true },
      { key: "stock", label: "Stock", type: "number", required: true },
      { key: "reserved", label: "Reservado", type: "number" },
      { key: "minimum", label: "Minimo", type: "number", required: true },
      { key: "unitCost", label: "Costo unitario", type: "number" },
      { key: "supplier", label: "Proveedor" },
      { key: "location", label: "Ubicacion" },
      { key: "status", label: "Estado" }
    ]
  },
  {
    key: "suppliers",
    title: "Proveedores",
    description: "Contactos, tiempos de entrega y calidad historica.",
    primary: "name",
    columns: ["name", "type", "contact", "email", "leadTimeDays", "quality"],
    fields: [
      { key: "name", label: "Nombre", required: true },
      { key: "type", label: "Tipo" },
      { key: "contact", label: "Contacto" },
      { key: "email", label: "Correo" },
      { key: "phone", label: "Telefono" },
      { key: "leadTimeDays", label: "Entrega promedio dias", type: "number" },
      { key: "paymentTerms", label: "Condiciones de pago" },
      { key: "quality", label: "Calidad", type: "select", options: ["Alta", "Media", "Baja"] }
    ]
  },
  {
    key: "purchases",
    title: "Compras",
    description: "Solicitudes, pedidos y recepcion de materiales.",
    primary: "item",
    statusKey: "status",
    columns: ["code", "projectName", "supplier", "item", "quantity", "expectedDate", "cost", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "projectId", label: "ID proyecto" },
      { key: "projectName", label: "Proyecto" },
      { key: "supplier", label: "Proveedor", required: true },
      { key: "item", label: "Item", required: true },
      { key: "quantity", label: "Cantidad", type: "number" },
      { key: "expectedDate", label: "Fecha esperada", type: "date" },
      { key: "cost", label: "Costo", type: "number" },
      { key: "status", label: "Estado", type: "select", options: status.purchase, required: true }
    ]
  },
  {
    key: "qualityInspections",
    title: "Calidad",
    description: "Inspecciones, defectos, evidencias y retrabajos.",
    primary: "code",
    statusKey: "status",
    columns: ["code", "projectName", "inspector", "result", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "projectId", label: "ID proyecto" },
      { key: "projectName", label: "Proyecto", required: true },
      { key: "workOrderId", label: "ID orden" },
      { key: "checklist", label: "Checklist JSON", type: "json" },
      { key: "result", label: "Resultado" },
      { key: "defects", label: "Defectos", type: "textarea" },
      { key: "correctiveAction", label: "Accion correctiva", type: "textarea" },
      { key: "inspector", label: "Inspector" },
      { key: "status", label: "Estado", type: "select", options: status.quality, required: true }
    ]
  },
  {
    key: "deliveries",
    title: "Entregas",
    description: "Entregas parciales/completas y conformidad.",
    primary: "code",
    statusKey: "status",
    columns: ["code", "projectName", "clientName", "plannedDate", "deliveredDate", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "projectId", label: "ID proyecto" },
      { key: "projectName", label: "Proyecto", required: true },
      { key: "clientId", label: "ID cliente" },
      { key: "clientName", label: "Cliente", required: true },
      { key: "plannedDate", label: "Fecha programada", type: "date" },
      { key: "deliveredDate", label: "Fecha real", type: "date" },
      { key: "items", label: "Items", type: "textarea" },
      { key: "evidence", label: "Evidencia" },
      { key: "status", label: "Estado", type: "select", options: ["Pendiente", "Entregado parcial", "Entregado completo", "Conforme"], required: true }
    ]
  },
  {
    key: "payments",
    title: "Pagos",
    description: "Anticipos, saldos, vencimientos y estado financiero.",
    primary: "code",
    statusKey: "status",
    columns: ["code", "projectName", "clientName", "type", "amount", "dueDate", "paidDate", "status"],
    fields: [
      { key: "code", label: "Codigo" },
      { key: "projectId", label: "ID proyecto" },
      { key: "projectName", label: "Proyecto", required: true },
      { key: "clientId", label: "ID cliente" },
      { key: "clientName", label: "Cliente", required: true },
      { key: "type", label: "Tipo", type: "select", options: ["Anticipo", "Saldo", "Pago parcial", "Factura interna"] },
      { key: "amount", label: "Monto", type: "number", required: true },
      { key: "dueDate", label: "Vence", type: "date" },
      { key: "paidDate", label: "Pagado", type: "date" },
      { key: "status", label: "Estado", type: "select", options: status.finance, required: true }
    ]
  },
  {
    key: "costs",
    title: "Costos",
    description: "Estimado vs real para medir rentabilidad.",
    primary: "category",
    columns: ["projectName", "category", "estimated", "real", "notes"],
    fields: [
      { key: "projectId", label: "ID proyecto" },
      { key: "projectName", label: "Proyecto", required: true },
      { key: "category", label: "Categoria", required: true },
      { key: "estimated", label: "Estimado", type: "number", required: true },
      { key: "real", label: "Real", type: "number", required: true },
      { key: "notes", label: "Notas", type: "textarea" }
    ]
  },
  {
    key: "users",
    title: "Usuarios",
    description: "Accesos y roles basicos.",
    primary: "name",
    statusKey: "role",
    columns: ["name", "email", "role", "active"],
    fields: [
      { key: "name", label: "Nombre", required: true },
      { key: "email", label: "Correo", required: true },
      { key: "role", label: "Rol", type: "select", options: ["administrador", "ventas", "ingenieria", "produccion", "compras", "finanzas"], required: true },
      { key: "password", label: "Contrasena" },
      { key: "active", label: "Activo", type: "select", options: ["true", "false"] }
    ]
  }
];

export const modulesByKey = Object.fromEntries(moduleConfigs.map((item) => [item.key, item]));
