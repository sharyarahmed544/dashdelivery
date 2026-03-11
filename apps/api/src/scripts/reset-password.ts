import { adminAuth } from '../lib/firebase';

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.error('Usage: npx ts-node reset-password.ts <email> <new-password>');
    process.exit(1);
}

async function resetPassword(userEmail: string, newPass: string) {
    try {
        const user = await adminAuth.getUserByEmail(userEmail);
        await adminAuth.updateUser(user.uid, {
            password: newPass
        });
        console.log(`Successfully updated password for ${userEmail}`);
        process.exit(0);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            console.log(`User ${userEmail} not found. Creating new user...`);
            await adminAuth.createUser({
                email: userEmail,
                password: newPass,
                emailVerified: true
            });
            console.log(`Successfully created user ${userEmail}`);
            process.exit(0);
        } else {
            console.error('Error updating password:', error);
            process.exit(1);
        }
    }
}

resetPassword(email, password);
