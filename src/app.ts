import express, { Application, Request, Response } from 'express';
import firestore from './config/firebase'; // Import the Firestore instance
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan'
import userRoutes from './routes/user';

const app: Application = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({ credentials: true }));

app.use('/user', userRoutes);


const checkFirestoreConnection = async () => {
  try {
    
    const collections = await firestore.listCollections();
    if (collections.length > 0) {
      console.log('Connected to Firestore successfully!');
    } else {
      console.log('Firestore is connected but no collections found.');
    }
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
};


checkFirestoreConnection();

const port: number =  5001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
