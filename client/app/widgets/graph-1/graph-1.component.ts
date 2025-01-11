import { Component, computed, effect, ElementRef, viewChild } from '@angular/core';

import ApexCharts from 'apexcharts';
import { toSignal } from "@angular/core/rxjs-interop";
import { interval, map } from "rxjs";


@Component({
  selector: 'app-graph-1',
  standalone: true,
  imports: [],
  templateUrl: './graph-1.component.html',
  styleUrl: './graph-1.component.scss'
})
export class Graph1Component {
  graph1 = viewChild<ElementRef<HTMLDivElement>>('graph1');
  graph1Chart = computed(() => {
    const graph1 = this.graph1();
    if (!graph1) {

      return null;
    }
    const chart = new ApexCharts(graph1.nativeElement, {
      chart: {
        height: 110,
        width: 110,
        type: 'radialBar'
      },
      colors: ['#319A9B'],
      plotOptions: {

        radialBar: {
          startAngle: 0,
          endAngle: 180,
          hollow: {
            size: '50%',
          },
          track: {
            margin: 2

          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            }
          }
        }
      }
      // plotOptions: {
      //   radialBar: {
      //     dataLabels: {
      //       name: {
      //         fontSize: "22px"
      //       },
      //       value: {
      //         fontSize: "16px"
      //       },
      //       total: {
      //         show: true,
      //         label: "",
      //         formatter: () => {
      //           return "249";
      //         }
      //       }
      //     }
      //   }
      //
      // }

    });
    chart.render();
    return chart;
  });
  graph2 = viewChild<HTMLDivElement>('graph2');

  series1 = toSignal(interval(1000).pipe(map((i) => i % 100)), {
    initialValue: 0
  });
  series2 = toSignal(interval(100).pipe(map((i) => i % 100)), {
    initialValue: 0
  });
  series3 = toSignal(interval(100).pipe(map((i) => (50 + (Math.sin(i) * 30)) % 100)), {
    initialValue: 0
  });


  constructor() {
    effect(() => {
      const graph = this.graph1Chart();
      const seriesData = [
        this.series1(),
        this.series2(),
        this.series3()
      ];

      if (!graph) {
        return;
      }

      // graph.resetSeries();
      // graph.updateSeries([{
      //   data: seriesData
      // }]);
      graph.updateSeries(seriesData);


    });
  }
}
