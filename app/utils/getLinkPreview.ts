import * as cheerio from 'cheerio';

interface LinkPreview {
  title: string;
  description: string;
  image: string;
}

const handleImage = (og: string, twitter: string) => {
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
      title: 'No preview available',
      description: 'No preview available',
      image: '/images/noPreview.png',
    };
  }
  const res = await fetch(urlObj.toString());
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
    $('meta[name="twitter:image"]').attr('content')
  );
  return { title, description, image };
}

export default getLinkPreview;
