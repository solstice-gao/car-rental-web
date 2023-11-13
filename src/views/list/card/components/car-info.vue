<template>
  <a-card :loading="loading">
    <a-row class="wrapper">
      <a-row>

        <a-col :span="12">
          <a-tag>车辆图片</a-tag>
        </a-col>
        <a-col :span="12">
          <a-image width="100" :src="carData.imageUrl" />
        </a-col>
      </a-row>
      <a-col :span="24">
        <a-descriptions :column="{ xs: 1, md: 1, lg: 1 }" v-if="carData">
          <a-descriptions-item label="车辆ID" v-if="carData.carId">
            <a-tag>{{ carData.carId }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="车辆标题" v-if="carData.carDescTitle">
            <a-tag>{{ carData.carDescTitle }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="车辆描述" v-if="carData.carDesc">
            <a-tag>{{ carData.carDesc }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="公司名称" v-if="carData.companyId">
            <a-tag>{{ companyInfo.companyName }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="车辆价格" v-if="carData.price">
            <a-tag color="red">¥ {{ carData.price }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="描述标题" v-if="carData.carDescTitle">
            <a-tag>{{ carData.carDescTitle }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="车辆发货地" v-if="carData.carSendFrom">
            <a-tag>{{ carData.carSendFrom }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="发货备注" v-if="carData.carSendMarktext">
            <a-tag>{{ carData.carSendMarktext }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="是否折扣" v-if="carData.discount">
            <a-tag v-if="carData.discount == 1" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="车牌号" v-if="carData.licensePlate">
            <a-tag>{{ carData.licensePlate }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="状态" v-if="carData.status">
            <a-tag v-if="carData.status == 1" color="green">{{ $t(`commit.carData.status.${carData.status || 0}`)
            }}</a-tag>
            <a-tag v-else color="red"> {{ $t(`commit.carData.status.${carData.status || 0}`) }}</a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="创建时间" v-if="carData.createdTime">
            <a-tag>{{ formatSomeDate(carData.createdTime) }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="更新时间" v-if="carData.updatedTime">
            <a-tag>{{ formatSomeDate(carData.updatedTime) }}</a-tag>
          </a-descriptions-item>

          <a-tabs>
            <a-tab-pane v-for="(model, index) of carData.carModels" :key="index" :title="model.model">
            <a-descriptions :column="{ xs: 1, md: 1, lg: 1 }">

              
              <a-descriptions-item label="首期费用" v-if="model.carInitialFee">
                <a-tag>{{ model.carInitialFee }}元</a-tag>
              </a-descriptions-item>
              
              <a-descriptions-item :label="$t('stepForm.form.label.carProcessingFee')" v-if="model.carProcessingFee">
                <a-tag>{{ model.carProcessingFee }}元</a-tag>
              </a-descriptions-item>

              <a-descriptions-item label="车辆使用费" v-if="model.carPrice">
                <a-tag>{{ model.carPrice }}元 / 月</a-tag>
              </a-descriptions-item>
              
              <a-descriptions-item :label="$t('stepForm.form.label.carBatteryFee')" v-if="model.carBatteryFee">
                <a-tag>{{ model.carBatteryFee }}元 / 月</a-tag>
              </a-descriptions-item>
              
              <a-descriptions-item :label="$t('stepForm.form.label.carInsuranceFee')" v-if="model.carInsuranceFee">
                <a-tag>{{ model.carInsuranceFee }}元 / 月</a-tag>
              </a-descriptions-item>
              

            </a-descriptions>


            </a-tab-pane>
          </a-tabs>


        </a-descriptions>
      </a-col>
    </a-row>
  </a-card>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, ref, defineProps } from 'vue';

import { CommitParams, getCommitInfo } from '@/api/list';

export default defineComponent({
  components: {
  },
  props: {
    carData: {
      type: Object,
      require: true,
      default: {}
    },
    companyInfo: {
      type: Object,
      require: true,
      default: {}
    }
  },
  setup(props) {
    let params = defineProps(["authId"]);
    const data: any = [];

    let wlxx = ref({});
    let wlinfo = ref({});
    let changeList = ref({});
    let loading = ref(false);
    const formatSomeDate = (date: string | number | Date) => {
      if (!date) return '';
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    };

    return {
      formatSomeDate,
      wlxx,
      loading,

      changeList,
      wlinfo,
      data
    };
  },
});
</script>
  
<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.wrapper {
  padding: 10px 0 0 0px;
  min-height: 580px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
  