<template>
    <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">

        <a-form-item field="carPrice" :label="$t('stepForm.form.label.carPrice')" :rules="[
            {
                required: true,
                message: '请输入车辆每月基础费用',
            },
        ]">
            <a-input-number :min="0" v-model="formData.carPrice" :placeholder="$t('stepForm.placeholder.price')"
                @change="emitFormData" />
        </a-form-item>
        <a-form-item field="carInitialFee" :label="$t('stepForm.form.label.carInitialFee')" :rules="[
            {
                required: true,
                message: '请输入车辆首期费用',
            },
        ]">
            <a-input-number :min="0" v-model="formData.carInitialFee"
                :placeholder="$t('stepForm.placeholder.carInitialFee')" @change="emitFormData" />
        </a-form-item>

        <a-form-item field="carProcessingFee" :label="$t('stepForm.form.label.carProcessingFee')" :rules="[
            {
                required: true,
                message: '请输入车辆办理费',
            },
        ]">
            <a-input-number :min="0" v-model="formData.carProcessingFee"
                :placeholder="$t('stepForm.placeholder.carProcessingFee')" @change="emitFormData" />
        </a-form-item>

        <a-form-item field="carBatteryFee" :label="$t('stepForm.form.label.carBatteryFee')" :rules="[
            {
                required: true,
                message: '请输入车辆电池费',
            },
        ]">
            <a-input-number :min="0" v-model="formData.carBatteryFee"
                :placeholder="$t('stepForm.placeholder.carBatteryFee')" @change="emitFormData" />
        </a-form-item>
        <a-form-item field="carInsuranceFee" :label="$t('stepForm.form.label.carInsuranceFee')" :rules="[
            {
                required: true,
                message: '请输入车辆保险费用',
            },
        ]">
            <a-input-number :min="0" v-model="formData.carInsuranceFee"
                :placeholder="$t('stepForm.placeholder.carInsuranceFee')" @change="emitFormData" />
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Price } from '../../../../api/form'
export default defineComponent({
    props: {
        keyProp: Number, // 父组件传递的 formData 对象
    },
    setup(props, ctx) {
        const formData = ref<Price>({
            carPrice: 0,
            carInitialFee: 0,
            carProcessingFee: 0,
            carBatteryFee: 0,
            carInsuranceFee: 0,
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