// Quick utility to promote a user to Super Admin
// Run with: node promote-to-admin.js YOUR_EMAIL@bicc.gm
// NOTE: Uses bicc-gambia project — must match apps/admin-portal/src/firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGgiAIAJbV16KnyKxznpYKStJzpsFvQZ4",
  authDomain: "bicc-gambia.firebaseapp.com",
  projectId: "bicc-gambia",
  storageBucket: "bicc-gambia.appspot.com",
  messagingSenderId: "527408002651",
  appId: "1:527408002651:web:6eb3c5f5e9e07ebde5f0bc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function promoteToSuperAdmin(email) {
  try {
    console.log('🔍 Looking for user with email:', email);
    
    const q = query(collection(db, 'users'), where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ User not found with email:', email);
      console.log('\n📋 Available users:');
      const allUsers = await getDocs(collection(db, 'users'));
      allUsers.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.email} (${data.username}) - Current role: ${data.role}`);
      });
      process.exit(1);
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ Found user:', userData.username);
    console.log('📝 Current role:', userData.role);
    
    await updateDoc(doc(db, 'users', userDoc.id), {
      role: 'Super Admin'
    });
    
    console.log('✅ User promoted to Super Admin!');
    console.log('\n🔄 Next steps:');
    console.log('1. Log out of the admin portal');
    console.log('2. Clear browser cache (Ctrl+Shift+Delete)');
    console.log('3. Log back in');
    console.log('4. You should now see ALL tabs including Users');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('Usage: node promote-to-admin.js YOUR_EMAIL@bicc.gm');
  process.exit(1);
}

promoteToSuperAdmin(email);
