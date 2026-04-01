// import { createSanityUser, getUserByFirebaseUid } from "@/entities/user/api";
// import { auth, googleProvider } from "@/shared/lib/firebase";
// import { signInWithPopup } from "firebase/auth";
// import { toast } from "sonner";

// export const signInWithGoogle = async (navigate: (path: string) => void) => {
//     try {
//         const result = await signInWithPopup(auth, googleProvider);
//         const firebaseUser = result.user;

//         let existingUser = await getUserByFirebaseUid(firebaseUser.uid);

//         if (!existingUser?._id) {
//             await createSanityUser({
//                 firebaseUid: firebaseUser.uid,
//                 name: firebaseUser.displayName || "No Name",
//                 email: firebaseUser.email,
//                 photo: firebaseUser.photoURL || null,
//             });
//             toast.success("Account created");
//         } else {
//             toast.success("Logged in");
//         }
//         navigate("/");
//     } catch (error) {
//         console.log("Google login error:", error);
//         toast.error("Unable to sign in with Google");
//     }
// };