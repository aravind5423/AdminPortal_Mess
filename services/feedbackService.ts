import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { Review, Poll } from "../types";

const REVIEWS_COLLECTION = "Reviews";
const POLLS_COLLECTION = "Polls";

export const FeedbackService = {
    getReviews: async (): Promise<Review[]> => {
        const querySnapshot = await getDocs(collection(db, REVIEWS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Review);
    },

    resolveReview: async (reviewId: string) => {
        const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
        await updateDoc(docRef, { solved: true });
    },

    getPolls: async (): Promise<Poll[]> => {
        const querySnapshot = await getDocs(collection(db, POLLS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Poll);
    },

    createPoll: async (poll: Omit<Poll, 'id'>) => {
        // Note: ID generation might need to happen here or let Firestore handle it
        const docRef = await addDoc(collection(db, POLLS_COLLECTION), poll);
        return docRef.id;
    }
};
