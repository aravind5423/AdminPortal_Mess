import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "../types";

const USERS_COLLECTION = "Users";

export const UserService = {
    getAllUsers: async (): Promise<User[]> => {
        const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as User);
    },

    getUser: async (uid: string): Promise<User | null> => {
        const docRef = doc(db, USERS_COLLECTION, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as User;
        } else {
            return null;
        }
    },

    updateUser: async (uid: string, data: Partial<User>) => {
        const docRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(docRef, data);
    }
};
