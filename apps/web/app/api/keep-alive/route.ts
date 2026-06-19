import { NextResponse } from 'next/server';

export async function GET() {
  const BACKEND_URLS = [
    'https://api-gateway-dv3e.onrender.com/',
    'https://api-gateway-dv3e.onrender.com/auth/health',
    'https://document-service-5r8h.onrender.com/'
  ];

  try {
    await Promise.all(
      BACKEND_URLS.map(url => 
        fetch(url, { method: 'GET', cache: 'no-store' })
          .then(res => console.log(`Pinged ${url}: ${res.status}`))
          .catch(err => console.error(`Failed to ping ${url}:`, err))
      )
    );

    return NextResponse.json({ success: true, message: 'All backend systems pinged.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ping execution anomaly encountered.' }, { status: 500 });
  }
}