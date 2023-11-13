<template>
    <div class="container">
      <Breadcrumb :items="['menu.show', 'menu.list.carousel']" />
      <a-row :gutter="20" align="stretch">
        <a-col :span="24">
          <a-card class="general-card" :title="$t('menu.list.carousel')">
            <a-row justify="space-between">
              <!-- <a-col :span="6" class="list-col">
                <div class="card-wrap empty-wrap">
                  <a-card :bordered="false" hoverable @click="redirtToAdd">
                    <a-result :status="null" :title="$t('cardList.content.action')">
                      <template #icon>
                        <icon-plus style="font-size: 20px" />
                      </template>
                    </a-result>
                  </a-card>
                </div>
              </a-col> -->
              <a-col :span="24">
                <a-tabs :default-active-tab="1" type="rounded">
                  <!-- <a-tab-pane key="1" :title="$t('cardList.tab.title.all')">
                    <QualityInspection />
                    <TheService />
                    <RulesPreset />
                  </a-tab-pane> -->
                  <a-tab-pane key="1" title="已发布">
                    <CarouselList />
                  </a-tab-pane>
                  <!-- <a-tab-pane key="2" title="未发布">
  
                  </a-tab-pane> -->

                </a-tabs>
  
                
              </a-col>

              <!-- <a-button type="primary" style="width: 240px; position: absolute; top: 60px; right: 20px" @click="redirtToAdd">
                <template #icon>
                  <icon-plus/>
                </template>
                <template #default>新增轮播</template>
              </a-button> -->
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import CarouselList from './components/carousel-list.vue'
  
  export default defineComponent({
    components: {
        CarouselList
    },
    setup() {
  
      const router = useRouter();
  
      const redirtToAdd = () => {
        router.push({ name: 'add-carousel'});
      };
      
      return {
        redirtToAdd
      }
    },
  });
  </script>
  
  <style scoped lang="less">
  .container {
    :deep(.arco-list-content) {
      overflow-x: hidden;
    }
  
    :deep(.arco-card-meta-title) {
      font-size: 14px;
    }
  }
  :deep(.arco-list-col) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  :deep(.arco-list-item) {
    width: 33%;
  }
  
  :deep(.block-title) {
    margin: 0 0 12px 0;
    font-size: 14px;
  }
  :deep(.list-wrap) {
    // min-height: 140px;
    .list-row {
      align-items: stretch;
      .list-col {
        margin-bottom: 16px;
      }
    }
    :deep(.arco-space) {
      width: 100%;
      .arco-space-item {
        &:last-child {
          flex: 1;
        }
      }
    }
  }
  </style>
  