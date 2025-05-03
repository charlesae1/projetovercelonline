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
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const isOnline = $('b:contains("Online")').hasClass('green');
      results.push({ name, status: isOnline ? 'Online' : 'Offline' });
    } catch (err) {
      results.push({ name, status: 'Erro' });
    }
  }

  res.json(results);
}