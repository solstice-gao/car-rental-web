<template>

  <a-card :loading="loading">
  <!-- <div class="container" :loading="loading"> -->
    <Breadcrumb :items="['menu.commit', 'menu.commit.info']" />
    <a-row class="wrapper" >
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded" style="margin-top: 10px;">
          <a-tab-pane key="1" :title="$t('userSetting.tab.userInformation')">
            <a-descriptions  :column="{ xs: 2, md: 2, lg: 2 }" v-if="userInfo">
              <a-descriptions-item label="姓名" v-if="userInfo.deliveryName">
                <a-tag>{{ userInfo.deliveryName }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="年龄" v-if="userInfo.age">
                <a-tag>{{ userInfo.age }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="手机号" v-if="userInfo.deliveryPhone">
                <a-tag>{{ userInfo.deliveryPhone }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="身份证号" v-if="userInfo.idCardNumber">
                <a-tag>{{ userInfo.idCardNumber }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="地址" v-if="userInfo.deliveryAddress">
                <a-tag>{{ userInfo.deliveryAddress }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="选择手机号" v-if="userInfo.chooseNumber">
                <a-tag>{{ userInfo.chooseNumber }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="归属地省份" v-if="userInfo.chooseNumberProvince">
                <a-tag>{{ userInfo.chooseNumberProvince }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="归属地城市" v-if="userInfo.chooseNumberCity">
                <a-tag>{{ userInfo.chooseNumberCity }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="订单号" v-if="userInfo.orderId">
                <a-tag>{{ userInfo.orderId }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="产品编码" v-if="userInfo.productCode">
                <a-tag>{{ userInfo.productCode }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="充值状态" v-if="userInfo.recharge != null">
                <a-tag v-if="userInfo.recharge == 1" color="green">  {{ $t(`commit.form.recharge.${userInfo.recharge}`) }}</a-tag>
                <a-tag v-else color="red">  {{ $t(`commit.form.recharge.${userInfo.recharge}`) }}</a-tag>

              </a-descriptions-item>
              
              <a-descriptions-item label="激活状态" v-if="userInfo.activate">
                <a-tag v-if="userInfo.activate == 1" color="green"> {{ $t(`commit.form.activate.${userInfo.activate || 0}`) }}</a-tag>
                <a-tag v-else color="red"> {{ $t(`commit.form.activate.${userInfo.activate || 0}`) }}</a-tag>
               
              </a-descriptions-item>
              <a-descriptions-item label="渠道" v-if="userInfo.productCode">
                <a-tag>{{ userInfo.channel }}</a-tag>
              </a-descriptions-item>
            </a-descriptions>



          </a-tab-pane>
        </a-tabs>
      </a-col>

      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded" style="margin-top: 30px;">
          <a-tab-pane key="1" :title="$t('userSetting.tab.orderInformation')">
            <a-timeline>
              <a-timeline-item v-for="(record, index) in changeList" :key="index" :label="record.time">
                {{ $t('order.status.' + record.status) }} <p style="color: rgb(var(--orange-5));">{{ record.statusDesc }}</p> 
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded" style="margin-top: 30px;">
          <a-tab-pane key="1" :title="$t('userSetting.tab.basicInformation')">
            <a-descriptions title="快递信息" :column="{ xs: 1, md: 3, lg: 4 }" v-if="wlinfo">
              <a-descriptions-item label="服务商" v-if="wlinfo.com">
                <a-tag>{{ wlinfo.com }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="快递单号" v-if="wlinfo.nu">
                <a-tag>{{ wlinfo.nu }}</a-tag>
              </a-descriptions-item>

            </a-descriptions>
            <div v-else style="color: gray; margin-bottom: 20px;">暂无物流信息</div>
            <a-timeline :reverse="true">
              <a-timeline-item v-for="record in wlxx" :key="record.ftime" :label="record.ftime">
                {{ record.context }}
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
</a-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref,defineProps } from 'vue';
import { useRoute } from 'vue-router';
import UserPanel from './components/user-panel.vue';
import BasicInformation from './components/basic-information.vue';
import SecuritySettings from './components/security-settings.vue';
import Certification from './components/certification.vue';
import { CommitParams, getCommitInfo } from '@/api/list';

export default defineComponent({
  components: {
    UserPanel,
    BasicInformation,
    SecuritySettings,
    Certification,
  },
  props:{
    authId:{
      type: String,
    }
  },
  setup(props) {
    let params = defineProps(["authId"]);
    const data: any = [];
    const route = useRoute()
    let wlxx = ref({});
    let userInfo = ref({});
    let wlinfo = ref({});
    let changeList = ref({});
    let loading = ref(true);
    onMounted(async () => {
      // authId = route.params.authId as string;
      const authId = props.authId;
      if(authId){
        fetchData({ id: authId })
      }
    });

    const fetchData = async (
      params: CommitParams = { id: 'authId' }
    ) => {
      // setLoading(true);
      try {
        const res = await getCommitInfo(params);
        let _item = res.data.data;
        let shipmentRecords = _item.shipmentRecords;
        wlinfo.value = shipmentRecords
        userInfo.value = _item;
        console.log(userInfo.value)
        wlxx.value = shipmentRecords && shipmentRecords.data;
        changeList.value = [{
          time: _item.time,
          status: 0,
          updateTime: Date.now(),
        }].concat(_item.changeList)
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        loading.value = false;
      }
    };




    return {
      fetchData,
      wlxx,
      loading,
      userInfo,
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
  padding: 40px 0 0 20px;
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
