<template>
    <div class="container">
        <Breadcrumb :items="['menu.form', 'menu.form.step']" />
        <a-form :model="form" layout="horizontal">
            <a-form-item field="name" label="车辆头图">
                <a-upload :action="HOST + '/tenant_car/add-image'" :headers="uploadHeaders" :fileList="file ? [file] : []"
                    :show-file-list="false" @change="onChange" @progress="onProgress">
                    <template #upload-button>
                        <div :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
                            }`">
                            <div class="arco-upload-list-picture custom-upload-avatar" v-if="file && file.url">
                                <img :src="file.url" />
                                <div class="arco-upload-list-picture-mask">
                                    <IconEdit />
                                </div>
                                <a-progress v-if="file.status === 'uploading' && file.percent < 100" :percent="file.percent"
                                    type="circle" size="mini" :style="{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        transform: 'translateX(-50%) translateY(-50%)',
                                    }" />
                            </div>
                            <div class="arco-upload-picture-card" v-else>
                                <div class="arco-upload-picture-card-text">
                                    <IconPlus />
                                    <div style="margin-top: 10px; font-weight: 600">Upload</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </a-upload>
            </a-form-item>
        </a-form>
    </div>
</template>
   
<script lang="ts">
import { defineComponent, ref } from 'vue';
import useLoading from '@/hooks/loading';
import {

    addColorModels,
    BaseInfoModel,
    ChannelInfoModel,
    UnitChannelModel,
} from '@/api/form';
import { HOST } from '@/api/interceptor'
import { getClient, getToken } from '@/utils/auth';

export default defineComponent({
    components: {

    },
    setup() {
        const file = ref();
        return {
			// 上传相关的信息
			HOST,
			uploadHeaders: {
				client: getClient(),
				satoken: getToken(),
			},
            file
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
  