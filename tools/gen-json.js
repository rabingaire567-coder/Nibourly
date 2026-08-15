/* Generates /data/*.json from the canonical data in js/data.js */
'use strict';
const fs = require('fs');
const path = require('path');
const NBData = require('../js/data.js');

const outDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = {
  'provinces.json': { provinces: NBData.provinceList },
  'districts.json': { districts: NBData.districts },
  'festivals.json': { festivals: NBData.festivals },
  'emergency.json': { emergency: NBData.emergency, hospitals: NBData.hospitals },
  'solutions.json': { solutions: NBData.solutions },
  'services.json': { categories: NBData.serviceCats, listings: NBData.sampleServices },
  'places.json': { places: NBData.places, foods: NBData.foods, languages: NBData.languages },
  'facts.json': { quickFacts: NBData.quickFacts, ticker: NBData.ticker }
};

Object.keys(files).forEach(name => {
  const p = path.join(outDir, name);
  fs.writeFileSync(p, JSON.stringify(files[name], null, 2), 'utf8');
  console.log('Wrote', name, '(' + fs.statSync(p).size + ' bytes)');
});
console.log('Done. JSON files:', Object.keys(files).length);
