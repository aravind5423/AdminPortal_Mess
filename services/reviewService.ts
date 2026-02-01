import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Review } from "../types";

const REVIEWS_COLLECTION = "Reviews";

export const ReviewService = {
    getAllReviews: async (): Promise<Review[]> => {
        // Ideally order by dateTime or comp, but we'll fetch all first
        const q = query(collection(db, REVIEWS_COLLECTION));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    },

    // Potential future method: resolve review
};
