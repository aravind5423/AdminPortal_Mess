import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { SpecialMeal } from "../types";

const SPECIAL_MEAL_COLLECTION = "SpecialMeal";

export const SpecialMealService = {
    getSpecialMeals: async (): Promise<SpecialMeal[]> => {
        const querySnapshot = await getDocs(collection(db, SPECIAL_MEAL_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as SpecialMeal);
    },

    addSpecialMeal: async (meal: SpecialMeal) => {
        await addDoc(collection(db, SPECIAL_MEAL_COLLECTION), meal);
    }
};
