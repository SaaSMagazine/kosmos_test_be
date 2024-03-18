require('dotenv').config();

const express = require('express');
const Sequelize = require('sequelize');

const authRoutes = require('./routes/auth_routes');
const taskRoutes = require('./routes/task_routes');

var cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Server started on port: ' + PORT));