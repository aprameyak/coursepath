const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

const dataFile = path.join(__dirname, 'data.json');

const initData = () => {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ courses: [], outcomes: [] }));
  }
};

const readData = () => JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

app.post('/api/courses', (req, res) => {
  const { name, type, cost, duration } = req.body;
  const data = readData();
  data.courses.push({ id: Date.now(), name, type, cost: parseFloat(cost), duration, createdAt: new Date().toISOString() });
  writeData(data);
  res.json({ success: true, id: data.courses[data.courses.length - 1].id });
});

app.post('/api/outcomes', (req, res) => {
  const { courseId, employed, salary, graduated, duration } = req.body;
  const data = readData();
  data.outcomes.push({ id: Date.now(), courseId: parseInt(courseId), employed: employed === 'true', salary: parseInt(salary) || 0, graduated: new Date(graduated), duration: parseInt(duration), submittedAt: new Date().toISOString() });
  writeData(data);
  res.json({ success: true });
});

app.get('/api/courses', (req, res) => {
  const data = readData();
  const coursesWithStats = data.courses.map(c => {
    const courseOutcomes = data.outcomes.filter(o => o.courseId === c.id);
    const stats = courseOutcomes.length > 0 ? {
      totalReports: courseOutcomes.length,
      employmentRate: (courseOutcomes.filter(o => o.employed).length / courseOutcomes.length * 100).toFixed(1),
      medianSalary: courseOutcomes.filter(o => o.salary > 0).length > 0 ? courseOutcomes.filter(o => o.salary > 0).map(o => o.salary).sort((a, b) => a - b)[Math.floor(courseOutcomes.filter(o => o.salary > 0).length / 2)] : 0
    } : null;
    return { ...c, stats };
  });
  res.json({ courses: coursesWithStats });
});

app.get('/api/courses/:id', (req, res) => {
  const data = readData();
  const course = data.courses.find(c => c.id === parseInt(req.params.id));
  const outcomes = data.outcomes.filter(o => o.courseId === parseInt(req.params.id));
  res.json({ course, outcomes });
});

const PORT = 3003;
initData();
app.listen(PORT, () => console.log(`CoursePath API running on port ${PORT}`));
