import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPageRenderer } from 'vite-plugin-ssr';
import {
  getDefaultEmptyResponseHandler,
  getDefaultPageContextInit,
  getDefaultResponseHandler,
} from './helpers';

const renderPage = createPageRenderer({ isProduction: true });

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  console.debug('query', request.query);
  console.debug('url', request.url);
  console.debug('headers', request.headers);
  const pageContextInit = getDefaultPageContextInit(request);
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;

  if (!httpResponse) {
    return getDefaultEmptyResponseHandler(response);
  }

  return getDefaultResponseHandler(response, httpResponse);
}
