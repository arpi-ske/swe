const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./db');
const PORT = 3000;
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/user");
const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');
const appRoutes = require('./routes/app');
const brandsRoutes = require('./routes/brand');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);
app.use('/api', appRoutes)
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/brand', brandsRoutes);

app.use('/api/products', productsRoutes); 

app.use(errorHandler);

(async () => {
    await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();

