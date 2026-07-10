export default async function handler(req, res) {
  // Open CORS so a locally-opened HTML file (file://) or any phone browser can call this.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { code, hours } = req.query;
  if (!code) {
    res.status(400).json({ success: false, message: 'Missing station code, e.g. ?code=NDLS' });
    return;
  }

  try {
    const { configure, liveAtStation } = await import('railkit');
    configure(process.env.RAILKIT_API_KEY);

    const windowHours = hours ? parseInt(hours, 10) : 2;
    const result = await liveAtStation(String(code).toUpperCase(), windowHours);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upstream RailKit error', detail: String(err) });
  }
}
