<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "LineChart",
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "500px",
    },
    height: {
      type: String,
      default: "350px",
    },
    average: {
      type: Array,
      required: true,
    },
    scores: {
      type: Array,
      required: true,
    },
    testname: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));

      this.chart.setOption({
        title: {
          text: "成绩折线图",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          formatter: (params) => {
            // 获取悬停的 x 轴值和对应 y 轴数据
            const xValue = params[0].name; // 当前 x 轴值（测试名称）
            const yValues = params.map((item) => ({
              name: item.seriesName,
              value: item.data,
            }));

            // 构造 tooltip 内容
            let tooltipContent = `<strong>测试: ${xValue}</strong><br/>`;
            yValues.forEach((item) => {
              tooltipContent += `${item.name}: ${item.value}<br/>`;
            });

            // 添加当前悬停点的 y 轴值
            tooltipContent += `<strong>悬停 Y 值: ${params[0].value}</strong><br/>`;
            return tooltipContent;
          },
        },
        legend: {
          data: ["平均分", "成绩"],
          top: "10%",
          right: "10%",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.testname,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "平均分",
            type: "line",
            data: this.average,
            smooth: true,
            itemStyle: {
              color: "rgb(137,189,27)",
            },
          },
          {
            name: "成绩",
            type: "line",
            data: this.scores,
            smooth: true,
            itemStyle: {
              color: "rgb(0,136,212)",
            },
          },
        ],
      });
    },
  },
};
</script>
