import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Boxes,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  Plus,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  Users,
  Wrench
} from "lucide-react";
import { api, clearToken, setToken } from "./api";
import { moduleConfigs, modulesByKey } from "./moduleConfig";
import type { CollectionName, DashboardData, Entity, ModuleConfig, User } from "./types";
import { Dashboard } from "./components/Dashboard";
import { DataTable } from "./components/DataTable";
import { EntityForm } from "./components/EntityForm";
import { Kanban } from "./components/Kanban";
import { ProjectPanel } from "./components/ProjectPanel";
import { StatusBadge } from "./components/StatusBadge";

type ViewKey = "dashboard" | "production" | CollectionName;

const navItems: Array<{ key: ViewKey; label: string; icon: React.ElementType }> = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "clients", label: "Clientes", icon: Users },
  { key: "requests", label: "Solicitudes", icon: ClipboardList },
  { key: "quotes", label: "Cotizaciones", icon: Receipt },
  { key: "projects", label: "Proyectos", icon: Gauge },
  { key: "production", label: "Produccion", icon: Factory },
  { key: "workOrders", label: "Ordenes", icon: ClipboardCheck },
  { key: "technicalFiles", label: "Archivos", icon: FileText },
  { key: "machines", label: "Maquinas", icon: Wrench },
  { key: "inventory", label: "Inventario", icon: Boxes },
  { key: "purchases", label: "Compras", icon: ShoppingCart },
  { key: "qualityInspections", label: "Calidad", icon: PackageCheck },
  { key: "payments", label: "Pagos", icon: Receipt },
  { key: "users", label: "Usuarios", icon: Settings }
];

const defaultRecord = (config: ModuleConfig) =>
  Object.fromEntries(
    config.fields.map((field) => {
      if (field.type === "number") return [field.key, 0];
      if (field.type === "json") return [field.key, field.key.endsWith("s") ? [] : {}];
      return [field.key, field.options?.[0] ?? ""];
    })
  );

function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("admin@mes.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const result = await api.login(email, password);
      setToken(result.token);
      onLogin(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesion");
    }
  };

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <div className="brand-mark">MES</div>
        <h1>Control operativo para fabricacion digital</h1>
        <p>Ingresa al MVP para gestionar solicitudes, proyectos, produccion, inventario y rentabilidad.</p>
        <label>
          <span>Correo</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          <span>Contrasena</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="button primary full" type="submit">
          Entrar al sistema
        </button>
        <small>Demo: admin@mes.local / admin123</small>
      </form>
    </main>
  );
}

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>("dashboard");
  const [records, setRecords] = useState<Partial<Record<CollectionName, Entity[]>>>({});
  const [dashboard, setDashboard] = useState<DashboardData>();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{ config: ModuleConfig; row?: Entity } | null>(null);
  const [selectedProject, setSelectedProject] = useState<Entity | undefined>();
  const [toast, setToast] = useState("");

  const loadCollection = useCallback(async (collection: CollectionName) => {
    const rows = await api.list(collection);
    setRecords((current) => ({ ...current, [collection]: rows }));
    return rows;
  }, []);

  const refreshDashboard = useCallback(async () => {
    setDashboard(await api.dashboard());
  }, []);

  const loadEssential = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        refreshDashboard(),
        ...moduleConfigs.map((config) => loadCollection(config.key)),
        loadCollection("workOrders"),
        loadCollection("technicalFiles"),
        loadCollection("tasks"),
        loadCollection("costs")
      ]);
    } finally {
      setLoading(false);
    }
  }, [loadCollection, refreshDashboard]);

  useEffect(() => {
    void api.me().then((result) => setUser(result.user)).catch(() => clearToken());
  }, []);

  useEffect(() => {
    if (user) void loadEssential();
  }, [loadEssential, user]);

  const activeConfig = activeView !== "dashboard" && activeView !== "production" ? modulesByKey[activeView] : undefined;
  const activeRows = useMemo(() => {
    if (!activeConfig) return [];
    const rows = records[activeConfig.key] ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(needle));
  }, [activeConfig, query, records]);

  const saveRecord = async (config: ModuleConfig, row: Record<string, unknown>, id?: string) => {
    const payload = { ...defaultRecord(config), ...row };
    if (id) await api.update(config.key, id, payload);
    else await api.create(config.key, payload);
    await loadCollection(config.key);
    await refreshDashboard();
    setToast("Registro guardado");
  };

  const deleteRecord = async (config: ModuleConfig, row: Entity) => {
    if (!window.confirm("Eliminar este registro?")) return;
    await api.remove(config.key, row.id);
    await loadCollection(config.key);
    await refreshDashboard();
    setToast("Registro eliminado");
  };

  const convertRequest = async (row: Entity) => {
    await api.convertRequestToQuote(row.id);
    await Promise.all([loadCollection("requests"), loadCollection("quotes"), refreshDashboard()]);
    setToast("Solicitud convertida en cotizacion");
  };

  const convertQuote = async (row: Entity) => {
    await api.convertQuoteToProject(row.id, `Proyecto ${String(row.clientName ?? "")}`);
    await Promise.all([loadCollection("quotes"), loadCollection("projects"), refreshDashboard()]);
    setToast("Cotizacion convertida en proyecto");
  };

  const approveFile = async (id: string) => {
    await api.approveFile(id);
    await loadCollection("technicalFiles");
    setToast("Archivo aprobado para fabricar");
  };

  const uploadFile = async (projectId: string, file: File) => {
    await api.uploadFile(projectId, file);
    await loadCollection("technicalFiles");
    setToast("Nueva version cargada");
  };

  const moveOrder = async (id: string, status: string, progress: number) => {
    await api.moveWorkOrder(id, status, progress);
    await Promise.all([loadCollection("workOrders"), refreshDashboard()]);
    setToast("Orden actualizada");
  };

  if (!user) return <Login onLogin={setUser} />;

  const projectPanel =
    activeView === "projects" ? (
      <ProjectPanel
        project={selectedProject}
        tasks={records.tasks ?? []}
        files={records.technicalFiles ?? []}
        orders={records.workOrders ?? []}
        costs={records.costs ?? []}
        onApproveFile={approveFile}
        onUploadFile={uploadFile}
      />
    ) : null;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">MES</div>
          <div>
            <strong>MES Operativo</strong>
            <span>Fabricacion digital</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={activeView === item.key ? "active" : ""}
                onClick={() => {
                  setActiveView(item.key);
                  setQuery("");
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="search-box">
            <Search size={18} />
            <input placeholder="Buscar en el modulo actual..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="user-chip">
            <span>{user.name}</span>
            <StatusBadge value={user.role} />
            <button
              className="icon-button"
              title="Salir"
              onClick={() => {
                clearToken();
                setUser(null);
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <section className="content">
          {activeView === "dashboard" && <Dashboard data={dashboard} onOpenProduction={() => setActiveView("production")} />}

          {activeView === "production" && (
            <div className="module-view">
              <div className="module-header">
                <div>
                  <h1>Produccion</h1>
                  <p>Kanban operativo para mover ordenes por estado.</p>
                </div>
              </div>
              <Kanban orders={records.workOrders ?? []} onMove={moveOrder} />
            </div>
          )}

          {activeConfig && (
            <div className={projectPanel ? "split-view" : "module-view"}>
              <div className="module-main">
                <div className="module-header">
                  <div>
                    <h1>{activeConfig.title}</h1>
                    <p>{activeConfig.description}</p>
                  </div>
                  <div className="header-actions">
                    {activeConfig.key === "requests" && (
                      <span className="hint">Selecciona una fila para convertirla a cotizacion.</span>
                    )}
                    {activeConfig.key === "quotes" && <span className="hint">PDF: abre /api/quotes/:id/pdf con sesion activa.</span>}
                    <button className="button primary" onClick={() => setEditing({ config: activeConfig })}>
                      <Plus size={16} />
                      Nuevo
                    </button>
                  </div>
                </div>

                {activeConfig.key === "technicalFiles" && (
                  <div className="action-note">
                    Aprueba un archivo desde el panel de proyecto para marcarlo como listo para fabricacion y volver obsoleta la version anterior aprobada.
                  </div>
                )}

                <DataTable
                  rows={activeRows}
                  columns={activeConfig.columns}
                  primaryKey={activeConfig.primary}
                  statusKey={activeConfig.statusKey}
                  onEdit={(row) => setEditing({ config: activeConfig, row })}
                  onDelete={(row) => void deleteRecord(activeConfig, row)}
                  onSelect={(row) => {
                    if (activeConfig.key === "projects") setSelectedProject(row);
                    if (activeConfig.key === "requests") void convertRequest(row);
                    if (activeConfig.key === "quotes") void convertQuote(row);
                  }}
                />
              </div>
              {projectPanel}
            </div>
          )}
        </section>
        {loading && <div className="loading">Actualizando datos...</div>}
        {toast && (
          <button className="toast" onClick={() => setToast("")}>
            {toast}
          </button>
        )}
      </main>

      {editing && (
        <EntityForm
          config={editing.config}
          initial={editing.row}
          onClose={() => setEditing(null)}
          onSubmit={(data) => saveRecord(editing.config, data, editing.row?.id)}
        />
      )}
    </div>
  );
}
