import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import type { Task } from '../types';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG8naXWBPDUr977B6NK8JMFkztmn4CQdk",
  authDomain: "my-weekly-planner-85a34.firebaseapp.com",
  projectId: "my-weekly-planner-85a34",
  storageBucket: "my-weekly-planner-85a34.firebasestorage.app",
  messagingSenderId: "521034608847",
  appId: "1:521034608847:web:5817b1d338ecd32e1a87ba"
};

// Initialize Firebase and Firestore
let app;
let db;
let tasksCollectionRef;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    tasksCollectionRef = collection(db, 'tasks');
} catch (e) {
    console.error("Firebase initialization failed. Please check your configuration.", e);
}


// Helper to convert a Firestore document to a Task object
const docToTask = (doc: QueryDocumentSnapshot<DocumentData>): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    week: data.week,
    name: data.name,
    completed: data.completed,
    priority: data.priority,
    notes: data.notes,
  } as Task;
};


export const firebaseService = {
  getTasksForWeek: async (week: number): Promise<Task[]> => {
    if (!db) return [];
    const q = query(tasksCollectionRef, where('week', '==', week));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToTask);
  },


  getAllTasks: async (): Promise<Task[]> => {
    if (!db) return [];
    const querySnapshot = await getDocs(tasksCollectionRef);
    return querySnapshot.docs.map(docToTask);
  },


  addTask: async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    if (!db) throw new Error("Firebase is not initialized. Cannot add task.");
    const docRef = await addDoc(tasksCollectionRef, taskData);
    return {
      id: docRef.id,
      ...taskData,
    };
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    if (!db) throw new Error("Firebase is not initialized. Cannot update task.");
    const taskDoc = doc(db, 'tasks', id);
    await updateDoc(taskDoc, updates);
    // Note: For simplicity, we're not refetching the document.
    return { id, ...updates } as Task;
  },

  deleteTask: async (id: string): Promise<void> => {
    if (!db) throw new Error("Firebase is not initialized. Cannot delete task.");
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
  },
};
