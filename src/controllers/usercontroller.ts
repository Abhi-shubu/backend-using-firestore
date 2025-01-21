import { Request, Response } from 'express';
import firestore from '../config/firebase';
import { User } from '../models/users'; 
import { Timestamp } from 'firebase-admin/firestore';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    
    const newUser: User = {
      id: '',
      name,
      email,
      createdAt: Timestamp.fromDate(new Date()),
    };

    
    const userRef = await firestore.collection('users').add({
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });

    console.log('User added with ID:', userRef.id);

    
    res.status(201).json({
      message: 'User created successfully',
      data: { ...newUser, id: userRef.id },

    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUsers = async (req: Request, res: Response)=> {
  try {
    const snapshot = await firestore.collection('users').get();

    if (snapshot.empty) {
      res.status(404).json({ message: 'No users found' });
      return;
    }

    const users: any[] = []; 
    snapshot.forEach(doc => {
      const userData = doc.data() as User;

      
      let formattedDate = '';
      if (userData.createdAt) {
        formattedDate = userData.createdAt.toDate().toLocaleString(); 
      }

      
      users.push({ ...userData, id: doc.id, createdAt: formattedDate });
    });

    res.status(200).json({ message: 'Users fetched successfully', users: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response)=> {
  try {
    const { id } = req.params;

    const userDoc = firestore.collection('users').doc(id);
    const snapshot = await userDoc.get();

    if (!snapshot.exists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userData = snapshot.data() as User;
    res.status(200).json({ message: 'User fetched successfully', data: { ...userData ,id: snapshot.id } });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { name, email } = req.body; 

    if (!name && !email) {
      res.status(400).json({ message: 'At least one field (name or email) is required to update' });
      return;
    }

    const userDoc = firestore.collection('users').doc(id); 
    const snapshot = await userDoc.get(); 

    if (!snapshot.exists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedData: Partial<User> = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;

    await userDoc.update(updatedData); 

    res.status(200).json({
      message: 'User updated successfully',
      data: { id, ...updatedData },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
