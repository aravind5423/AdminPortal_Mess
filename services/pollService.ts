import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import { Poll } from "../types";

const POLLS_COLLECTION = "Polls";

export const PollService = {
    getAllPolls: async (): Promise<Poll[]> => {
        const q = query(collection(db, POLLS_COLLECTION));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Poll));
    },

    createPoll: async (pollData: Partial<Poll>) => {
        return await addDoc(collection(db, POLLS_COLLECTION), pollData);
    }
};
