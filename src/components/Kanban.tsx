import type { Entity } from "../types";
import { StatusBadge } from "./StatusBadge";

type KanbanProps = {
  orders: Entity[];
  onMove: (id: string, status: string, progress: number) => Promise<void>;
};

const columns = ["Pendiente", "En cola", "En produccion", "En calidad", "Aprobado", "Fallido"];

export function Kanban({ orders, onMove }: KanbanProps) {
  return (
    <div className="kanban">
      {columns.map((column) => (
        <section className="kanban-column" key={column}>
          <h3>{column}</h3>
          {orders
            .filter((order) => String(order.status ?? "Pendiente") === column)
            .map((order) => (
              <article className="kanban-card" key={order.id}>
                <div className="kanban-title">
                  <strong>{String(order.code ?? order.type)}</strong>
                  <StatusBadge value={order.priority ?? "Media"} />
                </div>
                <p>{String(order.projectName ?? "")}</p>
                <span>{String(order.type)} · {String(order.machineName ?? "Sin maquina")}</span>
                <div className="progress">
                  <i style={{ width: `${Number(order.progress ?? 0)}%` }} />
                </div>
                <select
                  value={String(order.status ?? "Pendiente")}
                  onChange={(event) => onMove(order.id, event.target.value, event.target.value === "Aprobado" ? 100 : Number(order.progress ?? 0))}
                >
                  {columns.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </article>
            ))}
        </section>
      ))}
    </div>
  );
}
