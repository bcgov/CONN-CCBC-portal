import reportClientError from './reportClientError';

export default function safeJsonParse(toParse: string) {
  try {
    if (toParse == null) {
      return {};
    }
    if (typeof toParse !== 'string') {
      return toParse;
    }
    if (toParse === '') {
      return {};
    }
    return JSON.parse(toParse);
  } catch (e) {
    reportClientError(e, { source: 'safe-json-parse' });
    return e;
  }
}
