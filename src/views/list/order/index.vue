<template>
    <div class="container">
        <Breadcrumb :items="['menu.list.order', 'menu.list.order.list']" />
        <a-card class="general-card" :title="$t('menu.list.order.list')">
            <a-row>
                <a-col :flex="1">
                    <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
                        label-align="left">
                        <a-row :gutter="16">
                            <a-col :span="8">
                                <a-form-item field="orderNo" label="订单号">
                                    <a-input v-model="formModel.orderNo"
                                        placeholder="请输入订单号" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="orderNo" label="手机号">
                                    <a-input v-model="formModel.phone"
                                        placeholder="请输入手机号" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="10">

                        </a-row>
                    </a-form>
                </a-col>
                <a-divider style="height: 40px" direction="vertical" />
                <a-col :flex="'150px'" style="text-align: right">
                    <a-space :size="16">

                        <a-button type="primary" @click="search">
                            <template #icon>
                                <icon-search />
                            </template>
                            {{ $t('searchTable.form.search') }}
                        </a-button>
                        <a-button @click="reset">
                            <template #icon>
                                <icon-refresh />
                            </template>
                            {{ $t('searchTable.form.reset') }}
                        </a-button>

                        <!-- <a-button @click="downloadXlsx">
                            <template #icon>
                                <icon-download />
                            </template>
                            {{ $t('searchTable.operation.download') }}
                        </a-button> -->

                    </a-space>
                </a-col>
            </a-row>
            <a-divider style="margin-top: 0" />

            <!-- 列表视图 -->
            <a-table row-key="id" :loading="loading" :pagination="pagination" :data="renderData" :bordered="{ cell: true }"
                @page-change="onPageChange" column-resizable>
                <template #columns>
                    <a-table-column :title="$t('commit.columns.orderNo')" dataIndex="rentalOrder.orderNo" :width="250" />
                    <a-table-column :title="$t('commit.columns.carId')" dataIndex="rentalCars.carId" :width="150" />
                    <a-table-column :title="$t('commit.columns.phone')" dataIndex="rentalUser.phone" :width="150" />
                    <a-table-column :title="$t('commit.columns.companyName')" dataIndex="rentalCompany.companyName" :width="200" />
                    <a-table-column :title="$t('commit.columns.car.color')" dataIndex="rentalCarModels.color"
                        :width="100" />

                    <a-table-column :title="$t('commit.columns.car.model')" dataIndex="rentalCarModels.model"
                        :width="100" />
                    <a-table-column :title="$t('commit.columns.car.price')" dataIndex="rentalOrder.totalPrice"
                        :width="120" />
                    <a-table-column :title="$t('commit.columns.car.payPrice')" dataIndex="rentalOrder.payablePrice"
                        :width="130" />

                    <a-table-column :title="$t('commit.columns.car.createdTime')" data-index="rentalOrder.createdTime"
                        :width="180">
                        <template #cell="{ record }">
                            {{ formatSomeDate(record.rentalOrder.createdTime) }}
                        </template>
                    </a-table-column>



                    <a-table-column :title="$t('commit.columns.order.status')" data-index="rentalOrder" :width="105">
                        <template #cell="{ record }">
                            <span v-if="record.rentalOrder.orderStatus == 0" class="circle"></span>
                            <span v-else-if="record.rentalOrder.orderStatus == 1" class="circle"
                                style="background-color:rgb(var(--green-5))"></span>
                            <span v-else-if="record.rentalOrder.orderStatus == -1" class="circle"
                                style="background-color:rgb(var(--orange-5))"></span>
                            <span v-else-if="record.rentalOrder.orderStatus == -2" class="circle"
                                style="background-color:rgb(var(--red-5))"></span>
                            {{ $t(`commit.form.order.status.${record.rentalOrder.orderStatus}`) }}
                        </template>
                    </a-table-column>



                    <a-table-column fixed="right" :title="$t('searchTable.columns.operations')" data-index="operations"
                        :width="220">
                        <template #cell="{ record }">
                            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                                <a-button size="small" type="outline" @click="redirtInfo(record.authId)"
                                    v-if="record.authId">
                                    详情
                                </a-button>
                                <a-button type="outline" status="warning" size="small" v-if="record.status != -1"
                                    @click="update_order_status = true; new_status = record.rentalOrder.orderStatus; order_id = record.rentalOrder.orderId;order_no = record.rentalOrder.orderNo; old_status = record.rentalOrder.orderStatus">
                                    修改
                                </a-button>
                                <a-button size="small" type="outline" status="danger"
                                    @click="visible = true; order_id = record.rentalOrder.orderId;order_no = record.rentalOrder.orderNo">
                                    删除
                                </a-button>
                                <!-- 删除订单弹窗 -->
                                <a-modal v-model:visible="visible" @ok="deleteOrder()" @cancel="">
                                    <template #title>
                                        删除订单
                                    </template>
                                    <div>确认要删除订单：{{ order_no }}吗？</div>
                                </a-modal>
                                <!-- 修改订单状态弹窗 -->
                                <a-modal v-model:visible="update_order_status" title="修改订单状态"
                                    @ok="updateOrderStatus(order_no, new_status,)">
                                    <a-descriptions :column="{ xs: 1, md: 2 }">
                                        <a-descriptions-item label="订单号">
                                            <a-tag>{{ order_no }}</a-tag>
                                        </a-descriptions-item>
                                        <a-descriptions-item label="当前状态">
                                            <a-tag :color="getStatusTagColor(old_status)">
                                                {{ $t(`commit.form.order.status.${old_status}`) }}
                                            </a-tag>
                                        </a-descriptions-item>
                                        <a-descriptions-item label="新状态">
                                            <a-radio-group size="large" v-model="new_status">
                                                <a-radio :value="1">已支付</a-radio>
                                                <a-radio :value="0">待支付</a-radio>
                                                <a-radio :value="-1">已取消</a-radio>
                                            </a-radio-group>
                                        </a-descriptions-item>
                                    </a-descriptions>
                                </a-modal>
                            </div>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>

        <a-modal v-model:visible="exportConfirmVisible" @ok="exportConfirm">
            <template #title>
                数据导出确认
            </template>
            <div>
                当前共有 {{ pagination.total }} 条数据, 是否继续？
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { Notification } from '@arco-design/web-vue';
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { queryPolicyList, deleteOrderById, PolicyRecord, updateStatusOrderById, downloadXlsxFile, queryOrdersPresetList } from '@/api/list';
import { Options } from '@/types/global';
import { getRoles } from '@/utils/auth';

// 生成检索条件对象
const generateFormModel = () => {
    return {
        orderNo: '',
        phone:'',
        companyName:'',
        createdTime: ''
    };
};

export default defineComponent({
    setup() {
        const visible = ref(false);
        const update_order_status = ref(false);
        const new_status = ref(-1);
        const old_status = ref(-1);
        const order_id = ref();
        const order_no = ref();
        const auth_id = ref('');
        const openDrawer = ref(false);
        const roles = getRoles();
        const { loading, setLoading } = useLoading(true);
        const { t } = useI18n();
        const renderData = ref<PolicyRecord[]>([]);
        const formModel = ref(generateFormModel());
        const timePicker = ref<Date[]>([]);
        const redirtInfo = (authId: any) => {
            auth_id.value = authId;
            openDrawer.value = true;
        };
        const formatSomeDate = (date: string | number | Date) => {
            if (!date) return '';
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            return new Date(date).toLocaleDateString(undefined, options);
        };


        const pagination = ref({
            // 页码
            current: 1,
            // 每页数量
            pageSize: 10,
            // 总条数
            total: 0,

            showTotal: true,
        })

        const deleteOrder = async () => {
            await deleteOrderById(order_id.value);
            await fetchData();
        };

        const setFormRangTime = (dateString: string[] = []) => {
            formModel.value.startTime = dateString[0];
            formModel.value.endTime = dateString[1];
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

        const updateOrderStatus = async (orderNo: string, status: number) => {
            const statusOrder = await updateStatusOrderById(orderNo, status);
            if (statusOrder.data.data == 1) {
                Notification.success({
                    title: '更新成功',
                    content: `订单:${orderNo}状态更新成功`,
                    duration: 3000,
                });
            }
            fetchData();

        };

        const downloadXlsx = () => {
            exportConfirmVisible.value = true;
        }

        const exportConfirm = async () => {
            const pageSize = 100;
            let currentPage = 1;
            let allData: any[] = [];

            // 限制一次性最多下载1w数据
            while (currentPage < 100) {
                const res = await queryPolicyList({ ...formModel.value, page: currentPage, size: pageSize } as any);
                const data = res.data.data;

                if (data.length === 0) {
                    break;
                }
                allData = allData.concat(data);

                if (data.length < pageSize) {
                    break;
                }
                currentPage++;
            }
            downloadXlsxFile(allData);
        }

        const contentTypeOptions = computed<Options[]>(() => [
            {
                label: t('searchTable.form.contentType.img'),
                value: 'img',
            },
            {
                label: t('searchTable.form.contentType.horizontalVideo'),
                value: 'horizontalVideo',
            },
            {
                label: t('searchTable.form.contentType.verticalVideo'),
                value: 'verticalVideo',
            },
        ]);
        const filterTypeOptions = computed<Options[]>(() => [
            {
                label: t('searchTable.form.statusType.all'),
                value: '',
            },
            {
                label: t('searchTable.form.statusType.waitStatus'),
                value: '0',
            },
            {
                label: t('searchTable.form.statusType.over'),
                value: '1',
            },
            {
                label: t('searchTable.form.statusType.commitError'),
                value: '-1',
            },
            {
                label: t('searchTable.form.statusType.cancel'),
                value: '-2',
            },
        ]);
        const filterActivateOptions = computed<Options[]>(() => [
            {
                label: t('searchTable.form.statusType.all'),
                value: '',
            },
            {
                label: t('commit.form.activate.0'),
                value: '0',
            },
            {
                label: t('commit.form.activate.1'),
                value: '1',
            },
        ]);
        const filterRechargeOptions = computed<Options[]>(() => [
            {
                label: t('searchTable.form.statusType.all'),
                value: '',
            },
            {
                label: t('commit.form.recharge.0'),
                value: '0',
            },
            {
                label: t('commit.form.recharge.1'),
                value: '1',
            },
        ]);

        const channelParams = (roles: string) => {
            const options: Options[] = [
                {
                    label: t('searchTable.form.statusType.all'),
                    value: '',
                },
            ];
            if (roles.includes('dada')) {
                options.push({
                    label: t('commit.form.channel.dada'),
                    value: 'dada',
                });
            }

            if (roles.includes('shunfeng')) {
                options.push(
                    {
                        label: t('commit.form.channel.yibangke'),
                        value: 'yibangke',
                    },
                    {
                        label: t('commit.form.channel.shunfeng'),
                        value: 'shunfeng',
                    }
                );
            }

            if (options.length == 2) { // 达达不显示渠道筛选
                return []
            }

            return options;
        };

        const filterChannelOptions = computed<Options[]>(() => channelParams(roles ? roles : ''));

        const handleCancel = async () => {
            openDrawer.value = false;
            await fetchData();
        }

        const statusOptions = computed<Options[]>(() => [
            {
                label: t('searchTable.form.status.online'),
                value: 'online',
            },
            {
                label: t('searchTable.form.status.offline'),
                value: 'offline',
            },
        ]);

        // 列表查询函数
        const fetchData = async (extraParams: any = {}) => {
            setLoading(true);
            try {
                const res = await queryOrdersPresetList({
                    ...formModel.value,
                    page: pagination.value.current,
                    ...extraParams,
                    
                });
                const result = res.data.data.records;
                result?.map((el: { rentalOrder: any; }) => {
                    el.rentalOrder.payablePrice =  el.rentalOrder.payablePrice/100;
                    el.rentalOrder.totalPrice =  el.rentalOrder.totalPrice/100;
                    console.log(el);
                    
                })
                renderData.value = res.data.data.records;
                console.log(renderData.value);
                // renderData.value = (res.data.data || []).map(x => {
                // 	// 处理一下 激活进度数据
                // 	const changeList = x.changeList || []
                // 	const lastChangeItem = changeList[changeList.length - 1]
                // 	if (lastChangeItem) {
                // 		x.preogress = {
                // 			name: t('order.status.' + lastChangeItem.status),
                // 			color: (lastChangeItem.status == 302 || lastChangeItem.status == 1035) ? '--green-5' : '--gray-5'
                // 		}
                // 	} else {
                // 		x.preogress = {
                // 			name: '暂无',
                // 		}
                // 	}
                // 	return x;
                // });
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
            loading,
            search,
            timePicker,
            visible,
            onPageChange,
            renderData,
            formModel,
            order_id,
            auth_id,
            openDrawer,
            reset,
            formatSomeDate,
            setFormRangTime,
            getStatusTagColor,
            updateOrderStatus,
            redirtInfo,
            update_order_status,
            deleteOrder,
            downloadXlsx,
            new_status,
            old_status,
            contentTypeOptions,
            filterTypeOptions,
            statusOptions,
            exportConfirmVisible,
            exportConfirm,
            handleCancel,
            filterActivateOptions,
            filterRechargeOptions,
            filterChannelOptions,
            // 分页对象
            pagination,
            order_no
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