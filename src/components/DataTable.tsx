import { Edit, Trash2 } from "lucide-react";
import type { Entity } from "../types";
import { StatusBadge } from "./StatusBadge";

type DataTableProps = {
  rows: Entity[];
  columns: string[];
  primaryKey: string;
  statusKey?: string;
  onEdit: (row: Entity) => void;
  onDelete: (row: Entity) => void;
  onSelect?: (row: Entity) => void;
};

const formatValue = (value: unknown) => {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "number") return Number.isInteger(value) ? value : value.toFixed(2);
  if (typeof value === "boolean") return value ? "Si" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export function DataTable({ rows, columns, primaryKey, statusKey, onEdit, onDelete, onSelect }: DataTableProps) {
  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th aria-label="acciones" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onSelect?.(row)}>
              {columns.map((column) => (
                <td key={column} className={column === primaryKey ? "cell-primary" : ""}>
                  {column === statusKey ? <StatusBadge value={row[column]} /> : formatValue(row[column])}
                </td>
              ))}
              <td className="row-actions" onClick={(event) => event.stopPropagation()}>
                <button className="icon-button" onClick={() => onEdit(row)} title="Editar">
                  <Edit size={16} />
                </button>
                <button className="icon-button danger" onClick={() => onDelete(row)} title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="empty-row" colSpan={columns.length + 1}>
                No hay registros para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
