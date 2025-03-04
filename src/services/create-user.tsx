import { ref, set } from "firebase/database";
import { database } from "./firebase";

export interface UserProfile {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
}

// Function to create a new user profile in the Realtime Database
export const createUserProfile = async (userId: string, userProfile: UserProfile) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, {
      ...userProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};