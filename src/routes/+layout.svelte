<script>
	import { onMount } from "svelte";
	import { auth, db } from '../lib/firebase/firebase';
	import { getDoc, doc, setDoc } from "firebase/firestore";
	import { authStore } from "../store/store";

	// paths that do not require authentication
	const nonAuthRoutes = ['/', 'product'];
	onMount(() => {
		// listen for authentication state changes
		const unsbscribe = auth.onAuthStateChanged(async user => {
			const currentPath = window.location.pathname
			// redirect based on authentication status and current path
			if(!user && !nonAuthRoutes.includes(currentPath)){
			window.location.href = '/';
		return;
			}
			// redirect authenticated users away from the login page
			if(user && currentPath === '/') {
				window.location.href = "/dashboard";
				return;
			}
			// if no user is authenticated, exit
			if(!user) {
				return;
			}
			// fetch user data from Firestore
			let dataToSetToStore
			const docRef = doc(db, 'user', user.uid);
			const docSnap = await getDoc(docRef);
			// if user document doesn't exist, create it
			if(!docSnap.exists()){
				const userRef = doc(db, 'user', user.uid);
				dataToSetToStore = {email: user.email,todos:[]}
				await setDoc(
					userRef,
					dataToSetToStore,
					{
						merge: true
					}
				)
				// set data for store
			}else{
				// set fetched data to store
				const userData = docSnap.data();
				dataToSetToStore = userData;
			}
			// update the auth store with user data
			authStore.update((curr) => {
				return{
					...curr,
					user,
					data:dataToSetToStore,
					loading: false,
				}
			})
		});
	});


</script>


<div class="mainContainer">
	<!-- Main layout container -->
	<slot/>
</div> 

<style>
	.mainContainer{
		min-height: 100vh;
		background:linear-gradient(to right,#000428, #000046 ) ;
		color: white;
		position: relative;
		display: flex;
		flex-direction: column;
	}
</style>
