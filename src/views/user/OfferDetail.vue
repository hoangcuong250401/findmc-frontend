<template>
	<main class="main-container">
		<Fieldset>
			<template #legend>
				<div class="flex items-center pl-2">
					<span>Offer gửi từ &nbsp;</span>
					<Avatar
						:image="notification?.thumbUrl"
						shape="circle"
						@click="redirectToProfile(additionalInfo?.senderId)"
					/>
					<span class="font-bold p-2">{{ additionalInfo?.senderName }}</span>
				</div>
			</template>
			<div class="info-container" v-if="additionalInfo">
				<div class="info-item">
					<label>Tên sự kiện:</label>
					<div class="value">{{ additionalInfo.eventName }}</div>
				</div>
				<div class="info-item">
					<label>Bắt đầu:</label>
					<div class="value" v-format-date="additionalInfo.eventStart"></div>
				</div>
				<div class="info-item">
					<label>Kết thúc:</label>
					<div class="value" v-format-date="additionalInfo.eventEnd"></div>
				</div>
				<div class="info-item">
					<label>Địa điểm:</label>
					<div class="value">{{ additionalInfo.place }}</div>
				</div>
				<div class="info-item">
					<label>Ghi chú:</label>
					<div class="value">{{ additionalInfo.note }}</div>
				</div>
			</div>
			<div class="button-container" v-if="notification?.status === NotificationStatus.Editable">
				<Button label="Từ chối" class="p-button-danger" @click="handleReject" />
				<Button label="Đồng ý" class="p-button-success" @click="handleApprove" />
			</div>
		</Fieldset>
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { notificationApi } from "@/apis/notificationApi";
import { contractApi } from "@/apis/contractApi";
import type { Notification } from "@/entities/notification";
import type { SendOfferAdditionalInfo } from "@/entities/notification/additionalInfo/sendOfferAdditionalInfo";
import { NotificationStatus } from "@/enums/notificationStatus";
import { NotificationType } from "@/enums/notificationType";
import type { RejectOfferAdditionalInfo } from "@/entities/notification/additionalInfo/rejectOfferAdditionalInfo";
import { useRedirect } from "@/composables/useRedirect";
import type { Contract } from "@/entities/contract";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "primevue/usetoast";
import type { OfferApprovedAdditionalInfo } from "@/entities/notification/additionalInfo/offerApprovedAdditionalInfo";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { redirectToProfile } = useRedirect();
const notification = ref<Notification | null>(null);
const additionalInfo = ref<SendOfferAdditionalInfo | null>(null);
const toast = useToast();

const fetchNotificationDetails = async (id: string) => {
	try {
		const response = await notificationApi.getById(id);
		if (!response.additionalInfo) return;
		notification.value = response;
		additionalInfo.value = JSON.parse(response.additionalInfo as string);
	} catch (error) {
		console.error("Failed to fetch notification details", error);
		router.push({ name: "user-notification-list" });
	}
};

const handleReject = async () => {
	try {
		if (additionalInfo.value?.senderId) {
			const rejectOfferAdditionalInfo: RejectOfferAdditionalInfo = {
				notificationId: notification.value?.id,
			};

			await notificationApi.create({
				id: 0,
				userId: additionalInfo.value.senderId,
				type: NotificationType.OfferRejected,
				message: `Offer cho sự kiện ${additionalInfo.value.eventName} của bạn đã bị từ chối.`,
				isRead: false,
				additionalInfo: JSON.stringify(rejectOfferAdditionalInfo),
				thumbUrl: authStore.user?.avatarUrl,
			});

			// Update the status of the original notification to NotEditable
			if (notification.value) {
				await notificationApi.update(notification.value.id, {
					...notification.value,
					status: NotificationStatus.NotEditable,
				});
			}
		}
		// Redirect to notification list
		router.push({ name: "user-notification-list" });
		toast.add({
			severity: "success",
			summary: "Offer Rejected",
			detail: "You have rejected the offer",
			life: 3000,
		});
	} catch (error) {
		console.error("Failed to reject the offer", error);
	}
};

const handleApprove = async () => {
	try {
		if (additionalInfo.value?.senderId) {
			// Create a new contract
			const contract: Contract = {
				id: 0,
				clientId: additionalInfo.value.senderId,
				mcId: authStore.user?.id,
				eventStart: additionalInfo.value.eventStart,
				eventEnd: additionalInfo.value.eventEnd,
				description: additionalInfo.value.note,
				place: additionalInfo.value.place,
				eventName: additionalInfo.value.eventName,
			};
			const newContract = await contractApi.create(contract);

			// Send notification to the user who sent the offer
			await notificationApi.create({
				id: 0,
				userId: additionalInfo.value.senderId,
				type: NotificationType.OfferApproved,
				message: `Offer cho sự kiện ${additionalInfo.value.eventName} của bạn đã được chấp nhận.`,
				thumbUrl: useAuthStore().user?.avatarUrl,
				additionalInfo: JSON.stringify({
					contractId: newContract.id,
				} as OfferApprovedAdditionalInfo),
			} as Notification);

			// Update the status of the original notification to NotEditable
			if (notification.value) {
				await notificationApi.update(notification.value.id, {
					...notification.value,
					status: NotificationStatus.NotEditable,
				} as Notification);
			}
		}
		// Redirect to contract list
		router.push({ name: "user-contract-list" });
		toast.add({
			severity: "success",
			summary: "Offer Approved",
			detail: "You have approved the offer",
			life: 3000,
		});
	} catch (error) {
		console.error("Failed to approve the offer", error);
	}
};

onMounted(() => {
	const id = route.params.id as string;
	if (id) {
		fetchNotificationDetails(id);
	} else {
		router.push({ name: "user-notification-list" });
	}
});
</script>

<style lang="scss" scoped>
.main-container {
	display: flex;
	flex-direction: column;
	padding: 0 12px 12px;
	margin-bottom: 60px;
}

.info-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 20px;
}

.info-item {
	display: flex;

	label {
		flex: 0 0 auto;
		width: max-content;
		margin-right: 4px;
	}
}

.button-container {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
}
</style>
