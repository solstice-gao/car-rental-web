<template>
	<router-view />
</template>

<script lang="ts">
	import { defineComponent } from 'vue';

	export default defineComponent({
		setup() {
			document.body.removeAttribute('arco-theme');
		},
	});
</script>

<style scoped lang="less">
	.container {
		padding: 0 20px 20px 20px;
	}

	.operations {
		display: flex;
	}
</style>