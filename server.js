import express from 'express';
import cors from 'cors';
import db from './db/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 全路線の取得
app.get('/api/routes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM routes ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '内部サーバーエラー' });
  }
});

// 特定の路線の時刻表を取得
app.get('/api/schedules/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    const result = await db.query(
      `SELECT s.hour, s.minutes, st.name as schedule_type
       FROM schedules s
       JOIN schedule_types st ON s.schedule_type_id = st.id
       WHERE s.route_id = $1
       ORDER BY st.name, s.hour`,
      [routeId]
    );
    
    // 時刻表データを整形
    const schedules = result.rows.reduce((acc, row) => {
      if (!acc[row.schedule_type]) {
        acc[row.schedule_type] = [];
      }
      acc[row.schedule_type].push({
        hour: row.hour,
        minutes: row.minutes
      });
      return acc;
    }, {});
    
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '内部サーバーエラー' });
  }
});

// 祝日リストの取得
app.get('/api/holidays', async (req, res) => {
  try {
    const result = await db.query('SELECT date FROM holidays ORDER BY date');
    res.json(result.rows.map(row => row.date));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '内部サーバーエラー' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
