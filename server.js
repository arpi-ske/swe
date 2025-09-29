const express = require('express');
const { connectDB } = require('./db');
const PORT = 3000;
categoriesRoutes = require('./routes/categories');
const app = express();

app.use(express.json());
app.use('/api/categories', categoriesRoutes);

(async () => {
    await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();

