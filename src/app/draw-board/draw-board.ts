import {
  Component, Input, ElementRef, AfterViewInit, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-canvas',
  templateUrl: './draw-board.html',
  styleUrls: ['./draw-board.css']
})
export class DrawBoardComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = 800;
  @Input() public height = 400;
  font = [1, 2, 3, 4, 5, 8, 9, 10];
  imgageSrc;
  private cx: CanvasRenderingContext2D;

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    Observable
      .fromEvent(canvasEl, 'mousedown')
      .switchMap((e) => {
        return Observable
          .fromEvent(canvasEl, 'mousemove')
          .takeUntil(Observable.fromEvent(canvasEl, 'mouseup'))
          .pairwise()
      })
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        console.log(' res[0]', res[0]);

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
        console.log(' currentPos', currentPos);
        console.log(' prevPos', prevPos);

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
  onDrawImage(event) {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.imgageSrc = canvasEl.toDataURL();
    console.log('dataurl', this.imgageSrc);
  }
  onSelectFont(item) {
    console.log('item', item);
    this.cx.lineWidth = item;
  }
  onEraseDraw(event) {

    this.cx.strokeStyle = 'white';
  }
  onClearDraw(event) {

    this.cx.clearRect(0, 0, this.width, this.height);
  }

}
