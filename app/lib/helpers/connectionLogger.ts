type ConnectionMetadata = {
  url?: string;
  host?: string;
  port?: string | number;
  database?: string;
  method?: string;
  service?: string;
  status?: number;
  durationMs?: number;
  note?: string;
};

export const sanitizeUrl = (value?: string) => {
  if (!value) return value;
  try {
    const parsed = new URL(value);
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}`;
  } catch (_error) {
    return value;
  }
};

export const logConnection = (event: string, metadata: ConnectionMetadata = {}) => {
  const safeMetadata = { ...metadata };
  if (safeMetadata.url) {
    safeMetadata.url = sanitizeUrl(safeMetadata.url);
  }
  // eslint-disable-next-line no-console
  console.log(`[connection] ${event}`, safeMetadata);
};
