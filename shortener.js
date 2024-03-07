// shortener.js
const shortid = require('shortid');
const { saveShortUrl, getUrlByCode, incrementAccess } = require('./database');
const { baseUrl } = require('./config');

const createShortUrl = (req, res) => {
  const { originalUrl } = req.body;
  const shortCode = shortid.generate();
  saveShortUrl(originalUrl, shortCode, (error) => {
    if (error) return res.status(500).json({ error });
    res.json({ shortUrl: `${baseUrl}${shortCode}` });
  });
};

const redirectShortUrl = (req, res) => {
  const { code } = req.params;
  getUrlByCode(code, (error, results) => {
    if (error || results.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const { original_url } = results[0];
    incrementAccess(code, () => {});
    res.redirect(original_url);
  });
};

module.exports = { createShortUrl, redirectShortUrl };