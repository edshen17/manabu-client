<script lang="ts">
import Vue from 'vue';
import { Line } from 'vue-chartjs';

export default Vue.extend({
  name: 'LineChart',
  components: {},
  extends: Line,
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    (this as any).renderChart(this.chartData, this.options);
  },
});
</script>
