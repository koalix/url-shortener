// database.js
const mysql = require('mysql');
const { db } = require('./config');

const connection = mysql.createPool(db);

const saveShortUrl = (originalUrl, shortCode, callback) => {
  const sql = 'INSERT INTO links (original_url, short_code) VALUES (?, ?)';
  connection.query(sql, [originalUrl, shortCode], callback);
};

const getUrlByCode = (shortCode, callback) => {
  const sql = 'SELECT * FROM links WHERE short_code = ?';
  connection.query(sql, [shortCode], callback);
};

const incrementAccess = (shortCode, callback) => {
  const sql = 'UPDATE links SET accesses = accesses + 1 WHERE short_code = ?';
  connection.query(sql, [shortCode], callback);
};

module.exports = { saveShortUrl, getUrlByCode, incrementAccess };