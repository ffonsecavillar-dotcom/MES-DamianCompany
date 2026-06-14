type StatusBadgeProps = {
  value: unknown;
};

const toneFor = (value: string) => {
  const normalized = value.toLowerCase();
  if (/(aprob|pagad|conforme|disponible|activo|complet|entregado)/.test(normalized)) return "success";
  if (/(produccion|progreso|revision|transito|cola|cotizando|enviada)/.test(normalized)) return "info";
  if (/(pendiente|borrador|reservada|pausado|stock bajo|mantenimiento|negociacion)/.test(normalized)) return "warning";
  if (/(rechaz|fallid|cancel|vencid|fuera|bloqueada)/.test(normalized)) return "danger";
  return "neutral";
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const text = String(value ?? "Sin estado");
  return <span className={`status status-${toneFor(text)}`}>{text}</span>;
}
