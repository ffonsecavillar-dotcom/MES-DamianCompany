import { FileUp } from "lucide-react";
import type { Entity } from "../types";
import { StatusBadge } from "./StatusBadge";

type ProjectPanelProps = {
  project?: Entity;
  tasks: Entity[];
  files: Entity[];
  orders: Entity[];
  costs: Entity[];
  onApproveFile: (id: string) => Promise<void>;
  onUploadFile: (projectId: string, file: File) => Promise<void>;
};

const sum = (rows: Entity[], key: string) => rows.reduce((total, row) => total + Number(row[key] ?? 0), 0);

export function ProjectPanel({ project, tasks, files, orders, costs, onApproveFile, onUploadFile }: ProjectPanelProps) {
  if (!project) {
    return (
      <aside className="detail-panel">
        <h2>Detalle de proyecto</h2>
        <p>Selecciona un proyecto para ver tareas, archivos, ordenes y costos.</p>
      </aside>
    );
  }

  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const projectFiles = files.filter((file) => file.projectId === project.id);
  const projectOrders = orders.filter((order) => order.projectId === project.id);
  const projectCosts = costs.filter((cost) => cost.projectId === project.id);
  const estimated = sum(projectCosts, "estimated");
  const real = sum(projectCosts, "real");

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <div>
          <h2>{String(project.name)}</h2>
          <p>{String(project.clientName ?? "")}</p>
        </div>
        <StatusBadge value={project.status} />
      </div>
      <div className="detail-stats">
        <div><span>Tareas</span><strong>{projectTasks.length}</strong></div>
        <div><span>Ordenes</span><strong>{projectOrders.length}</strong></div>
        <div><span>Margen</span><strong>${(Number(project.budget ?? 0) - real).toFixed(0)}</strong></div>
      </div>
      <section>
        <h3>Archivos tecnicos</h3>
        <label className="upload-box">
          <FileUp size={18} />
          <span>Subir version</span>
          <input
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUploadFile(project.id, file);
            }}
          />
        </label>
        <div className="mini-list">
          {projectFiles.map((file) => (
            <div key={file.id}>
              <span>{String(file.name)} v{String(file.version)}</span>
              <button className="mini-action" onClick={() => onApproveFile(file.id)}>Aprobar</button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3>Costos</h3>
        <div className="cost-line"><span>Estimado</span><strong>${estimated.toFixed(2)}</strong></div>
        <div className="cost-line"><span>Real</span><strong>${real.toFixed(2)}</strong></div>
      </section>
    </aside>
  );
}
