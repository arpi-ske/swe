const express = require('express');
const { connectDB } = require('./db');
const PORT = 3000;
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);

(async () => {
    await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();

