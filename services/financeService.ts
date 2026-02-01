import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Payment } from "../types";

const PAYMENTS_COLLECTION = "Payments";

export const FinanceService = {
    getPayments: async (): Promise<Payment[]> => {
        const querySnapshot = await getDocs(collection(db, PAYMENTS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Payment);
    }
};
