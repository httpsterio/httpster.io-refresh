const keys = (value) => {
  if (typeof value !== "object" || value === null) return String(value);
  return Object.keys(value).join(", ");
};

const shape = (value) => {
  if (typeof value !== "object" || value === null) return typeof value;
  const entries = Object.keys(value).map((k) => {
    const v = value[k];
    if (Array.isArray(v)) return `${k}: Array(${v.length})`;
    if (typeof v === "object" && v !== null) return `${k}: {...}`;
    return `${k}: ${typeof v}`;
  });
  return entries.join("\n");
};

const dateToISO = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
};

const dateToRfc822 = (date) => {
  return new Date(date).toUTCString();
};

export const filters = {
  keys,
  shape,
  dateToISO,
  dateToRfc822,
};
