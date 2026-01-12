import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { trigger, state, style, transition, animate } from '@angular/animations';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', [
        animate(500)
      ]),
    ])
    ,
    trigger('slideIn', [
      state('void', style({
        transform: 'translateX(-100%)'
      })),
      transition(':enter', [
        animate('300ms ease-out', style({
          transform: 'translateX(0)'
        }))
      ])
    ])
  ]
})
export class AppComponent {
  constructor() {}
  
}
