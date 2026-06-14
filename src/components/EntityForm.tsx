import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Entity, FieldConfig, ModuleConfig } from "../types";

type EntityFormProps = {
  config: ModuleConfig;
  initial?: Entity;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
};

const coerceValue = (field: FieldConfig, value: string) => {
  if (field.type === "number") return value === "" ? 0 : Number(value);
  if (field.type === "json") {
    try {
      return value.trim() ? JSON.parse(value) : field.key.endsWith("s") ? [] : {};
    } catch {
      throw new Error(`JSON invalido en ${field.label}`);
    }
  }
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

const valueForInput = (field: FieldConfig, value: unknown) => {
  if (field.type === "json") return JSON.stringify(value ?? (field.key.endsWith("s") ? [] : {}), null, 2);
  if (typeof value === "boolean") return String(value);
  return String(value ?? "");
};

export function EntityForm({ config, initial, onClose, onSubmit }: EntityFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((field) => [field.key, valueForInput(field, initial?.[field.key])]))
  );
  const [error, setError] = useState("");
  const title = useMemo(() => (initial ? `Editar ${config.title}` : `Nuevo registro`), [config.title, initial]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const payload = Object.fromEntries(config.fields.map((field) => [field.key, coerceValue(field, values[field.key] ?? "")]));
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={submit}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            <p>{config.description}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} title="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="form-grid">
          {config.fields.map((field) => (
            <label key={field.key} className={field.type === "textarea" || field.type === "json" ? "span-2" : ""}>
              <span>{field.label}</span>
              {field.type === "select" ? (
                <select
                  value={values[field.key] ?? ""}
                  required={field.required}
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                >
                  <option value="">Seleccionar</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" || field.type === "json" ? (
                <textarea
                  value={values[field.key] ?? ""}
                  required={field.required}
                  rows={field.type === "json" ? 6 : 3}
                  placeholder={field.placeholder}
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              ) : (
                <input
                  type={field.type ?? "text"}
                  value={values[field.key] ?? ""}
                  required={field.required}
                  placeholder={field.placeholder}
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              )}
            </label>
          ))}
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-actions">
          <button type="button" className="button ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button primary">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
