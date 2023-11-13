<template>
  <a-col :span="24" class="panel">
    <a-row>
      <a-col class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar">
            <img alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image" />
          </a-avatar>
          <a-statistic :title="$t('qsk.month.commit')" :value="monthCommitTotal" :precision="0" :value-from="0" animation
            show-group-separator>
            <template #suffix>
              <span class="unit">次</span>
            </template>
          </a-statistic>
        </a-space>
      </a-col>
      <a-col class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar">
            <img alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image" />
          </a-avatar>
          <a-statistic title="今日提交次数" :value="todayCommitTotal" :value-from="0" animation show-group-separator>
            <template #suffix>
              <span class="unit">次</span>
            </template>
          </a-statistic>
        </a-space>
      </a-col>
      <a-col class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar">
            <img alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image" />
          </a-avatar>
          <a-statistic title="昨日提交次数" :value="yesterdayCommitTotal" :value-from="0" animation show-group-separator>
            <template #suffix>
              <span class="unit">次</span>
            </template>
          </a-statistic>
        </a-space>
      </a-col>
      <a-col class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar">
            <img alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image" />
          </a-avatar>
          <a-statistic title="增长率" :value="growthRate" :precision="1" :value-from="0" animation>
            <template #suffix v-if="growthRate > 0"> % <icon-caret-up class="up-icon" /> </template>
            <template #suffix v-else> % <icon-caret-down class="up-icon" /> </template>
          </a-statistic>
        </a-space>
      </a-col>
    </a-row>
    <a-divider class="panel-border" />
  </a-col>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { queryCommitData } from '@/api/dashboard';
import { number } from 'echarts';

export default defineComponent({
  setup() {
    const monthCommitTotal = ref(0);
    const yesterdayCommitTotal = ref(0);
    const todayCommitTotal = ref(0);
    const growthRate = ref(0);

    const queryMonthData = async () => {
      const resp = await queryCommitData()

      resp.data.data.forEach(data => {
        monthCommitTotal.value += parseInt(data.cnt);
        if (data.t == getCurrentDate()) {
          todayCommitTotal.value += parseInt(data.cnt);
        }

        if (data.t == getDate(-1000 * 60 * 60 * 24)) {
          yesterdayCommitTotal.value += parseInt(data.cnt);
        }

      });

      growthRate.value = calculateGrowthRate(yesterdayCommitTotal.value, todayCommitTotal.value)


      console.log(getDate(-1000 * 60 * 60 * 24));
    };

    const getCurrentDate = () => {
      const date = new Date();
      console.log(date.getTime())
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const getDate = (time: number) => {
      const date = new Date();
      date.setTime(date.getTime() + time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const calculateGrowthRate = (yesterdayData: number, todayData: number): number => {
      const growthRate = ((todayData - yesterdayData) / yesterdayData) * 100;
      return Number(growthRate.toFixed(2));
    }



    queryMonthData();

    return {
      queryMonthData,
      monthCommitTotal,
      todayCommitTotal,
      yesterdayCommitTotal,
      growthRate
    };
  }
});
</script>

<style lang="less" scoped>
.arco-col.panel {
  margin-bottom: 0;
  padding: 16px 20px 0 20px;
}

.panel-col {
  padding-left: 10px;
  border-right: 1px solid rgb(var(--gray-2));

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    border-right: none;
  }
}

.col-avatar {
  margin-right: 1px;
  background-color: var(--color-fill-2);
}

.up-icon {
  color: rgb(var(--red-6));
}

.unit {
  margin-left: 8px;
  color: rgb(var(--gray-8));
  font-size: 12px;
}
</style>
