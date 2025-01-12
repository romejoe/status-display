import { Component, inject } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { interval, map, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Graph1Component } from "./widgets/graph-1/graph-1.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    Graph1Component
  ],
  standalone: true
})
export class AppComponent {

  seriesA = [
    interval(1000).pipe(map((i) => i % 100)),
    interval(100).pipe(map((i) => i % 100)),
    of(0),
  ];
  seriesB = [
    // interval(100).pipe(map((i) => (50 + (Math.sin(i) * 30)) % 100)),
    of(75),
    of(0),
    of(0),
  ];


  http = inject(HttpClient);

  message = "Hello Angular!";
  message2 = toSignal(
    this.http.get('/api/hello').pipe(map((res: unknown) => {
      if (typeof res !== 'object') {
        return 'Error: Invalid response';
      }
      if (res === null) {
        return 'Error: Invalid response';
      }
      if (!('message' in res) || typeof res.message !== 'string') {
        return 'Error: Invalid response';
      }
      return res.message;
    })), {
      initialValue: 'Loading...',
    }
  );

}
