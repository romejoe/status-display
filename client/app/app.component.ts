import { Component, inject } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true
})
export class AppComponent {

  // } implements AfterViewChecked {
  //
  // constructor(public auth: AuthService,
  //             private changeDetector: ChangeDetectorRef) { }
  //
  // // This fixes: https://github.com/DavideViolante/Angular-Full-Stack/issues/105
  // ngAfterViewChecked(): void {
  //   this.changeDetector.detectChanges();
  // }

  http = inject(HttpClient);

  message = "Hello Angular!";
  message2 = toSignal(
    this.http.get('/api/hello').pipe(map((res: any) => {
      return res.message;
    })), {
      initialValue: 'Loading...',
    }
  );

}
