<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <template #title>
        {{ $t('workplace.categoriesPercent') }}
      </template>
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts">
import { defineComponent ,ref} from 'vue';
import useLoading from '@/hooks/loading';
import useChartOption from '@/hooks/chart-option';

export default defineComponent({
  props:{
      commit:{
        type: Promise<any[]>
      }
  },
  setup(props) {
    const { loading } = useLoading();
    const monthCommitTotal = ref(0);
    const successCommitTotal = ref(0);
    const failsCommitTotal = ref(0);
    const fetchData = async ()=>{
      const resp = await props.commit;
      resp?.forEach(data => {
        monthCommitTotal.value += parseInt(data.cnt);
        if (data.status == 0) {
          successCommitTotal.value += parseInt(data.cnt);
        }
        if (data.status == -1) {
          failsCommitTotal.value += parseInt(data.cnt);
        }
      });  
    };

    fetchData();
    
    

    const { chartOption } = useChartOption((isDark) => {
      return {
        legend: {
          left: 'center',
          data: ['提交成功', '提交失败'],
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          textStyle: {
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderWidth: 0,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
        },
        graphic: {
          elements: [
            {
              type: 'text',
              left: 'center',
              top: '40%',
              style: {
                text: '本月提交总量',
                textAlign: 'center',
                fill: isDark ? '#ffffffb3' : '#4E5969',
                fontSize: 14,
              },
            },
            {
              type: 'text',
              left: 'center',
              top: '50%',
              style: {
                text: monthCommitTotal.value,
                textAlign: 'center',
                fill: isDark ? '#ffffffb3' : '#1D2129',
                fontSize: 16,
                fontWeight: 500,
              },
            },
          ],
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            label: {
              formatter: '{d}%',
              fontSize: 14,
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
            },
            itemStyle: {
              borderColor: isDark ? '#232324' : '#fff',
              borderWidth: 1,
            },
            data: [
              {
                value: [successCommitTotal.value],
                name: '提交成功',
                itemStyle: {
                  color: isDark ? '#3D72F6' : '#249EFF',
                },
              },
              {
                value: [failsCommitTotal.value],
                name: '提交失败',
                itemStyle: {
                  color: isDark ? '#A079DC' : '#313CA9',
                },
              },
              // {
              //   value: [445694],
              //   name: '视频类',
              //   itemStyle: {
              //     color: isDark ? '#6CAAF5' : '#21CCFF',
              //   },
              // },
            ],
          },
        ],
      };
    });
    return {
      loading,
      chartOption,
      monthCommitTotal,
      successCommitTotal,
      failsCommitTotal
    };
  },
});
</script>

<style scoped lang="less"></style>
