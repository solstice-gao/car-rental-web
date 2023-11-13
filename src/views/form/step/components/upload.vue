<template>
    <a-space direction="vertical" :style="{ width: '100%' }">
        <a-form :model="form" layout="horizontal">
            <a-form-item field="name" label="车辆头图">
                <a-upload :action="HOST + '/tenant_car/add-image'" :headers="uploadHeaders" :data="imageUrl" :fileList="file ? [file] : []"
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

            <a-form-item field="name" label="车辆详情大图">
                <a-upload list-type="picture-card" :action="HOST + '/tenant_car/add-image'" :headers="uploadHeaders" :data="imageTitle"
                    :default-file-list="fileList1" image-preview />
            </a-form-item>
            <a-form-item field="name" label="车辆详情图">
                <a-upload list-type="picture-card" :action="HOST + '/tenant_car/add-image'" :headers="uploadHeaders" :data="imageDesc"
                    :default-file-list="fileList2" image-preview />
            </a-form-item>

            <a-form-item>
                <a-button type="primary" @click="goPrev">
                    {{ $t('stepForm.button.prev') }}
                </a-button>
                <a-button type="primary" @click="onNextClick" style="margin-left: 20px;">
                    {{ $t('stepForm.button.next') }}
                </a-button>
            </a-form-item>

        </a-form>
    </a-space>
</template>
  
<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon';
import { Message, Modal } from '@arco-design/web-vue';
import { putShelves } from '@/api/form'
import { HOST } from '@/api/interceptor'
import { getClient, getToken } from '@/utils/auth';

export default defineComponent({
    emits: ['changeStep'],
    props: {
        carId: {
            type: String,
            required: true
        }
    },
    setup(props, ctx) {
        onMounted(() => {
            console.log(props.carId);
        });
        const imageUrl = {
            type: "0",
            carId: props.carId
        };

        const imageTitle = {
            type: "1",
            carId: props.carId
        }

        const imageDesc = {
            type: "2",
            carId: props.carId
        }

        const oneMore = () => {
            ctx.emit('changeStep', 1);
        };
        const file = ref();

        const form = reactive({
            name: '',
            post: '',
            isRead: false,
        });
        const test = {
            name: "test",
        }
        const fileList1: any[] = [

        ];

        const fileList2: any[] = [

        ];

        const onNextClick = async () => {

            const data = await putShelves({ carId: props.carId });
            console.log(data.data);
            

            ctx.emit('changeStep', 4);
            // if (!file && !fileList1 && !fileList2) {
            //     ctx.emit('changeStep', 'submit', {});
            // } else {
            //     Message.error({
            //         content: "请将车辆图片补充完整",
            //         duration: 5 * 1000,
            //     });

            // }
        };
        const goPrev = () => {
            ctx.emit('changeStep', 'backward');
        };

        const onChange = (_: any, currentFile: any) => {
            file.value = {
                ...currentFile,
                // url: URL.createObjectURL(currentFile.file),
            };
        };
        const onProgress = (currentFile: any) => {
            file.value = currentFile;
        };
        return {
			// 上传相关的信息
			HOST,
			uploadHeaders: {
				client: getClient(),
				satoken: getToken(),
			},
            oneMore,
            file,
            onChange,
            onProgress,
            form,
            fileList1,
            fileList2,
            test,
            imageUrl,
            imageTitle,
            imageDesc,
            onNextClick,
            goPrev
        };
    },
});
</script>
  
<style scoped lang="less">
.success-wrap {
    text-align: center;
}

.arco-upload-picture-card {
    width: 120px;
    height: 120px;
}

:deep(.arco-result) {
    padding-top: 0;
}

.details-wrapper {
    width: 895px;
    margin-top: 54px;
    padding: 20px;
    text-align: left;
    background-color: var(--color-fill-2);
}
</style>
  