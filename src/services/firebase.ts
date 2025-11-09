// /**
//  * To use this service, you need to set up a Firebase project.
//  *
//  * 1. Go to the Firebase console (https://console.firebase.google.com/).
//  * 2. Create a new project or select an existing one.
//  * 3. Add a new Web App to your project.
//  * 4. Firebase will provide you with a configuration object. Copy the values
//  *    from that object into the `firebaseConfig` object below.
//  * 5. In the Firebase console, go to "Firestore Database" and create a new
//  *    database in production mode.
//  * 6. Go to the "Rules" tab and update the rules to allow reads and writes
//  *    for development. For example (NOT for production use):
//  *    rules_version = '2';
//  *    service cloud.firestore {
//  *      match /databases/{database}/documents {
//  *        match /{document=**} {
//  *          allow read, write: if true;
//  *        }
//  *      }
//  *    }
//  *
//  * The Firebase SDK is already included via the import map in index.html.
//  */
// import { initializeApp } from 'firebase/app';
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   QueryDocumentSnapshot,
//   DocumentData,
// } from 'firebase/firestore';
// import type { Task } from '../types';

// // IMPORTANT: Replace the placeholder values below with your actual
// // Firebase project configuration.
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY", // Replace with your API key
//   authDomain: "YOUR_AUTH_DOMAIN", // e.g., your-project-id.firebaseapp.com
//   projectId: "YOUR_PROJECT_ID", // e.g., your-project-id
//   storageBucket: "YOUR_STORAGE_BUCKET", // e.g., your-project-id.appspot.com
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// // Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const tasksCollectionRef = collection(db, 'tasks');

// // Helper to convert a Firestore document to a Task object
// const docToTask = (doc: QueryDocumentSnapshot<DocumentData>): Task => {
//   const data = doc.data();
//   return {
//     id: doc.id,
//     week: data.week,
//     name: data.name,
//     completed: data.completed,
//     priority: data.priority,
//     notes: data.notes,
//   } as Task;
// };

// export const firebaseService = {
//   getTasksForWeek: async (week: number): Promise<Task[]> => {
//     if (firebaseConfig.apiKey === "YOUR_API_KEY") {
//       console.warn("Firebase config is not set. Please update src/services/firebase.ts with your project credentials.");
//       return []; // Return empty array to avoid Firebase errors
//     }
//     const q = query(tasksCollectionRef, where('week', '==', week));
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(docToTask);
//   },

//   getAllTasks: async (): Promise<Task[]> => {
//     if (firebaseConfig.apiKey === "YOUR_API_KEY") {
//       return [];
//     }
//     const querySnapshot = await getDocs(tasksCollectionRef);
//     return querySnapshot.docs.map(docToTask);
//   },

//   addTask: async (taskData: Omit<Task, 'id'>): Promise<Task> => {
//     if (firebaseConfig.apiKey === "YOUR_API_KEY") {
//         throw new Error("Firebase config is not set. Cannot add task.");
//     }
//     const docRef = await addDoc(tasksCollectionRef, taskData);
//     return {
//       id: docRef.id,
//       ...taskData,
//     };
//   },

//   updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
//     if (firebaseConfig.apiKey === "YOUR_API_KEY") {
//         throw new Error("Firebase config is not set. Cannot update task.");
//     }
//     const taskDoc = doc(db, 'tasks', id);
//     await updateDoc(taskDoc, updates);
//     // Note: For simplicity, we're not refetching the document.
//     return { id, ...updates } as Task;
//   },

//   deleteTask: async (id: string): Promise<void> => {
//     if (firebaseConfig.apiKey === "YOUR_API_KEY") {
//         throw new Error("Firebase config is not set. Cannot delete task.");
//     }
//     const taskDoc = doc(db, 'tasks', id);
//     await deleteDoc(taskDoc);
//   },
// };
