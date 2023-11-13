<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="colors" 
    :label="$t('stepForm.form.label.car.color')"
    >
      <a-space wrap>
        <a-tag v-for="(tag, index) of tags" :key="tag" :closable="true" color="green" @close="handleRemove(tag)">
          {{ tag }}
        </a-tag>

        <a-input v-if="showInput" ref="inputRef" :style="{ width: '90px' }" size="mini" v-model.trim="inputVal"
          @keyup.enter="handleAdd" @blur="handleAdd" />
        <a-tag v-else :style="{
          width: '90px',
          backgroundColor: 'var(--color-fill-2)',
          border: '1px dashed var(--color-fill-3)',
          cursor: 'pointer',
        }" @click="handleEdit">
          <template #icon>
            <icon-plus />
          </template>
          添加颜色
        </a-tag>
      </a-space>
    </a-form-item>
    <a-form-item field="models" :label="$t('stepForm.form.label.car.model')"
    >
      <a-space wrap>
        <a-tag v-for="(tag, index) of models" :key="tag" :closable="true" color="cyan" @close="handleRemoveModel(tag)">
          {{ tag }}
        </a-tag>

        <a-input v-if="showInputModel" ref="inputRef" :style="{ width: '90px' }" size="mini" v-model.trim="inputVal"
          @keyup.enter="handleAddModel" @blur="handleAddModel" />
        <a-tag v-else :style="{
          width: '90px',
          backgroundColor: 'var(--color-fill-2)',
          border: '1px dashed var(--color-fill-3)',
          cursor: 'pointer',
        }" @click="handleEditModel">
          <template #icon>
            <icon-plus />
          </template>
          添加型号
        </a-tag>
      </a-space>
    </a-form-item>
    <a-tabs v-model="activeTab">
      <a-tab-pane v-for="(model, index) of models" :key="index" :title="model">
        <ColorModel :keyProp="index" @update-form-data="updateFormData"></ColorModel>
      </a-tab-pane>
    </a-tabs>

    <a-form-item>
      <a-button type="primary" @click="goPrev">
        {{ $t('stepForm.button.prev') }}
      </a-button>
      <a-button type="primary" @click="onNextClick" style="margin-left: 20px;">
        {{ $t('stepForm.button.next') }}
      </a-button>
    </a-form-item>

  </a-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { ChannelInfoModel,Price } from '@/api/form';
import ColorModel from './colormodel.vue'

export default defineComponent({
  components: {
    ColorModel
  },
  emits: ['changeStep'],
  setup(props, ctx) {
    const tags = ref(['红色', '白色', '黑色']);
    const models = ref(['基础型号']);
    const inputRef = ref(null);
    const showInput = ref(false);
    const showInputModel = ref(false);
    const inputVal = ref('');
    const activeTab = ref(0);



    const handleEditModel = () => {
      showInputModel.value = true;
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus();
        }
      });
    };

    const handleAddModel = () => {
      if (inputVal.value) {
        models.value.push(inputVal.value);
        inputVal.value = '';
      }
      showInputModel.value = false;
    };

    const handleRemoveModel = (key) => {
      models.value = models.value.filter((tag) => tag !== key);
    };


    const handleEdit = () => {
      showInput.value = true;
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus();
        }
      });
    };

    const handleAdd = () => {
      if (inputVal.value) {
        tags.value.push(inputVal.value);
        inputVal.value = '';
      }
      showInput.value = false;
    };

    const handleRemove = (key) => {
      tags.value = tags.value.filter((tag) => tag !== key);
    };
    const formRef = ref<FormInstance>();
    const formData = ref<ChannelInfoModel>({
      colors: tags,
      models: models,
      prices:new Map() ,
    });

    const prices = new Map<number, Price>();

    const updateFormData = (data:any) => {

      prices.set(data.key,data.value);
      const myArray = Array.from(prices.values());
      formData.value.prices = myArray;
    };


    const onNextClick = async () => {
      const res = await formRef.value?.validate();
      if (!res) {
        ctx.emit('changeStep', 'submit', { ...formData.value });
      }
    };
    const goPrev = () => {
      ctx.emit('changeStep', 'backward');
    };
    return {
      formData,
      formRef,
      onNextClick,
      goPrev,
      tags,
      inputRef,
      showInput,
      showInputModel,
      inputVal,
      handleEdit,
      handleAdd,
      handleRemove,
      handleEditModel,
      handleAddModel,
      handleRemoveModel,
      models,
      activeTab,
      updateFormData
    };
  },
});
</script>

<style scoped lang="less">
.container {
  .keep-margin {
    margin-bottom: 20px;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}

.steps {
  margin-bottom: 36px;
}

.form {
  width: 540px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
