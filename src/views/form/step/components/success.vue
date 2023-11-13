<template>
  <div class="success-wrap">
    <a-result
      status="success"
      :title="$t('stepForm.success.title')"
      :subtitle="$t('stepForm.success.subTitle')"
    />
    <!-- <a-space :size="16">
      <a-button key="view" type="primary">
        {{ $t('stepForm.button.view') }}
      </a-button>
      <a-button key="again" type="secondary" @click="oneMore">
        {{ $t('stepForm.button.again') }}
      </a-button>
    </a-space> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['changeStep'],
  setup(props, ctx) {
    const oneMore = () => {
      ctx.emit('changeStep', 1);
    };
    return {
      oneMore,
    };
  },
});
</script>

<style scoped lang="less">
.success-wrap {
  text-align: center;
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
