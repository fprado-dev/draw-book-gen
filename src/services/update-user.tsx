import { ref, set, get } from "firebase/database";
import { database } from "./firebase";
import { UserProfile } from "./create-user";

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return { profile: snapshot.val(), error: null };
    }
    return { profile: null, error: "User profile not found" };
  } catch (error: any) {
    return { profile: null, error: error.message };
  }
};

export const updateUserProfile = async (userId: string, userProfile: Partial<UserProfile>) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      return { success: false, error: "User profile not found" };
    }

    const currentProfile = snapshot.val();
    await set(userRef, {
      ...currentProfile,
      ...userProfile,
      updatedAt: new Date().toISOString()
    });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};