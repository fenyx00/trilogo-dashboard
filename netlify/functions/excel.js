// Netlify Function — busca o Excel do OneDrive server-side (sem CORS)
exports.handler = async function(event, context) {
  const ONEDRIVE_API = 'https://api.onedrive.com/v1.0/shares/u!aHR0cHM6Ly8xZHJ2Lm1zL3gvYy9mMzA5MjAxM2U3ZWU0ZDg5L0lRQ1hDWTliT1RsT1FyeG0tN2EzUVViUkFiOGVIUERwSWM0YXJZYUt1T0pSdC1BP2U9ODlmZG12/root/content';
  const SHARE_DIRECT  = 'https://1drv.ms/x/c/f3092013e7ee4d89/IQCXCY9bOTlOQrxm-7a3QUbRAb8eHPDpIc4arYaKuOJRt-A?e=89fdmv&download=1';

  const headers = {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  };

  // Tentativa 1: OneDrive Consumer API
  try {
    const r = await fetch(ONEDRIVE_API, { redirect: 'follow' });
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > 1000) {
        return { statusCode: 200, headers, body: buf.toString('base64'), isBase64Encoded: true };
      }
    }
  } catch(e1) {
    console.log('OneDrive API falhou:', e1.message);
  }

  // Tentativa 2: link direto de download
  try {
    const r = await fetch(SHARE_DIRECT, { redirect: 'follow' });
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > 1000) {
        return { statusCode: 200, headers, body: buf.toString('base64'), isBase64Encoded: true };
      }
    }
  } catch(e2) {
    console.log('Download direto falhou:', e2.message);
  }

  return {
    statusCode: 502,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Não foi possível buscar o arquivo do OneDrive.' }),
  };
};
