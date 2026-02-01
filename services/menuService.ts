import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { MainMenu } from "../types";

const MENU_COLLECTION = "MainMenu";

export const MenuService = {
    getMainMenu: async (): Promise<(MainMenu & { id: string }) | null> => {
        // Assuming there's only one main menu document or we want the first one
        // Adjust logic if there are multiple menus based on date/etc.
        const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as MainMenu & { id: string };
        }
        return null;
    },

    updateMainMenu: async (docId: string, data: Partial<MainMenu>) => {
        const docRef = doc(db, MENU_COLLECTION, docId);
        await updateDoc(docRef, data);
    }
};
