import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { writable } from 'svelte/store';
import { auth } from '../lib/firebase/firebase';
// auth store to manage user authentication state
export const authStore = writable({
	user: null,
	loading: true,
	data: {}
});
// auth handlers for axport an function outside for easier reading
export const authHandlers = {
	// signup function
	signup: async (email, pass) => {
		await createUserWithEmailAndPassword(auth, email, pass);
	},
	// login function
	login: async (email, pass) => {
		await signInWithEmailAndPassword(auth, email, pass);
	},
	// logout function
	logout: async () => {
		await signOut(auth);
	}
};
