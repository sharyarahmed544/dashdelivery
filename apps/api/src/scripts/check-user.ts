import { adminAuth } from '../lib/firebase';

const email = process.argv[2];

if (!email) {
    console.error('Usage: npx ts-node check-user.ts <email>');
    process.exit(1);
}

async function checkUser(userEmail: string) {
    try {
        const user = await adminAuth.getUserByEmail(userEmail);
        console.log('User Found:');
        console.log('- UID:', user.uid);
        console.log('- Email:', user.email);
        console.log('- Claims:', user.customClaims);
        console.log('- Role:', user.customClaims?.role);

        if (user.customClaims?.role === 'ADMIN') {
            console.log('✅ User HAS the ADMIN role.');
        } else {
            console.log('❌ User DOES NOT have the ADMIN role.');
        }

        process.exit(0);
    } catch (error: any) {
        console.error('Error finding user:', error.message);
        process.exit(1);
    }
}

checkUser(email);
