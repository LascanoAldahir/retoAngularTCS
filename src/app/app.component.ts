import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
/*import { ProductTableComponent } from './components/product-table/product-table.component';*/

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, HeaderComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'tcs1';
}
