import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { MessLeave } from "../types";

const LEAVES_COLLECTION = "MessLeaves";

export const LeaveService = {
    getAllLeaves: async (): Promise<MessLeave[]> => {
        // Requesting ordered by timestamp desc if possible, otherwise client-side sort
        const q = query(collection(db, LEAVES_COLLECTION));
        const querySnapshot = await getDocs(q);
        console.log(`Fetched ${querySnapshot.size} leaves from ${LEAVES_COLLECTION}`);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log("Raw Leave Data:", data);
            return { ...data, id: doc.id } as MessLeave;
        });
    },

    updateLeaveStatus: async (docId: string, status: string) => {
        const docRef = doc(db, LEAVES_COLLECTION, docId);
        await updateDoc(docRef, { status });
    }
};
