import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

app.use(cors({origin: 'http://localhost:5173'})); 
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to PollMap Server!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});