import 'dotenv/config'
import express from 'express';
import cors from 'cors';

import generateRoutes from './routes/generateRoutes.js'; 


const app = express();

// Middleware
app.use(cors());
// Base64 image payload er jonno limit barano holo
app.use(express.json({ limit: '10mb' })); 

// Routes
app.use('/api', generateRoutes);
app.get('/',(req,res)=>{
    res.status(200).json({
        status: 'ok' ,
        message:'done   backed  run   somthly'
    })
})
// Health Check (Postman e test korar jonno)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'AirUI Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});