<template>
  <div class="container">
    <Breadcrumb :items="['menu.form', 'menu.form.step']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          {{ $t('stepForm.step.title') }}
        </template>
        <div class="wrapper">
          <a-steps v-model:current="step" style="width: 680px" line-less class="steps">
            <a-step :description="$t('stepForm.step.subTitle.baseInfo')">
              {{ $t('stepForm.step.title.baseInfo') }}
            </a-step>
            <a-step :description="$t('stepForm.step.subTitle.channel')">
              {{ $t('stepForm.step.title.channel') }}
            </a-step>
            <a-step :description="$t('stepForm.step.subTitle.images')">
              {{ $t('stepForm.step.title.image') }}
            </a-step>
            <a-step :description="$t('stepForm.step.subTitle.finish')">
              {{ $t('stepForm.step.title.finish') }}
            </a-step>
          </a-steps>
          <keep-alive>
            
            <BaseInfo v-if="step === 1" @change-step="changeStep" />
            <ChannelInfo v-else-if="step === 2" @change-step="changeStep" />
            <Upload v-else-if="step === 3" @change-step="changeStep" :carId="carId" />
            <Success v-else-if="step === 4" @change-step="changeStep" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>
<!-- <BaseInfo v-if="step === 1" @change-step="changeStep" />
            <ChannelInfo v-else-if="step === 2" @change-step="changeStep" />
            <Upload v-else-if="step === 3" @change-step="changeStep" :carId="carId" />
            <Success v-else-if="step === 4" @change-step="changeStep" /> -->
 
<script lang="ts">
import { defineComponent, ref } from 'vue';
import useLoading from '@/hooks/loading';
import {

  addColorModels,
  BaseInfoModel,
  ChannelInfoModel,
  UnitChannelModel,
} from '@/api/form';
import BaseInfo from './components/base-info.vue';
import ChannelInfo from './components/channel-info.vue';
import Success from './components/success.vue';
import Upload from './components/upload.vue'
import AdressInfo from './components/adress-info.vue';

export default defineComponent({
  components: {
    BaseInfo,
    ChannelInfo,
    Success,
    Upload
  },
  setup() {
    const { loading, setLoading } = useLoading(false);
    const step = ref(1);
    const submitModel = ref<UnitChannelModel>({} as UnitChannelModel);
    const carId = ref<string>('');
    const submitForm = async () => {
      setLoading(true);
      try {
        const data = await addColorModels(submitModel.value); // The moack api default success
        carId.value = data.data.data.carId;
        step.value = 3;
        submitModel.value = {} as UnitChannelModel; // init
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    };
    const changeStep = (
      direction: string | number,
      model: BaseInfoModel | ChannelInfoModel
    ) => {
      if (typeof direction === 'number') {
        step.value = direction;
        return;
      }

      if (direction === 'forward' || direction === 'submit') {
        submitModel.value = {
          ...submitModel.value,
          ...model,
        };
        if (direction === 'submit') {
          submitForm();
          return;
        }
        step.value += 1;
      } else if (direction === 'backward') {
        step.value -= 1;
      }
    };
    return {
      loading,
      step,
      changeStep,
      carId
    };
  },
});
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);

  :deep(.arco-form) {
    .arco-form-item {
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

.steps {
  margin-bottom: 76px;
}
</style>
