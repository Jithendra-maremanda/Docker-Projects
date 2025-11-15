const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60*1000, max: 60 }));

app.get('/health', (req,res) => res.send('ok'));

app.get('/weather', async (req,res) =>{
  const city = (req.query.city||'').trim();
  if(!city) return res.status(400).json({ error: 'city required' });
  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
    const weather = await axios.get(url, { timeout: 5000 });
    db.query('INSERT INTO history(city) VALUES($1)', [city]).catch(()=>{});
    res.json(weather.data);
  }catch(e){
    res.status(502).json({ error: 'upstream error or city not found' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`Backend listening ${port}`));
