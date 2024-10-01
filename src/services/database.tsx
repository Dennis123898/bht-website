import { firestore, storage } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, deleteObject } from 'firebase/storage';

interface UserData {
  email: string;
  displayName: string;
  photoURL: string;
}

export const writeUserData = async (userId: string, userData: UserData) => {
  const userRef = doc(firestore, 'users', userId);
  await setDoc(userRef, userData, { merge: true });
};

export const addItem = async (userId: string, item: File | string) => {
    if (typeof item === 'string') {
        const docRef = await addDoc(collection(firestore, `users/${userId}/folders`), {
            name: item,
            createdAt: new Date()
        });
        return docRef.id;
    } else {
        const filePath = `users/${userId}/${item.name}`;
        const fileRef = storageRef(storage, filePath);
        await uploadBytes(fileRef, item);
        const docRef = await addDoc(collection(firestore, `users/${userId}/files`), {
            name: item.name,
            type: item.type,
            size: item.size,
            path: filePath,  
            createdAt: new Date()
        });
        return docRef.id;
    }
};

export const deleteItem = async (userId: string, itemId: string, isFolder: boolean) => {
    try {
        const collectionName = isFolder ? 'folders' : 'files';
        const itemRef = doc(firestore, `users/${userId}/${collectionName}`, itemId);
        
        if (!isFolder) {
            const itemDoc = await getDoc(itemRef);
            if (itemDoc.exists()) {
                const itemData = itemDoc.data();
                if (itemData && itemData.path) {
                    const fileRef = storageRef(storage, itemData.path);
                    await deleteObject(fileRef);
                }
            }
        }
        
        await deleteDoc(itemRef);
        console.log(`${isFolder ? 'Folder' : 'File'} ${itemId} deleted successfully`);
    } catch (error) {
        console.error('Error in deleteItem:', error);
        throw error;
    }
};