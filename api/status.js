import cheerio from 'cheerio';
import axios from 'axios';

export default async function handler(req, res) {
  const { players } = req.query;
  if (!players) return res.status(400).json({ error: 'Missing players' });

  const names = players.split(',');
  const results = [];

  for (const name of names) {
    try {
      const url = `https://rubinot.com.br/?subtopic=characters&name=${encodeURIComponent(name)}`;
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept-Language': 'pt-BR,pt;q=0.9',
        },
      });
      const $ = cheerio.load(data);
      const onlineTag = $('td:contains("Status:")').next('td').text().trim();
      const isOnline = onlineTag.toLowerCase() === 'online';
      results.push({ name, status: isOnline ? 'Online' : 'Offline' });
    } catch (err) {
      results.push({ name, status: 'Erro', detalhe: err.message });
    }
  }

  res.json(results);
}
