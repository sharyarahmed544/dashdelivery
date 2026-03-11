import { adminAuth } from '../lib/firebase';

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address: npx ts-node set-admin.ts user@example.com');
    process.exit(1);
}

async function setAdminClaim(userEmail: string) {
    try {
        const user = await adminAuth.getUserByEmail(userEmail);
        await adminAuth.setCustomUserClaims(user.uid, { role: 'ADMIN' });
        console.log(`Successfully granted ADMIN role to ${userEmail}`);

        // Cleanup to exit script
        process.exit(0);
    } catch (error) {
        console.error('Error setting admin claim:', error);
        process.exit(1);
    }
}

setAdminClaim(email);
