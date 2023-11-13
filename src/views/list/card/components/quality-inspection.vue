<template>
  <div class="list-wrap" v-for="items in renderData" key="items.companyId" style="margin-bottom: 50px;">
    <a-typography-title class="block-title" :heading="6" v-if="items.carList.length > 0">
      <h3>{{ items.companyName }}</h3>
    </a-typography-title>
    <a-row class="list-row" :gutter="24">
      <a-col v-for="item in items.carList" :key="item.carId" :span="6" class="list-col">
        <CardWrap :carInfo="item" :company-info="items" :refresh="refreshData" :status="status"
          :open-txt="$t('cardList.content.inspection')" :close-txt="$t('cardList.content.delete')" :show-tag="false">
          <a-descriptions style="margin-top: 16px" layout="inline-horizontal" :column="2" />
          <template #skeleton>
            <a-skeleton :animation="true">
              <a-skeleton-line :widths="['50%', '50%', '100%', '40%']" :rows="4" />
              <a-skeleton-line :widths="['40%']" :rows="1" />
            </a-skeleton>

          </template>
        </CardWrap>

      </a-col>
    </a-row>




  </div>
</template>

<script lang="ts">
import emitter from '@/utils/bus'
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { queryGroupByCompany, ResGroupByCompany, ServiceRecord } from '@/api/list';
import { sendRequest } from '@/hooks/request';
import CarInfo from './car-info.vue'
import CardWrap from './card-wrap.vue';

export default defineComponent({
  components: {
    CardWrap,
    CarInfo
  },
  props: {
    status: {
      type: Number,
      require: true,
    }
  },

  setup(props) {
    const openDrawer = ref(false);
    const router = useRouter();
    let renderData = ref<ResGroupByCompany[]>([]);
    
  
    
    const fetchData = async () => {
      try {
        console.log(props.status);

        const res = await queryGroupByCompany(props.status);
        renderData.value = res.data.data;
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };
  
    onMounted(() => {
      fetchData();
      emitter.on('refresh',(obj:any)=>{
        fetchData();
      })
    });

    const refreshData = async () => {
      await fetchData();
    }

    console.log(renderData.value);


    const redirtToAdd = () => {
      router.push({ name: 'step' });
    }
    return {
      renderData,
      refreshData,
      redirtToAdd,
      openDrawer
    };
  },
});
</script>

<style scoped lang="less">
.card-wrap {
  height: 100%;
  transition: all 0.3s;
  border: 1px solid var(--color-neutral-3);

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.arco-card-meta-description) {
    color: rgb(var(--gray-6));

    .arco-descriptions-item-label-inline {
      font-weight: normal;
      font-size: 12px;
      color: rgb(var(--gray-6));
    }

    .arco-descriptions-item-value-inline {
      color: rgb(var(--gray-8));
    }
  }
}

.empty-wrap {
  height: 200px;
  border-radius: 4px;

  :deep(.arco-card) {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    .arco-result-title {
      color: rgb(var(--gray-6));
    }
  }
}
</style>
