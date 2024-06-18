const express = require('express');
const cors = require('cors');
const router = require('./routers/routes')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const authRoutes = require('../src/routers/authRoutes'); // Import the routes
const app = express();
const requestIp = require('request-ip');
app.use(requestIp.mw());
app.use(bodyParser.json({ limit: '50000000000000000000000mb' }))
app.use(bodyParser.urlencoded({extended:true , parameterLimit:100000000000000000000000000 , limit:"50000000000000000000mb"} ))
const PORT = 5001;
mongoose.connect('mongodb://localhost:27017/FileData')
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));
app.use(cors());
app.use(express.json());

app.use('/api', router);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
