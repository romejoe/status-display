import { Component, inject } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true
})
export class AppComponent {


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
