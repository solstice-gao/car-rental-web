<template>
  <div class="card-wrap">

    <a-card :bordered="false" hoverable>
      <a-space align="start">
        <a-avatar v-if="carInfo.imageUrl" :size="150" shape="square" style="margin-right: 8px; background-color: #626aea">
          <img :src="carInfo.imageUrl" />
        </a-avatar>
        <a-card-meta>
          <template #title>
            <a-typography-text style="margin-right: 10px">
              {{ carInfo.carDescTitle }}
            </a-typography-text>
          </template>
          <template #description>
            {{ carInfo.carDesc }}
            <slot></slot>
          </template>
        </a-card-meta>
      </a-space>
      <template #actions>
        <div>
          <a-space>
            <a-button @click="openDrawer = true">
              详情
            </a-button>
            <a-button type="primary" @click="offTheShelfCar(status)" v-if="status === 1">
              下架
            </a-button>

            <a-button type="primary" @click="offTheShelfCar(status)" v-if="status === -1">
              上架
            </a-button>
          </a-space>
        </div>
      </template>
    </a-card>
    <a-drawer :width="500" :visible="openDrawer" @cancel="openDrawer = false" @ok="openDrawer = true">
      <CarInfo :car-data="carInfo" :company-info="companyInfo"></CarInfo>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import emitter from '@/utils/bus'
import { Notification } from '@arco-design/web-vue';
import { defineComponent, ref } from 'vue';
import CarInfo from './car-info.vue'
import { offTheShelf } from '@/api/list'

export default defineComponent({

  components: {
    CarInfo
  },
  props: {
    carInfo: {
      type: Object,
      require: true,
      default: {}
    },
    status: {
      type: Number,
      require: true,
    },
    companyInfo: {
      type: Object,
      require: true,
      default: {}
    },
    expiresTagText: {
      type: String,
      default: '',
    },
    refresh: {
      type: Function,
      default: '',
    }
  },
  setup(props) {
    const openDrawer = ref(false);

    const status = props.status;


    const formatSomeDate = (date: string | number | Date) => {
      if (!date) return '';
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    };

    const offTheShelfCar = async (status: number) => {
      const data = await offTheShelf(status, props.carInfo.carId);
      emitter.emit("refresh","refresh");
      Notification.success({
        title: status == 1 ? '下架' : '上架',
        content: `车辆${status == 1 ? '下架' : '上架'}成功`,
        duration: 3000,
      });
      props.refresh();
    };

    return {
      open,
      status,
      offTheShelfCar,
      openDrawer,
      formatSomeDate
    };
  },
});
</script>

<style scoped lang="less">
.card-wrap {
  height: 100%;
  transition: all 0.3s;
  border: 1px solid var(--color-neutral-3);
  border-radius: 4px;

  &:hover {
    transform: translateY(-4px);
    // box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  }

  :deep(.arco-card) {
    height: 100%;
    border-radius: 4px;

    .arco-card-body {
      height: 100%;

      .arco-space {
        width: 100%;
        height: 100%;

        .arco-space-item {
          height: 100%;

          &:last-child {
            flex: 1;
          }

          .arco-card-meta {
            height: 100%;
            display: flex;
            flex-flow: column;

            .arco-card-meta-content {
              flex: 1;

              .arco-card-meta-description {
                margin-top: 8px;
                color: rgb(var(--gray-6));
                line-height: 20px;
                font-size: 12px;
              }
            }

            .arco-card-meta-footer {
              margin-top: 0;
            }
          }
        }
      }
    }
  }

  :deep(.arco-card-meta-title) {
    display: flex;
    align-items: center;

    // To prevent the shaking
    line-height: 28px;
  }

  :deep(.arco-skeleton-line) {
    &:last-child {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
