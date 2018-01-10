import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Draw Board App';
  startX;
  StartY;
  ngOnInit(): void {
    // cast the canvas to fix bugs like
    // Uncaught TypeError: Cannot read property 'getContext' of null
    // or cannot read property 'getcontext' of undefined
    // or Property 'getContext' does not exist on type 'HTMLElement'
    // const canvas = <HTMLCanvasElement>document.getElementById('board');
    // const ctx = canvas.getContext('2d');
    // // this.drawRec(ctx);
    // // this.drawChart(ctx, canvas);
    // // this.drawChartSimpler(ctx);
    // this.drawArcTo(ctx);




  }
  drawRec(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(10, 50, 100, 50);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(35, 50, 100, 50);
  }
  drawArcTo(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(80, 50);
    // top right
    ctx.arcTo(210, 50, 210, 70, 20);
    // buttom right
    ctx.arcTo(210, 200, 160, 200, 20);
    // buttom left
    ctx.arcTo(60, 200, 60, 180, 20);
    // buttom right
    ctx.arcTo(60, 50, 100, 50, 20);
    ctx.stroke();

  }
  drawArch(ctx: CanvasRenderingContext2D, x, y) {
    ctx.fillStyle = 'navy';
    ctx.beginPath();

    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    ctx.strokeStyle = 'red';
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = 2;
    // ctx.strokeRect(35, 50, 100, 50);
  }
  drawChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const data = [100, 200, 150, 12, 122, 66, 80];
    const base = 800;
    let currX = 50;
    const width = 40;

    for (let i = 0; i < data.length; i++) {
      ctx.fillStyle = this.getColor();
      let h = canvas.height - data[i];
      ctx.fillRect(currX, h, width, data[i]);
      this.drawArch(ctx, currX + width / 2, h);


      currX += width + 10;
    }

  }
  drawChartSimpler(ctx: CanvasRenderingContext2D) {
    const data = [100, 200, 150, 12, 122, 66, 80];
    data.reverse();

    const base = 800;
    let currX = 5;
    const width = 40;
    ctx.translate(350, 400);
    ctx.rotate(1 * Math.PI);
    for (let i = 0; i < data.length; i++) {
      ctx.fillStyle = this.getColor();

      ctx.fillRect(currX, 0, width, data[i]);
      currX += width + 10;
    }

  }
  onMouseClick(event){
    console.log('onMouseClickevent', event);

  }
  OnMouseDraw(event) {
    console.log('event', event);
    console.log('event.x', event.screenX);
    console.log('event.y', event.screenY);
    const canvas = <HTMLCanvasElement>document.getElementById('board');
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(event.screenX, event.screenY);
    ctx.lineTo(event.screenX, event.screenY);
  
    ctx.stroke();
  }
  getColor() {
    return '#' + ((1 << 24) * Math.random() | 0).toString(16);
  }
}
