<template>
	<div>
		<GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton>
	</div>
</template>

<script setup lang="ts">
import { GoogleSignInButton, type CredentialResponse } from "vue3-google-signin";
import { jwtDecode } from "jwt-decode";
import { authApi } from "@/apis/authApi";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
	const { credential } = response;
	// Decode the JWT token
	const decodedToken = jwtDecode(credential);

	// Extract user information from the decoded token
	const { email, name, picture, email_verified } = decodedToken;
	console.log("User Info:", { email, name, picture, email_verified });

	if (!email_verified) {
		console.log("Vui lòng xác thực email trước khi đăng nhập");
		return;
	}
	const createUserResponse = await authApi.loginWithGoogle(credential, false, false);

	if (createUserResponse.data.isNewUser === true) {
		setTimeout(async () => {
			const isMc = true;
			const createUserAgainResponse = await authApi.loginWithGoogle(credential, true, isMc);
			console.log("createUserAgainResponse", createUserAgainResponse);
		}, 2000);
	} else {
		authStore.login(createUserResponse.data.accessToken);

		toast.add({
			severity: "success",
			summary: "Login Successful",
			detail: "You have logged in successfully",
			life: 3000,
		});

		// Redirect to the original view
		const redirectPath = route.query.redirect || "/";
		router.push(redirectPath as string);
	}
};

// handle an error event
const handleLoginError = () => {
	toast.add({
		severity: "error",
		summary: "Login failed",
		detail: "Fail to login",
		life: 3000,
	});
};
</script>
