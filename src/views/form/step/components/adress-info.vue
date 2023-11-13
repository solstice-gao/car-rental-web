<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">

    <a-form-item field="userName" :label="$t('stepForm.form.label.userName')" :rules="[
      {
        required: true,
        message: '请输入联系人名称',
      },
    ]">
      <a-input :min="0" v-model="formData.userName" placeholder="请输入联系人名称" @change="emitFormData" />
    </a-form-item>
    <a-form-item field="phone" :label="$t('stepForm.form.label.phone')" :rules="[
      {
        required: true,
        message: '请输入联系方式',
      },
    ]">
      <a-input :min="0" v-model="formData.phone" placeholder="请输入联系方式" @change="emitFormData" />
    </a-form-item>

    <a-form-item field="province" :label="$t('stepForm.form.label.province')" :rules="[
      {
        required: true,
        message: '请输入所在省',
      },
    ]">
      <a-input :min="0" v-model="formData.province" placeholder="请输入所在省" @change="emitFormData" />
    </a-form-item>

    <a-form-item field="city" :label="$t('stepForm.form.label.city')" :rules="[
      {
        required: true,
        message: '请输入所在市',
      },
    ]">
      <a-input :min="0" v-model="formData.city" placeholder="请输入所在区" @change="emitFormData" />
    </a-form-item>


    <a-form-item field="county" :label="$t('stepForm.form.label.county')" :rules="[
      {
        required: true,
        message: '请输入所在区',
      },
    ]">
      <a-input :min="0" v-model="formData.county" placeholder="请输入所在市" @change="emitFormData" />
    </a-form-item>

    <a-form-item field="street" :label="$t('stepForm.form.label.street')" :rules="[
      {
        required: true,
        message: '请输入所在街道/门牌号',
      },
    ]">
      <a-input :min="0" v-model="formData.street" placeholder="请输入所在街道/门牌号" @change="emitFormData" />
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Price, RentalCarAddress } from '../../../../api/form'
export default defineComponent({
  props: {
    keyProp: String, // 父组件传递的 formData 对象
  },
  setup(props, ctx) {
    const formData = ref<RentalCarAddress>({
      userName: '',
      phone: '',
      province: '',
      city: '',
      county: '',
      street: '',
    });


    const emitFormData = () => {
      console.log(props);

      // 触发自定义事件 'update-form-data'，并将新的值和字段名作为参数传递给父组件
      ctx.emit('update-form-data', { key: props.keyProp, value: formData.value });
    };

    return {
      formData,
      emitFormData
    }
  }
})
</script>