import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "shared/api/firebase";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};
