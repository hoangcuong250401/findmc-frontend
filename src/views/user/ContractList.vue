<template>
	<main class="main-container">
		<header class="center-header">Danh sách hợp đồng</header>
		<div class="contract-list" @scroll="handleScroll">
			<div
				v-for="contract in contracts"
				:key="contract.id"
				class="contract-item"
				@click="redirectToContractDetail(contract)"
			>
				<Fieldset>
					<template #legend>
						<div class="flex items-center pl-2">
							<span>Hợp tác với &nbsp;</span>
							<Avatar
								:image="getAvatarUrl(contract)"
								shape="circle"
								@click="redirectToProfile(getUserId(contract))"
							/>
							<span class="font-bold p-2">{{ getFullName(contract) }}</span>
						</div>
					</template>
					<div class="info-container">
						<div class="info-item">
							<label>Sự kiện:</label>
							<div class="value">{{ contract.eventName }}</div>
						</div>
						<div class="info-item">
							<label>Bắt đầu:</label>
							<div class="value" v-format-date="contract.eventStart"></div>
						</div>
						<div class="info-item">
							<label>Kết thúc:</label>
							<div class="value" v-format-date="contract.eventEnd"></div>
						</div>
						<div class="info-item">
							<label>Địa điểm:</label>
							<div class="value">{{ contract.place }}</div>
						</div>
						<div class="info-item">
							<label>Mô tả:</label>
							<div class="value">{{ contract.description }}</div>
						</div>
					</div>
					<hr />
					<div class="additional-info">
						<div class="info-item">
							<label>Ngày tạo:</label>
							<div class="value" v-format-date="contract.createdAt"></div>
						</div>
						<div class="info-item">
							<label>Trạng thái:</label>
							<div class="value">
								<Tag
									v-if="contract.status === ContractStatus.InEffect"
									severity="success"
									:value="getContractStatusText(contract.status)"
								/>
								<Tag
									v-if="contract.status === ContractStatus.Canceled"
									severity="danger"
									:value="getContractStatusText(contract.status)"
								/>
								<Tag
									v-if="contract.status === ContractStatus.Completed"
									severity="info"
									:value="getContractStatusText(contract.status)"
								/>
							</div>
						</div>
					</div>
				</Fieldset>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { contractApi } from "@/apis/contractApi";
import { useAuthStore } from "@/stores/authStore";
import type { Contract } from "@/entities/contract";
import { ContractStatus, getContractStatusText } from "@/enums/contractStatus";
import type { ContractPagedRequest } from "@/entities/user/paging/contractPagedRequest";
import { useRedirect } from "@/composables/useRedirect";
import { useRouter } from "vue-router";

const contracts = ref<Contract[]>([]);
const page = ref(0);
const pageSize = 10;
const loading = ref(false);
const authStore = useAuthStore();
const { redirectToProfile } = useRedirect();
const router = useRouter();
const isMc = computed(() => authStore.user?.isMc == "True");

const fetchContracts = async () => {
	if (loading.value) return;
	loading.value = true;
	try {
		const request: ContractPagedRequest = {
			pageIndex: page.value,
			pageSize,
			sort: "created_at DESC",
			isUseProc: true,
		};

		if (isMc.value) {
			request.mcId = authStore.user?.id as number;
		} else {
			request.clientId = authStore.user?.id as number;
		}

		const response = await contractApi.getPaged(request);

		if (response && response.items.length > 0) {
			contracts.value.push(...response.items);
			page.value++;
		}
	} catch (error) {
		console.error("Không thể tải hợp đồng", error);
	} finally {
		loading.value = false;
	}
};

const getAvatarUrl = (contract: Contract) => {
	if (isMc.value) {
		return contract.client?.avatarUrl;
	} else {
		return contract.mc?.avatarUrl;
	}
};

const getFullName = (contract: Contract) => {
	if (isMc.value) {
		return contract.client?.nickName ?? contract.client?.fullName;
	} else {
		return contract.mc?.nickName ?? contract.mc?.fullName;
	}
};

const getUserId = (contract: Contract) => {
	if (isMc.value) {
		return contract.client?.id;
	} else {
		return contract.mc?.id;
	}
};

const handleScroll = (event: any) => {
	const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
	if (bottom) {
		fetchContracts();
	}
};

const redirectToContractDetail = (contract: any) => {
	router.push({ name: "user-contract-detail", params: { id: contract.id } });
};

onMounted(() => {
	fetchContracts();
});
</script>

<style lang="scss" scoped>
.main-container {
	background-color: #fff;
	display: flex;
	flex-direction: column;
}

.contract-list {
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	height: 100vh; /* Adjust as needed */
}

.contract-item {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 12px;
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

.additional-info {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-top: 20px;
}
</style>
