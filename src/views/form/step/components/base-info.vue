<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="carDesc" :label="$t('stepForm.form.label.carDesc')" :rules="[
      {
        required: true,
        message: '请输入车辆描述',
      },
    ]">
      <a-input v-model="formData.carDesc" :placeholder="$t('stepForm.placeholder.carDesc')" />
    </a-form-item>
    <a-form-item field="carDescTitle" :label="$t('stepForm.placeholder.carDescTitle')" :rules="[
      {
        required: true,
        message: '请输入车辆描述标题',
      },
    ]">
      <a-input v-model="formData.carDescTitle" :placeholder="$t('stepForm.placeholder.carDescTitle')" />
    </a-form-item>
    <a-form-item field="companyId" label="所属公司" :rules="[{ required: true, message: '请选择车辆所属公司' }]" feedback>
      <a-select v-model="formData.companyId" placeholder="请选择车辆所属公司" allow-search>
        <a-option v-for="company in companyList" :value="company.companyId">{{ company.companyName }}</a-option>
      </a-select>
    </a-form-item>

    <a-form-item field="carSendFrom" :label="$t('stepForm.placeholder.carSendFrom')" :rules="[
      {
        required: true,
        message: '请输入车辆发货地，例如：北京市',
      },
    ]">
      <a-input v-model="formData.carSendFrom" :placeholder="$t('stepForm.placeholder.carSendFrom')" />
    </a-form-item>


    <a-form-item field="carSendMarktext" :label="$t('stepForm.placeholder.carSendMarktext')" :rules="[
      {
        required: true,
        message: '请输入车辆发货注意事项，例如：仅支持自提',
      },
    ]">
      <a-input v-model="formData.carSendMarktext" :placeholder="$t('stepForm.placeholder.carSendMarktext')" />
    </a-form-item>

    <a-form-item field="price" :label="$t('stepForm.placeholder.price')" row-class="keep-margin" :rules="[
      {
        required: true,
        message: '请输入车辆价格',
      },
    ]">
      <a-input-number v-model="formData.price" :min="0" :placeholder="$t('stepForm.placeholder.price')" />
      <template #help>
        <span>{{ $t('stepForm.form.tip.promoteLink') }}</span>
      </template>
    </a-form-item>


    <a-tabs type="card-gutter" :editable="true" @add="handleAdd" @delete="handleDelete" show-add-button auto-switch
      default-active-key="1" v-model="activateKey">
      <a-tab-pane v-for="(item, index) of data" :key="item.key" :title="item.title" :closable="index >= 1">
        <AdressInfo :keyProp="item.key" @update-form-data="updateFormData" />
      </a-tab-pane>
    </a-tabs>

    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('stepForm.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { Notification } from '@arco-design/web-vue';
import { defineComponent, ref, onMounted } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { BaseInfoModel, getCompanyList } from '@/api/form';
import AdressInfo from './adress-info.vue'

let count = 1;
export default defineComponent({
  components: {
    AdressInfo
  },
  emits: ['changeStep'],
  setup(props, ctx) {
    const formRef = ref<FormInstance>();
    const formData = ref<BaseInfoModel>({
      carSendMarktext: '',
      price: 0,
      carDesc: '',
      companyId: '',
      carSendFrom: '',
      carDescTitle: '',
      adress:[]

    });

    const map = ref(new Map())

    const activateKey = ref(1);

    const activeTab = ref(['自提地址1']);

    const companyList = ref<any>([]);

    const updateFormData = (data: any) => {
      map.value.set(data.key, data.value);
      const myArray = Array.from(map.value.values());
      formData.value.adress = myArray;
    };

    const removeData = (key: any) => {
      map.value.delete(key);
      const myArray = Array.from(map.value.values());
      formData.value.adress = myArray;
    };

    onMounted(async () => {
      try {
        // 获取数据
        const data = await getCompanyLists();
        // 将获取到的数据赋值给 companyList 的 value
        companyList.value = data.data.data;
        console.log(companyList.value);

      } catch (error) {
        console.error(error);
      }
    });

    const getCompanyLists = async () => {
      return await getCompanyList();
    };

    const onNextClick = async () => {
      const res = await formRef.value?.validate();
      if (!res) {
        ctx.emit('changeStep', 'forward', { ...formData.value });
      }
    };

    const data = ref([
      {
        key: '1',
        title: '自提地址1',
      }
    ]);

    const handleAdd = () => {
      const number = ++count;
      data.value = data.value.concat({
        key: `${number}`,
        title: `自提地址 ${number}`,
      })
    };
    const handleDelete = (key: string) => {
      const list = data.value.filter(item => item.key !== key);

      removeData(key);
      if (list.length == 1) {
        activateKey.value = 1;
        console.log(activateKey.value);
      }
      if (list.length == 0) {
        Notification.error({
          title: '删除失败',
          content: `必须包含一个以上自提地址`,
          duration: 3000,
        });

      } else {
        data.value = list;
      }


    };


    return {
      data,
      handleAdd,
      handleDelete,
      activeTab,
      formData,
      formRef,
      activateKey,
      onNextClick,
      getCompanyLists,
      updateFormData,
      companyList
    };
  },
});
</script>

<style scoped lang="less">
.container {
  padding: 20px;

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
  width: 500px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
