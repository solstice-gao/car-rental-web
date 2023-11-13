<template>
	<div class="container">
		<Breadcrumb :items="['menu.company', 'menu.list.company']" />
		<a-card class="general-card" :title="$t('menu.list.company')">
			<a-row>
				<a-col :flex="1">
					<a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
						label-align="left">
						<a-row :gutter="16">
							<a-col :span="8">
								<a-form-item field="companyName" :label="$t('searchTable.form.keyWorlds')">
									<a-input v-model="formModel.companyName"
										:placeholder="$t('searchTable.form.keyWorlds.companyName')" />
								</a-form-item>
							</a-col>
						</a-row>
						<a-row :gutter="10">

						</a-row>
					</a-form>
				</a-col>
				<a-divider style="height: 40px" direction="vertical" />
				<a-col :flex="'180px'" style="text-align: right">
					<a-space :size="18">
						<!-- 搜索按钮 -->
						<a-button type="primary" @click="search">
							<template #icon>
								<icon-search />
							</template>
							{{ $t('searchTable.form.search') }}
						</a-button>

						<a-button type="primary" @click="add" status="success">
							<template #icon>
								<icon-plus />
							</template>
							新增
						</a-button>

						<a-button @click="reset">
							<template #icon>
								<icon-refresh />
							</template>
							{{ $t('searchTable.form.reset') }}
						</a-button>


					</a-space>
				</a-col>
			</a-row>


			<a-divider style="margin-top: 0" />

			<!-- 列表视图 -->
			<a-table row-key="id" :loading="loading" :pagination="pagination" :data="renderData" :bordered="{ cell: true }"
				@page-change="onPageChange" column-resizable>
				<template #columns>
					<a-table-column :title="$t('commit.columns.companyId')" dataIndex="companyId" :width="200" />
					<a-table-column :title="$t('commit.columns.companyCity')" dataIndex="companyCity" :width="130" />
					<a-table-column :title="$t('commit.columns.companyName')" dataIndex="companyName" :width="220" />

					<a-table-column :title="$t('commit.columns.companyMonthlySales')" dataIndex="companyMonthlySales"
						:width="100" />

					<a-table-column fixed="right" :title="$t('searchTable.columns.operations')" data-index="operations"
						:width="10">
						<template #cell="{ record }">
							<div style="display: flex; gap: 8px; justify-content: flex-end;">
								<a-button size="small" type="outline" @click="redirtInfo(record)"
									v-if="record.companyId">
									详情
								</a-button>
								<a-button type="outline" status="warning" size="small"
									@click="update_order_status = true; updateData.companyName = record.companyName; updateData.companyCity = record.companyCity; updateData.companyId = record.companyId">
									修改
								</a-button>
								<a-button size="small" type="outline" status="danger"
									@click="visible = true; oldCompanyId = record.companyId;oldCompanyName = record.companyName">
									删除
								</a-button>
								<!-- 删除订单弹窗 -->
								<a-modal v-model:visible="visible" @ok="deleteCompany()" @cancel="">
									<template #title>
										删除公司
									</template>
									<div>确认要删除
										<a-tag color="red">{{ oldCompanyName }}</a-tag>
										吗？
									</div>
								</a-modal>
								<!-- 修改订单状态弹窗 -->
								<a-modal v-model:visible="update_order_status" title="修改公司信息" @ok="updateCompanys">
									<a-form-item field="post" label="公司名称">
										<a-input v-model="updateData.companyName" placeholder="请输入新的公司名称" />
									</a-form-item>

									<a-form-item field="post" label="公司所在地">
										<a-input v-model="updateData.companyCity" placeholder="请输入新的公司所在地" />
									</a-form-item>
								</a-modal>
							</div>
						</template>
					</a-table-column>
				</template>
			</a-table>
		</a-card>



		<a-drawer :width="500" :visible="openDrawers" @cancel="openDrawers=false" @ok="openDrawers=true">
			<a-card :loading="loading">
				<a-row class="wrapper">
				  <a-col :span="24">
					<a-descriptions :column="{ xs: 1, md: 1, lg: 1 }" v-if="company">
						<a-descriptions-item label="车辆标题" v-if="company.companyCity">
							<a-image width="100" :src="company.companyIcon" />
						  </a-descriptions-item>
					  <a-descriptions-item label="车辆ID" v-if="company.companyName">
						<a-tag>{{ company.companyName }}</a-tag>
					  </a-descriptions-item>
					  <a-descriptions-item label="车辆标题" v-if="company.companyCity">
						<a-tag>{{ company.companyCity }}</a-tag>
					  </a-descriptions-item>

					  <a-descriptions-item label="营业执照" v-if="company.companyCity">
						<a-image width="250" :src="company.businessLicense" />
					  </a-descriptions-item>
			
					</a-descriptions>
				  </a-col>
				</a-row>
			  </a-card>

		</a-drawer>

		<a-modal v-model:visible="visibleAdd" title="新增公司信息" @before-ok="handleBeforeOk">
			<a-form :model="form">
				<a-form-item field="companyName" label="公司名称" :rules="{
					required: true
				}">
					<a-input v-model="form.companyName" />
				</a-form-item>

				<a-form-item field="companyCity" label="所在城市" :rules="{
					required: true
				}">
					<a-input v-model="form.companyCity" />
				</a-form-item>

				<a-form-item field="file" label="公司图标">
					<a-upload :action="HOST + '/tenant_company/add-image'" :headers="uploadHeaders" :data="{type:'4'}" :fileList="file ? [file] : []"
						:show-file-list="false" @change="onChange" @success="onProgress">
						<template #upload-button>
							<div :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
								}`">
								<div class="arco-upload-list-picture custom-upload-avatar" v-if="file && file.url">
									<img :src="file.url" />
									<div class="arco-upload-list-picture-mask">
										<IconEdit />
									</div>
									<a-progress v-if="file.status === 'uploading' && file.percent < 100" :percent="file.percent"
										type="circle" size="mini" :style="{
											position: 'absolute',
											left: '50%',
											top: '50%',
											transform: 'translateX(-50%) translateY(-50%)',
										}" />
								</div>
								<div class="arco-upload-picture-card" v-else>
									<div class="arco-upload-picture-card-text">
										<IconPlus />
										<div style="margin-top: 10px; font-weight: 600">Upload</div>
									</div>
								</div>
							</div>
						</template>
					</a-upload>
				</a-form-item>

				<a-form-item field="file2" label="公司营业执照">
					<a-upload :action="HOST + '/tenant_company/add-image'" :headers="uploadHeaders" :data="{type:'4'}" :fileList="file2 ? [file2] : []"
						:show-file-list="false" @change="onChange2" @success="onProgress2">
						<template #upload-button>
							<div :class="`arco-upload-list-item${file2 && file2.status === 'error' ? ' arco-upload-list-item-error' : ''
								}`">
								<div class="arco-upload-list-picture custom-upload-avatar" v-if="file2 && file2.url">
									<img :src="file2.url" />
									<div class="arco-upload-list-picture-mask">
										<IconEdit />
									</div>
									<a-progress v-if="file2.status === 'uploading' && file2.percent < 100" :percent="file2.percent"
										type="circle" size="mini" :style="{
											position: 'absolute',
											left: '50%',
											top: '50%',
											transform: 'translateX(-50%) translateY(-50%)',
										}" />
								</div>
								<div class="arco-upload-picture-card" v-else>
									<div class="arco-upload-picture-card-text">
										<IconPlus />
										<div style="margin-top: 10px; font-weight: 600">Upload</div>
									</div>
								</div>
							</div>
						</template>
					</a-upload>
				</a-form-item>
				
			</a-form>
		</a-modal>
	</div>
</template>

<script lang="ts">
import OrderInfo from './info/index.vue'
import { Notification } from '@arco-design/web-vue';
import { defineComponent, computed, ref, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { queryPolicyList, deleteCompanyById, PolicyRecord, updateStatusOrderById, addCompany, updateCompany } from '@/api/list';
import { Options } from '@/types/global';
import { getRoles } from '@/utils/auth';
import { HOST } from '@/api/interceptor'
import { getClient, getToken } from '@/utils/auth';

// 生成检索条件对象
const generateFormModel = () => {
	return {
		// 关键词
		s: '',
		// 状态
		companyName: '',
		// 开始时间
		startTime: '',
		// 结束时间
		endTime: '',
		// 充值状态
		recharge: '',
		// 激活状态
		activate: '',
		// 渠道
		channel: '',
	};
};

export default defineComponent({
	components: {
		OrderInfo
	},
	setup() {
		const file = ref();
		const company = ref({});
		const file2 = ref();
		const onChange = (_: any, currentFile: any) => {
            file.value = {
                ...currentFile,
                // url: URL.createObjectURL(currentFile.file),
            };
        };
		const onChange2 = (_: any, currentFile: any) => {
            file2.value = {
                ...currentFile,
                // url: URL.createObjectURL(currentFile.file),
            };
        };
        const onProgress = (currentFile: any) => {
            file.value = currentFile;
			if(currentFile.response.code==200){
				form.companyIcon = currentFile.response.data;
			}else{
				file.value={};
			}
        };
		const onProgress2 = (currentFile: any) => {
            file2.value = currentFile;
			console.log(currentFile.response);
			
			if(currentFile.response.code==200){
				form.businessLicense = currentFile.response.data;
			}else{
				file2.value={};
			}
			
        };
		const form = reactive({
			companyName: "",
			companyCity: "",
			companyIcon: "",
			businessLicense: "",
		});
		const visible = ref(false);
		const visibleAdd = ref(false);
		const update_order_status = ref(false);
		const new_status = ref(-1);
		const old_status = ref(-1);
		const oldCompanyName = ref('');
		const oldCompanyCity = ref('');
		const oldCompanyId = ref('');
		const order_id = ref();
		const auth_id = ref('');
		const openDrawers = ref(false);
		const roles = getRoles();
		const { loading, setLoading } = useLoading(true);
		const { t } = useI18n();
		const renderData = ref<PolicyRecord[]>([]);
		const formModel = ref(generateFormModel());
		const timePicker = ref<Date[]>([]);
		const redirtInfo = (data: any) => {

			openDrawers.value = true;
			company.value = data;
			console.log(openDrawers.value);
			
		};

		const add = () => {
			visibleAdd.value = true;
		};
		const handleBeforeOk = async (done: any) => {

			
			await addCompany(form);
			
		};

		const updateData = ref<PolicyRecord>({});

		const pagination = ref({
			// 页码
			current: 1,
			// 每页数量
			pageSize: 10,
			// 总条数
			total: 0,

			showTotal: true,
		})

		const deleteCompany = async () => {
			var company = await deleteCompanyById(oldCompanyId.value);
			if (company.data.code == 200) {
				Notification.success({
					title: '删除',
					content: `公司信息状态删除成功`,
					duration: 3000,
				});
			}
			await fetchData();
		};


		const updateCompanys = async () => {
			var company = await updateCompany({ ...updateData.value });
			if (company.data.code == 200) {
				Notification.success({
					title: '更新成功',
					content: `公司信息状态更新成功`,
					duration: 3000,
				});
			}
			console.log(company);

			await fetchData();
		}


		const getStatusTagColor = (status: number) => {
			switch (status) {
				case 1:
					return 'green';
				case 0:
					return 'gray'
				case -2:
					return 'red';
			}
		};

		// 列表查询函数
		const fetchData = async (extraParams: any = {}) => {
			setLoading(true);
			try {
				const res = await queryPolicyList({
					...formModel.value,
					page: pagination.value.current,
					...extraParams
				});
				renderData.value = res.data.data.records;
				console.log(renderData.value);

				pagination.value.total = +res.data.data.total;
			} catch (err) {
				// you can report use errorHandler or other
			} finally {
				setLoading(false);
			}
		};

		// 搜索按钮的点击事件
		const search = () => {
			// 重置页码为第一页
			pagination.value.current = 1;
			fetchData();
		};
		// 重置表单
		const reset = () => {
			formModel.value = generateFormModel();
			timePicker.value = [];
			search();
		};

		// 页码切换事件
		const onPageChange = (page: number = 1) => {
			pagination.value.current = page;
			fetchData();
		};

		// 数据导出确认
		const exportConfirmVisible = ref(false);

		onMounted(() => {
			// 默认第一次加载数据
			fetchData();
		})

		return {
			// 上传相关的信息
			HOST,
			uploadHeaders: {
				client: getClient(),
				satoken: getToken(),
			},
			file,
			file2,
			onChange,
			onChange2,
			onProgress,
			onProgress2,
			add,
			handleBeforeOk,
			form,
			oldCompanyCity,
			oldCompanyName,
			loading,
			search,
			timePicker,
			visible,
			onPageChange,
			renderData,
			formModel,
			order_id,
			auth_id,
			openDrawers,
			reset,

			getStatusTagColor,
			company,
			redirtInfo,
			update_order_status,
			deleteCompany,

			new_status,
			old_status,
			visibleAdd,
			exportConfirmVisible,
			// 分页对象
			pagination,
			updateData,
			updateCompanys,
			oldCompanyId,
		};
	},
});
</script>

<style scoped lang="less">
:deep(.arco-table-th) {
	&:last-child {
		.arco-table-th-item-title {
			margin-left: 16px;
		}
	}
}
</style>