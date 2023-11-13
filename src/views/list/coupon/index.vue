<template>
    <div class="container">
        <Breadcrumb :items="['menu.list.coupon', 'menu.list.coupon.list']" />
        <a-card class="general-card" :title="$t('menu.list.coupon.list')">
            <a-row>
                <a-col :flex="1">
                    <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
                        label-align="left">
                        <a-row :gutter="16">
                            <a-col :span="8">
                                <a-form-item field="title" label="关键字">
                                    <a-input v-model="formModel.title" placeholder="请输入标题/ID" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="timePicker" label="时间范围">
                                    <a-range-picker style="width: 500px" @change="setFormRangTime" v-model="timePicker"
                                        format="YYYY-MM-DD" value-format="x" />
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

                        <a-button type="primary" @click="add" status="success">
                            <template #icon>
                                <icon-add />
                            </template>
                            {{ $t('searchTable.form.add') }}
                        </a-button>

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
                    <a-table-column title="优惠券ID" dataIndex="couponId" :width="150" />
                    <a-table-column title="优惠券NO" dataIndex="couponCode" :width="150" />
                    <a-table-column title="标题" dataIndex="title" :width="150" />
                    <a-table-column title="描述" dataIndex="description" :width="200" />
                    <a-table-column title="类型" dataIndex="discountType" :width="120" />
                    <a-table-column title="优惠金额" dataIndex="discountValue" :width="100" />
                    <a-table-column title="最小使用金额" dataIndex="minimumPurchase" :width="100" />
                    <a-table-column title="最大优惠金额" dataIndex="maximumDiscount" :width="100" />
                    <a-table-column title="优惠券开始时间" dataIndex="startDate" :width="180">
                        <template #cell="{ record }">
                            {{ formatSomeDate(record.startDate) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="优惠券过期时间" dataIndex="endDate" :width="180">
                        <template #cell="{ record }">
                            {{ formatSomeDate(record.endDate) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="创建时间" dataIndex="createdAt" :width="180">
                        <template #cell="{ record }">
                            {{ formatSomeDate(record.createdAt) }}
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
                                    @click="update_order_status = true; form = record">
                                    修改
                                </a-button>
                                <a-button size="small" type="outline" status="danger"
                                    @click="visible = true; couponId = record.couponId;">
                                    删除
                                </a-button>
                                <!-- 删除订单弹窗 -->
                                <a-modal v-model:visible="visible" @ok="deleteCoupon()" @cancel="">
                                    <template #title>
                                        删除优惠券
                                    </template>
                                    <div>确认要删除优惠券：{{ couponId }}吗？</div>
                                </a-modal>
                                <!-- 修改订单状态弹窗 -->
                                <a-modal v-model:visible="update_order_status" title="修改订单状态"
                                    @ok="updateCoupon(order_no, new_status,)">
                                    <a-form :model="form">
                                        <a-form-item field="couponCode" label="优惠券ID" :rules="{ required: true }">
                                            <a-input v-model="form.couponId" :disabled="true" />
                                        </a-form-item>
                                        <a-form-item field="title" label="优惠券标题" :rules="{ required: true }">
                                            <a-input v-model="form.title" />
                                        </a-form-item>
                                        <a-form-item field="description" label="优惠券描述" :rules="{ required: true }">
                                            <a-input v-model="form.description" />
                                        </a-form-item>
                                        <a-form-item field="discountValue" label="优惠金额" :rules="{ required: true }">
                                            <a-input-number :min=0 v-model="form.discountValue" />
                                        </a-form-item>

                                        <a-form-item field="minimumPurchase" label="最小使用金额" :rules="{ required: true }">
                                            <a-input-number :min=form.discountValue + 1 v-model="form.minimumPurchase" />
                                        </a-form-item>

                                        <a-form-item field="maximumDiscount" label="最大优惠金额" :rules="{ required: true }">
                                            <a-input-number :min=0 :max=form.discountValue v-model="form.maximumDiscount" />
                                        </a-form-item>

                                        <a-form-item field="startDate" label="有效期" :rules="{ required: true }">
                                            <a-range-picker @change="onChange" style="width: 254px; marginBottom: 20px;"
                                                value-format="x" />
                                        </a-form-item>

                                    </a-form>
                                </a-modal>
                            </div>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>

        <a-modal v-model:visible="visibleAdd" title="新增优惠券" @before-ok="handleBeforeOk" width="600px">
            <a-form :model="form">
                <a-form-item field="couponCode" label="优惠券NO" :rules="{ required: true }">
                    <a-input v-model="form.couponCode" />
                </a-form-item>
                <a-form-item field="title" label="优惠券标题" :rules="{ required: true }">
                    <a-input v-model="form.title" />
                </a-form-item>
                <a-form-item field="description" label="优惠券描述" :rules="{ required: true }">
                    <a-input v-model="form.description" />
                </a-form-item>
                <a-form-item field="discountValue" label="优惠金额" :rules="{ required: true }">
                    <a-input-number :min=0 v-model="form.discountValue" />
                </a-form-item>

                <a-form-item field="minimumPurchase" label="最小使用金额" :rules="{ required: true }">
                    <a-input-number :min=form.discountValue + 1 v-model="form.minimumPurchase" />
                </a-form-item>

                <a-form-item field="maximumDiscount" label="最大优惠金额" :rules="{ required: true }">
                    <a-input-number :min=0 :max=form.discountValue v-model="form.maximumDiscount" />
                </a-form-item>

                <a-form-item field="startDate" label="有效期" :rules="{ required: true }">
                    <a-range-picker @change="onChange" style="width: 254px; marginBottom: 20px;" value-format="x" />
                </a-form-item>

            </a-form>
        </a-modal>

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
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { addCoupon, deleteCouponById, PolicyRecord, updateStatusOrderById, downloadXlsxFile, queryCouponList } from '@/api/list';
import { Options } from '@/types/global';
import { getRoles } from '@/utils/auth';

// 生成检索条件对象
const generateFormModel = () => {
    return {
        // 关键词
        title: '',
        // 状态
        status: '0',
        // 开始时间
        startDate: '',
        // 结束时间
        endDate: '',
        // 充值状态
        recharge: '',
        // 激活状态
        activate: '',
        // 渠道
        channel: '',
    };
};

export default defineComponent({
    setup() {
        const visible = ref(false);
        const visibleAdd = ref(false);
        const update_order_status = ref(false);
        const new_status = ref(-1);
        const old_status = ref(-1);
        const order_id = ref();
        const couponId = ref();
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


        const onChange = (data: any) => {
            form.value.startDate = data[0];
            form.value.endDate = data[1];
        };

        const add = () => {
            visibleAdd.value = true;
        };

        const handleBeforeOk = async (done: any) => {
            await addCoupon(form.value);
        };

        const form = ref({
            couponCode: "",
            couponId: "",
            title: "",
            description: "",
            discountType: "全店通用",
            discountValue: 0.0,
            minimumPurchase: 0.0,
            maximumDiscount: 0.0,
            startDate: 0,
            endDate: 0,
        });
        const pagination = ref({
            // 页码
            current: 1,
            // 每页数量
            pageSize: 10,
            // 总条数
            total: 0,
            showTotal: true,
        })

        const deleteCoupon = async () => {
            await deleteCouponById(couponId.value);
            await fetchData();
        };

        const setFormRangTime = (dateString: string[] = []) => {
            formModel.value.startDate = dateString[0];
            formModel.value.endDate = dateString[1];
        }


        const updateCoupon = async (orderNo: string, status: number) => {
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



        // 列表查询函数
        const fetchData = async (extraParams: any = {}) => {
            setLoading(true);
            try {
                const res = await queryCouponList({
                    rentalCoupons: { ...formModel.value },
                    page: pagination.value.current,
                    ...extraParams,

                });
                renderData.value = res.data.data.records;


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
            fetchData(formModel.value);
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
            form,
            handleBeforeOk,
            add,
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
            updateCoupon,
            redirtInfo,
            update_order_status,
            deleteCoupon,
            new_status,
            old_status,
            exportConfirmVisible,
            // 分页对象
            pagination,
            order_no,
            visibleAdd,
            onChange,
            couponId
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