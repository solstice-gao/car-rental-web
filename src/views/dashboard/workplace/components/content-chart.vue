<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: 0 }" :body-style="{
      paddingTop: '20px',
    }" :title="$t('workplace.contentData')">
      <template #extra>
        <!-- <a-link>{{ $t('workplace.viewMore') }}</a-link> -->
        <a-radio-group type="button" size="mini" v-for="(data, key) in statusMap" :key="key" v-model="commitStatus" :default-value="commitStatus" @change ="renderData">
          <a-radio :value="key">{{data}}</a-radio>
        </a-radio-group>
      </template>
      <Chart height="289px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { graphic } from 'echarts';
import useLoading from '@/hooks/loading';
import { queryCommitData, ContentDataRecord } from '@/api/dashboard';
import useChartOption from '@/hooks/chart-option';
import { ToolTipFormatterParams } from '@/types/echarts';
import { AnyObject } from '@/types/global';
import dayjs from 'dayjs';
import { successResponseWrap } from '@/utils/setup-mock';

function graphicFactory(side: AnyObject) {
  return {
    type: 'text',
    bottom: '8',
    ...side,
    style: {
      text: '',
      textAlign: 'center',
      fill: '#4E5969',
      fontSize: 12,
    },
  };
}
export default defineComponent({
  setup() {
    const { loading, setLoading } = useLoading(true);
    const xAxis = ref<string[]>([]);
    const chartsData = ref<number[]>([]);
    const negativeData = ref<number[]>([]);
    const commitStatus = ref("0");
    const graphicElements = ref([
      graphicFactory({ left: '2.6%' }),
      graphicFactory({ right: 0 }),
    ]);
    const statusMap: any = {
	  '0': '待处理',
	  '-1': '提交失败'
  }
    const { chartOption } = useChartOption(() => {
      return {
        grid: {
          left: '2.6%',
          right: '0',
          top: '10',
          bottom: '30',
        },
        xAxis: {
          type: 'category',
          offset: 2,
          data: xAxis.value,
          boundaryGap: false,
          axisLabel: {
            color: '#4E5969',
            formatter(value: number, idx: number) {
              if (idx === 0) return '';
              if (idx === xAxis.value.length - 1) return '';
              return `${value}`;
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            interval: (idx: number) => {
              if (idx === 0) return false;
              if (idx === xAxis.value.length - 1) return false;
              return true;
            },
            lineStyle: {
              color: '#E5E8EF',
            },
          },
          axisPointer: {
            show: true,
            lineStyle: {
              color: '#23ADFF',
              width: 2,
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          // axisLabel: {
          //   formatter(value: any, idx: number) {
          //     // if (idx === 0) return value;
          //     return value;
          //   },
          // },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#E5E8EF',
            },
          },
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            const [firstElement] = params as ToolTipFormatterParams[];
            return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            <div class="content-panel"><span>提交数量</span><span class="tooltip-value">${(
                Number(firstElement.value)
              ).toLocaleString()}</span></div>
          </div>`;
          },
          className: 'echarts-tooltip-diy',
        },
        graphic: {
          elements: graphicElements.value,
        },
        series: [
          {
            data: chartsData.value,
            type: 'line',
            smooth: true,
            // symbol: 'circle',
            symbolSize: 12,
            emphasis: {
              focus: 'series',
              itemStyle: {
                borderWidth: 2,
              },
            },
            lineStyle: {
              width: 3,
              color: new graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: 'rgba(30, 231, 255, 1)',
                },
                {
                  offset: 0.5,
                  color: 'rgba(36, 154, 255, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(111, 66, 251, 1)',
                },
              ]),
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(17, 126, 255, 0.16)',
                },
                {
                  offset: 1,
                  color: 'rgba(17, 128, 255, 0)',
                },
              ]),
            },
          },

        ],
      };
    });
    const getLineData = (data: string[], dateArray: string[]) => {
      return new Array(dateArray.length).fill(0).map((el, idx) => ({
        x: dateArray[idx],
        y: data[idx],
      }));
    };

    const renderData = async(data:any) =>{
        console.log(data);
        await fetchData(data);
    }

    const fetchData = async (status:number = 0) => {
      setLoading(true);
      try {
        const commitData = (await queryCommitData()).data.data;
        console.log(status);
        let presetData: string[] = [];
        let dateArray: string[] = [];
        let negativePresetData: string[] = [];
        let negativeDateArray: string[] = [];
        presetData = [];
        dateArray = [];

        commitData.map((el, idx) => {
          if (el.status == status) {
            presetData.push(el.cnt);
            dateArray.push(el.t);
          }
        });

        console.log(presetData);
        // dayjs()
        //       .day(idx)
        //       .format('YYYY-MM-DD')
        // const getLineData = () => {
        //   return new Array(dateArray.length).fill(0).map((el, idx) => ({
        //     x: dateArray[idx],
        //     y: presetData[idx],
        //   }));
        // };

        // const { data: chartData } = successResponseWrap([...getLineData()]);

        const { data: positiveChartData } = successResponseWrap([...getLineData(presetData, dateArray)]);
        const { data: negativeChartData } = successResponseWrap([...getLineData(negativePresetData, negativeDateArray)]);

        xAxis.value = [];
        chartsData.value = [];
        let count = 0;
        positiveChartData.forEach((el: ContentDataRecord, idx: number) => {
          xAxis.value.push(el.x);
          chartsData.value.push(el.y);
          if (idx === 0) {
            graphicElements.value[0].style.text = el.x;
          }
          if (idx === positiveChartData.length - 1) {
            graphicElements.value[1].style.text = el.x;
          }
          count++;
        });

        xAxis.value = xAxis.value.slice(-7);
        chartsData.value = chartsData.value.slice(-7);


        negativeChartData.forEach((el: ContentDataRecord) => {
          negativeData.value.push(el.y);
        });

      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return {
      loading,
      chartOption,
      renderData,
      statusMap,
      commitStatus
    };
  },
});
</script>

<style scoped lang="less"></style>
