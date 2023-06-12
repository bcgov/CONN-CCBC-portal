import * as cheerio from 'cheerio';

interface LinkPreview {
  title: string;
  description: string;
  image: string;
}

const handleImage = (og: string, twitter: string, hostname: string) => {
  // if canada.ca, return default preview image
  if (hostname.includes('canada.ca')) {
    return '/images/canadaPreview.png';
  }
  // prefer bc gov hosted images if possible
  if (og && twitter) {
    if (og.includes('gov.bc.ca')) {
      return og;
    }
    if (twitter.includes('gov.bc.ca')) {
      return twitter;
    }
    return og;
  }
  return og || twitter || '/images/noPreview.png';
};

async function getLinkPreview(
  url: string,
  allowedHostnames: string[]
): Promise<LinkPreview> {
  const urlObj = new URL(url);
  if (!allowedHostnames.includes(urlObj.hostname)) {
    return {
      title: null,
      description: 'No preview available',
      image: '/images/noPreview.png',
    };
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  const res = await fetch(`https://${urlObj.hostname}${urlObj.pathname}`, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  const html = await res.text();
  const $ = cheerio.load(html);
  const title =
    $('meta[property="og:title"]').attr('content') || $('title').text() || '';
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    $('meta[name="dcterms.description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    null;
  const image = handleImage(
    $('meta[property="og:image"]').attr('content'),
    $('meta[name="twitter:image"]').attr('content'),
    urlObj.hostname
  );
  return { title, description, image };
}

export default getLinkPreview;
