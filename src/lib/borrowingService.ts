import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { BookBorrowingRecord } from '../types';

const COLLECTION_NAME = 'borrowing_records';

export const getBorrowingRecords = async (): Promise<BookBorrowingRecord[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookBorrowingRecord));
};

export const addBorrowingRecord = async (record: Omit<BookBorrowingRecord, 'id'>) => {
  await addDoc(collection(db, COLLECTION_NAME), record);
};

export const updateBorrowingRecord = async (id: string, record: Partial<BookBorrowingRecord>) => {
  await updateDoc(doc(db, COLLECTION_NAME, id), record);
};

export const deleteBorrowingRecord = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
