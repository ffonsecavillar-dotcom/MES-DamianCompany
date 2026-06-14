import { AlertTriangle, Banknote, Boxes, Factory, Gauge, ListChecks } from "lucide-react";
import type { DashboardData } from "../types";
import { StatusBadge } from "./StatusBadge";

type DashboardProps = {
  data?: DashboardData;
  onOpenProduction: () => void;
};

const money = (value: number) => `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export function Dashboard({ data, onOpenProduction }: DashboardProps) {
  const metrics = data?.metrics ?? {};
  const cards = [
    { label: "Proyectos activos", value: metrics.activeProjects ?? 0, icon: Gauge },
    { label: "Ordenes abiertas", value: metrics.openOrders ?? 0, icon: Factory },
    { label: "Disponibilidad maquinas", value: `${metrics.machineAvailability ?? 0}%`, icon: ListChecks },
    { label: "Stock bajo", value: metrics.lowStock ?? 0, icon: Boxes },
    { label: "Pagos pendientes", value: money(metrics.pendingPayments ?? 0), icon: Banknote }
  ];

  return (
    <div className="dashboard-grid">
      <section className="metric-strip">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="metric-card" key={card.label}>
              <div className="metric-icon">
                <Icon size={18} />
              </div>
              <div>
                <p>{card.label}</p>
                <strong>{card.value}</strong>
              </div>
            </article>
          );
        })}
      </section>

      <section className="panel panel-large">
        <div className="panel-header">
          <div>
            <h2>Produccion activa</h2>
            <p>Ordenes que necesitan seguimiento del taller.</p>
          </div>
          <button className="button ghost" onClick={onOpenProduction}>
            Ver tablero
          </button>
        </div>
        <div className="compact-list">
          {data?.production.slice(0, 6).map((order) => (
            <div className="compact-row" key={order.id}>
              <div>
                <strong>{String(order.code ?? order.type)}</strong>
                <span>{String(order.projectName ?? "Sin proyecto")} · {String(order.machineName ?? "Sin maquina")}</span>
              </div>
              <StatusBadge value={order.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Rentabilidad</h2>
            <p>Costos estimados contra reales.</p>
          </div>
        </div>
        <div className="cost-bars">
          <div>
            <span>Estimado</span>
            <strong>{money(metrics.estimatedCost ?? 0)}</strong>
            <div className="bar"><i style={{ width: "78%" }} /></div>
          </div>
          <div>
            <span>Real</span>
            <strong>{money(metrics.realCost ?? 0)}</strong>
            <div className="bar accent"><i style={{ width: "64%" }} /></div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Maquinas</h2>
            <p>Estado operativo.</p>
          </div>
        </div>
        <div className="compact-list">
          {data?.machines.map((machine) => (
            <div className="compact-row" key={machine.id}>
              <div>
                <strong>{String(machine.name)}</strong>
                <span>{String(machine.type)} · {String(machine.location ?? "")}</span>
              </div>
              <StatusBadge value={machine.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Alertas</h2>
            <p>Stock y compras pendientes.</p>
          </div>
          <AlertTriangle size={18} />
        </div>
        <div className="compact-list">
          {data?.lowStockItems.slice(0, 4).map((item) => (
            <div className="compact-row" key={item.id}>
              <div>
                <strong>{String(item.name)}</strong>
                <span>Disponible: {Number(item.stock ?? 0) - Number(item.reserved ?? 0)} {String(item.unit ?? "")}</span>
              </div>
              <StatusBadge value="Stock bajo" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
