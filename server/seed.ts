import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import type { AppData, CollectionName, EntityRecord } from "./types.js";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@mes.local";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

const now = () => new Date().toISOString();

const record = (data: Record<string, unknown>): EntityRecord => ({
  id: nanoid(10),
  createdAt: now(),
  updatedAt: now(),
  ...data
});

const emptyData = (): AppData =>
  ({
    users: [],
    clients: [],
    requests: [],
    quotes: [],
    projects: [],
    tasks: [],
    technicalFiles: [],
    workOrders: [],
    machines: [],
    inventory: [],
    inventoryMovements: [],
    suppliers: [],
    purchases: [],
    qualityInspections: [],
    deliveries: [],
    payments: [],
    costs: [],
    auditEvents: []
  }) satisfies Record<CollectionName, EntityRecord[]>;

export const createSeedData = (): AppData => {
  const data = emptyData();

  const admin = record({
    name: "Admin MES",
    email: ADMIN_EMAIL,
    role: "administrador",
    active: true,
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10)
  });
  const engineer = record({
    name: "Ingenieria",
    email: "ingenieria@mes.local",
    role: "ingenieria",
    active: true,
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10)
  });
  data.users.push(admin, engineer);

  const robo = record({
    code: "CLI-001",
    name: "RoboMinds",
    type: "Empresa",
    contact: "Ana Silva",
    email: "ana@robominds.test",
    phone: "+51 999 111 222",
    status: "Activo",
    notes: "Cliente recurrente de prototipos mecatronicos."
  });
  const electronix = record({
    code: "CLI-002",
    name: "ElectroniX",
    type: "Empresa",
    contact: "Luis Caceres",
    email: "luis@electronix.test",
    phone: "+51 999 333 444",
    status: "Activo",
    notes: "Prioriza entregas rapidas y documentacion tecnica."
  });
  const proto = record({
    code: "CLI-003",
    name: "ProtoLab",
    type: "Empresa",
    contact: "Maria Perez",
    email: "maria@protolab.test",
    phone: "+51 999 555 666",
    status: "Potencial",
    notes: "Solicitudes frecuentes de piezas impresas por lote."
  });
  data.clients.push(robo, electronix, proto);

  const request = record({
    code: "SOL-1001",
    clientId: robo.id,
    clientName: robo.name,
    type: "Proyecto mecatronico",
    description: "Brazo robotico educativo con carcasa impresa y control de servos.",
    priority: "Alta",
    targetDate: "2026-07-05",
    owner: "Ventas",
    status: "Listo para cotizar"
  });
  data.requests.push(request);

  const quote = record({
    code: "COT-2041",
    clientId: robo.id,
    clientName: robo.name,
    requestId: request.id,
    status: "Aprobada",
    currency: "USD",
    validUntil: "2026-06-30",
    deliveryEstimate: "18 dias",
    items: [
      { description: "Diseno mecanico y electronico", qty: 18, unitPrice: 35 },
      { description: "Impresion 3D y postproceso", qty: 1, unitPrice: 420 },
      { description: "Componentes y ensamble", qty: 1, unitPrice: 610 }
    ],
    totals: { subtotal: 1660, discount: 0, tax: 298.8, total: 1958.8 },
    estimatedCost: 1180,
    margin: 778.8
  });
  data.quotes.push(quote);

  const project = record({
    code: "PRY-3001",
    name: "Brazo robotico v2",
    clientId: robo.id,
    clientName: robo.name,
    quoteId: quote.id,
    owner: "Ingenieria",
    team: ["Ingenieria", "Produccion"],
    startDate: "2026-06-10",
    targetDate: "2026-07-05",
    budget: 1958.8,
    estimatedCost: 1180,
    realCost: 970,
    status: "En fabricacion",
    priority: "Alta",
    description: "Prototipo funcional con base impresa, servos y firmware de control.",
    deliverables: "Prototipo, firmware, guia de uso y video de prueba."
  });
  data.projects.push(project);

  data.tasks.push(
    record({
      projectId: project.id,
      projectName: project.name,
      title: "Validar torque de servos",
      owner: "Ingenieria",
      priority: "Alta",
      dueDate: "2026-06-18",
      status: "En progreso",
      hours: 2.5
    }),
    record({
      projectId: project.id,
      projectName: project.name,
      title: "Preparar archivo 3MF de carcasa",
      owner: "Produccion",
      priority: "Media",
      dueDate: "2026-06-16",
      status: "Pendiente",
      hours: 0
    })
  );

  data.technicalFiles.push(
    record({
      projectId: project.id,
      projectName: project.name,
      name: "carcasa_brazo_v2.step",
      version: 2,
      type: "STEP",
      status: "Aprobado para fabricar",
      uploadedBy: "Ingenieria",
      url: "",
      notes: "Version validada con separadores M3."
    }),
    record({
      projectId: project.id,
      projectName: project.name,
      name: "firmware_servo_test.ino",
      version: 1,
      type: "Firmware",
      status: "En revision",
      uploadedBy: "Ingenieria",
      url: "",
      notes: "Pendiente prueba continua."
    })
  );

  const printer = record({
    code: "MAQ-001",
    name: "Bambu Lab X1E",
    type: "Impresora 3D FDM",
    status: "Ocupada",
    location: "Taller 1",
    compatibleMaterials: "PLA, PETG, ABS, PA-CF",
    workArea: "256 x 256 x 256 mm",
    hourlyCost: 4.5,
    hours: 1260,
    nextMaintenance: "2026-07-01"
  });
  const resin = record({
    code: "MAQ-002",
    name: "Elegoo Saturn 3",
    type: "Impresora 3D resina",
    status: "Disponible",
    location: "Taller 1",
    compatibleMaterials: "Resina ABS-like, flexible",
    workArea: "218 x 123 x 250 mm",
    hourlyCost: 5.2,
    hours: 720,
    nextMaintenance: "2026-06-24"
  });
  const cnc = record({
    code: "MAQ-003",
    name: "HAAS Mini Mill",
    type: "CNC",
    status: "Mantenimiento",
    location: "Taller 2",
    compatibleMaterials: "Aluminio, acrilico, madera",
    workArea: "400 x 300 x 250 mm",
    hourlyCost: 24,
    hours: 2440,
    nextMaintenance: "2026-06-20"
  });
  data.machines.push(printer, resin, cnc);

  data.workOrders.push(
    record({
      code: "OT-1041",
      projectId: project.id,
      projectName: project.name,
      type: "Impresion 3D FDM",
      machineId: printer.id,
      machineName: printer.name,
      operator: "Produccion",
      material: "PLA Negro",
      quantity: 2,
      estimatedHours: 9,
      realHours: 5.5,
      estimatedConsumption: 420,
      realConsumption: 260,
      priority: "Alta",
      status: "En produccion",
      progress: 60
    }),
    record({
      code: "OT-1042",
      projectId: project.id,
      projectName: project.name,
      type: "Ensamble electronico",
      machineId: "",
      machineName: "Banco electronico",
      operator: "Ingenieria",
      material: "Arduino Nano, PCA9685",
      quantity: 1,
      estimatedHours: 4,
      realHours: 0,
      priority: "Media",
      status: "Pendiente",
      progress: 0
    })
  );

  data.inventory.push(
    record({
      code: "INV-001",
      name: "Filamento PLA Negro",
      category: "Filamentos",
      unit: "kg",
      stock: 2,
      reserved: 0.4,
      minimum: 5,
      unitCost: 22,
      supplier: "FilamentPro",
      location: "Almacen 1",
      status: "Stock bajo"
    }),
    record({
      code: "INV-002",
      name: "Resina ABS-Like Gris",
      category: "Resinas",
      unit: "L",
      stock: 1,
      reserved: 0,
      minimum: 3,
      unitCost: 38,
      supplier: "ResinLab",
      location: "Almacen 1",
      status: "Stock bajo"
    }),
    record({
      code: "INV-003",
      name: "Tornillo M3 x 12mm",
      category: "Tornilleria",
      unit: "pza",
      stock: 120,
      reserved: 30,
      minimum: 200,
      unitCost: 0.04,
      supplier: "FerrePro",
      location: "Almacen 2",
      status: "Stock bajo"
    })
  );

  data.suppliers.push(
    record({
      name: "FilamentPro",
      type: "Materiales 3D",
      contact: "Sofia Ramos",
      email: "ventas@filamentpro.test",
      phone: "+51 900 111 222",
      leadTimeDays: 3,
      paymentTerms: "Contado",
      quality: "Alta"
    }),
    record({
      name: "ElectroParts",
      type: "Electronica",
      contact: "Carlos Ruiz",
      email: "pedidos@electroparts.test",
      phone: "+51 900 333 444",
      leadTimeDays: 5,
      paymentTerms: "Credito 15 dias",
      quality: "Media"
    })
  );

  data.purchases.push(
    record({
      code: "COM-501",
      projectId: project.id,
      projectName: project.name,
      supplier: "ElectroParts",
      item: "Servos MG996R",
      quantity: 6,
      expectedDate: "2026-06-19",
      cost: 96,
      status: "En transito"
    })
  );

  data.qualityInspections.push(
    record({
      code: "CAL-701",
      projectId: project.id,
      projectName: project.name,
      workOrderId: "",
      checklist: ["Material correcto", "Dimensiones criticas", "Acabado superficial"],
      result: "Pendiente",
      defects: "",
      correctiveAction: "",
      inspector: "Calidad",
      status: "Pendiente"
    })
  );

  data.deliveries.push(
    record({
      code: "ENT-801",
      projectId: project.id,
      projectName: project.name,
      clientId: robo.id,
      clientName: robo.name,
      plannedDate: "2026-07-05",
      deliveredDate: "",
      items: "Prototipo completo y documentacion",
      status: "Pendiente",
      evidence: ""
    })
  );

  data.payments.push(
    record({
      code: "PAG-901",
      projectId: project.id,
      projectName: project.name,
      clientId: robo.id,
      clientName: robo.name,
      type: "Anticipo",
      amount: 780,
      dueDate: "2026-06-15",
      paidDate: "2026-06-12",
      status: "Pagado"
    }),
    record({
      code: "PAG-902",
      projectId: project.id,
      projectName: project.name,
      clientId: robo.id,
      clientName: robo.name,
      type: "Saldo",
      amount: 1178.8,
      dueDate: "2026-07-05",
      paidDate: "",
      status: "Pendiente"
    })
  );

  data.costs.push(
    record({
      projectId: project.id,
      projectName: project.name,
      category: "Materiales",
      estimated: 420,
      real: 310,
      notes: "PLA y componentes principales."
    }),
    record({
      projectId: project.id,
      projectName: project.name,
      category: "Horas ingenieria",
      estimated: 540,
      real: 460,
      notes: "Diseno y firmware."
    }),
    record({
      projectId: project.id,
      projectName: project.name,
      category: "Maquina",
      estimated: 220,
      real: 200,
      notes: "Impresion y pruebas."
    })
  );

  data.auditEvents.push(
    record({
      actor: "Sistema",
      action: "seed.created",
      entity: "workspace",
      detail: "Datos demo iniciales creados."
    })
  );

  return data;
};

export const ensureAdminCredentials = (data: AppData) => {
  const admin =
    data.users.find((user) => user.email === ADMIN_EMAIL) ??
    data.users.find((user) => user.email === "admin@mes.local") ??
    data.users.find((user) => user.role === "administrador");

  if (admin) {
    admin.name = "Admin MES";
    admin.email = ADMIN_EMAIL;
    admin.role = "administrador";
    admin.active = true;
    admin.passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
    admin.updatedAt = now();
    return;
  }

  data.users.push(
    record({
      name: "Admin MES",
      email: ADMIN_EMAIL,
      role: "administrador",
      active: true,
      passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10)
    })
  );
};
