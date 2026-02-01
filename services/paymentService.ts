import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Payment } from "../types";

const PAYMENTS_COLLECTION = "Payments";

export const PaymentService = {
    getAllPayments: async (): Promise<Payment[]> => {
        const q = query(collection(db, PAYMENTS_COLLECTION)); // Add sorting if needed
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
    },

    getRecentPayments: async (count: number = 10): Promise<Payment[]> => {
        // If timestamp is sortable
        const q = query(collection(db, PAYMENTS_COLLECTION), limit(count));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
    }
};
