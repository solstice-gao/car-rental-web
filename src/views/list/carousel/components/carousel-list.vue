<template>
    <div class="list-wrap" v-for="items in renderData" key="items.companyId" style="margin-bottom: 50px;">
      <a-typography-title class="block-title" :heading="1">
        <h3>{{ items.city }}</h3>
        <a-upload :action="HOST + '/rentalCarousel/add'" :headers="uploadHeaders" :data="{city: items.city}" :show-file-list="false" @success="fetchData"/>
      </a-typography-title>
      <a-row class="list-row" :gutter="24">
        <a-col v-for="item in items.rentalCarousels" :key="item.carouselId" :span="6" class="list-col">
          <!-- <img :src="item.imageUrl"  style="width:400px;"/> -->
          <a-image
    width="200px"
    :src="item.imageUrl"
  />
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { queryGroupByCompany, ResRentalCarousel, queryCarouselGroupByCity } from '@/api/list';
  import { HOST } from '@/api/interceptor'
  import { getClient, getToken } from '@/utils/auth';

  
  export default defineComponent({
    components: {
    },
    setup() {

      const openDrawer = ref(false);
  
      const router = useRouter();
      let renderData = ref<ResRentalCarousel[]>([]);
  
      const fetchData = async () => {
        try {
          const res = await queryCarouselGroupByCity(1);
          renderData.value = res.data.data;
        } catch (error) {
          console.error('获取数据失败:', error);
        }
      };
      onMounted(() => {
        fetchData();
      });
  
  
  
      console.log(renderData.value);
  
  
      const redirtToAdd = () => {
        router.push({ name: 'step' });
      }
      return {
		  // 上传相关的信息
		  HOST,
		  uploadHeaders: {
			client: getClient(),
			satoken: getToken(),
		  },
        renderData,
        redirtToAdd,
        fetchData,
        openDrawer
      };
    },
  });
  </script>
  
  <style scoped lang="less">
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
  