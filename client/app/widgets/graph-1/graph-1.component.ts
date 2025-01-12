import { Component, computed, effect, ElementRef, input, Signal, viewChild } from '@angular/core';

import ApexCharts from 'apexcharts';
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { combineLatest, Observable, of, switchMap } from "rxjs";

function watchSeries(series: Signal<Observable<number>[]>): Observable<number[]> {
  return toObservable(series).pipe(switchMap((seriesObs) => {
    return combineLatest(seriesObs);
  }));
}

const defaultSeriesSignalData = {
  initialValue: [0]
};

function toChart(graph$: Signal<ElementRef<HTMLDivElement> | undefined>) {
  return computed(() => {
    const graph = graph$();
    if (!graph) {
      return null;
    }
    const chart = new ApexCharts(graph.nativeElement, {
      series: [],
      chart: {
        height: 105,
        width: 105,
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
    });

    chart.render();
    return chart;
  });
}

@Component({
  selector: 'app-graph-1',
  standalone: true,
  imports: [],
  templateUrl: './graph-1.component.html',
  styleUrl: './graph-1.component.scss'
})
export class Graph1Component {

  leftGraphASeries = input<Observable<number>[]>([of(0)]);
  leftGraphBSeries = input<Observable<number>[]>([of(0)]);
  rightGraphASeries = input<Observable<number>[]>([of(0)]);
  rightGraphBSeries = input<Observable<number>[]>([of(0)]);

  seriesLeftA = toSignal(watchSeries(this.leftGraphASeries), defaultSeriesSignalData);
  seriesLeftB = toSignal(watchSeries(this.leftGraphBSeries), defaultSeriesSignalData);
  seriesRightA = toSignal(watchSeries(this.rightGraphASeries), defaultSeriesSignalData);
  seriesRightB = toSignal(watchSeries(this.rightGraphBSeries), defaultSeriesSignalData);


  graphLeftA = viewChild<ElementRef<HTMLDivElement>>('graphLeftA');
  graphLeftB = viewChild<ElementRef<HTMLDivElement>>('graphLeftB');

  graphRightA = viewChild<ElementRef<HTMLDivElement>>('graphRightA');
  graphRightB = viewChild<ElementRef<HTMLDivElement>>('graphRightB');

  graphLeftAChart = toChart(this.graphLeftA);
  graphLeftBChart = toChart(this.graphLeftB);

  graphRightAChart = toChart(this.graphRightA);
  graphRightBChart = toChart(this.graphRightB);



  constructor() {
    const plotSeries = (graph: Signal<ApexCharts|null>, series: Signal<number[]>) => {
      effect(() => {
        const chart = graph();
        const seriesData = series();

        chart?.updateSeries(seriesData);
      });
    };

    plotSeries(this.graphLeftAChart, this.seriesLeftA);
    plotSeries(this.graphLeftBChart, this.seriesLeftB);
    plotSeries(this.graphRightAChart, this.seriesRightA);
    plotSeries(this.graphRightBChart, this.seriesRightB);

  }
}
