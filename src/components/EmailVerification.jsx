import { getAuth, updateEmail, sendEmailVerification, EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from "firebase/auth";

export const updateAndVerifyEmail = async (email, password) => {
 const auth = getAuth();
 const user = auth.currentUser;

 if (!user) {
    throw new Error("User not logged in.");
 }

 // Reauthenticate the user with their current password
 const credential = EmailAuthProvider.credential(user.email, password);
 await reauthenticateWithCredential(user, credential);
 console.log("user authenticated");
 console.log(user.email);

 try {
    // Send verification email to the new email address
    await verifyBeforeUpdateEmail(user, email);
    console.log("Verification email sent");

    // Update email address after verification
    await updateEmail(user, email);
    console.log("Email updated");

    // Optionally, send a verification email to the new email address
    await sendEmailVerification(user);
    console.log("Verification email sent to new email");

    return true; // Email update and verification succeeded
 } catch (error) {
    console.error("Error updating email:", error);
    throw error; // Propagate the error
 }
};
