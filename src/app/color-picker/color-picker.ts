import {
    Component, Input, ElementRef, AfterViewInit, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.html',
    styleUrls: ['./color-picker.css']
})
export class ColorPickerComponent implements AfterViewInit {

    @ViewChild('colorBlock') public canvasColorBlock: ElementRef;
    @ViewChild('colorStrip') public canvasColorStrip: ElementRef;

    @Input() public colorBlockWidth = 150;
    @Input() public colorStripWidth = 30;
    @Input() public height = 150;
    colorLabel = 'red';
    rgbaColor = 'rgba(255,0,0,1)';
    private cxColorBlock: CanvasRenderingContext2D;
    private cxColorStrip: CanvasRenderingContext2D;

    public ngAfterViewInit() {
        const canvasColorBlockEl: HTMLCanvasElement = this.canvasColorBlock.nativeElement;
        const canvasColorStripEl: HTMLCanvasElement = this.canvasColorStrip.nativeElement;
        this.cxColorBlock = canvasColorBlockEl.getContext('2d');

        canvasColorBlockEl.width = this.colorBlockWidth;
        canvasColorBlockEl.height = this.height;
        this.cxColorBlock.rect(0, 0, this.colorBlockWidth, this.height);
       this. fillGradient();

        this.cxColorStrip.rect(0, 0, this.colorStripWidth, this.height);
        let grd1 = this.cxColorStrip.createLinearGradient(0, 0, 0, this.height);
        grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
        grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
        this.cxColorStrip.fillStyle = grd1;
        this.cxColorStrip.fill();

        this.captureColorBlocEvents(canvasColorBlockEl);
        this.captureColorStripEvents(canvasColorStripEl);
    }

    private captureColorBlocEvents(canvasColorBlockEl: HTMLCanvasElement) {
        Observable
            .fromEvent(canvasColorBlockEl, 'mousedown')
            .switchMap((e) => {
                return Observable
                    .fromEvent(canvasColorBlockEl, 'mousemove')
                    .takeUntil(Observable.fromEvent(canvasColorBlockEl, 'mouseup'))
                    .pairwise()
            })
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                const rect = canvasColorBlockEl.getBoundingClientRect();

                const pos = {
                    x: res[0].offsetX // - rect.left,
                    , y: res[0].offsetY //- rect.top
                };

                // const currentPos = {
                //     x: res[1].offsetX - rect.left,
                //     y: res[1].offsetY - rect.top
                // };

                this.changeColor(pos);
            });
    }
    private captureColorStripEvents(canvasColorStripEl: HTMLCanvasElement) {
        Observable
            .fromEvent(canvasColorStripEl, 'mousedown')
            .switchMap((e) => {
                return Observable
                    .fromEvent(canvasColorStripEl, 'mousemove')
                    .takeUntil(Observable.fromEvent(canvasColorStripEl, 'mouseup'))
                    .pairwise()
            })
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                const rect = canvasColorStripEl.getBoundingClientRect();

                const pos = {
                    x: res[0].offsetX // - rect.left,
                    , y: res[0].offsetY //- rect.top
                };

                // const currentPos = {
                //     x: res[1].offsetX - rect.left,
                //     y: res[1].offsetY - rect.top
                // };
                let imageData = this.cxColorStrip.getImageData(pos.x, pos.y, 1, 1).data;
                this.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
                this.fillGradient();
            });
    }

    // private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    //     if (!this.cxColorBlock) { return; }

    //     this.cxColorBlock.beginPath();

    //     if (prevPos) {
    //         this.cxColorBlock.moveTo(prevPos.x, prevPos.y); // from
    //         this.cxColorBlock.lineTo(currentPos.x, currentPos.y);
    //         this.cxColorBlock.stroke();
    //     }
    // }
    private changeColor(pos: { x: number, y: number }) {

        let imageData = this.cxColorBlock.getImageData(pos.x, pos.y, 1, 1).data;
        let rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
        this.colorLabel = rgbaColor;
    }
    private fillGradient() {
        this.cxColorBlock.fillStyle = this.rgbaColor;
        this.cxColorBlock.fillRect(0, 0, this.colorBlockWidth, this.height);

        let grdWhite = this.cxColorStrip.createLinearGradient(0, 0, this.colorBlockWidth, 0);
        grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
        grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
        this.cxColorBlock.fillStyle = grdWhite;
        this.cxColorBlock.fillRect(0, 0, this.colorBlockWidth, this.height);

        let grdBlack = this.cxColorStrip.createLinearGradient(0, 0, 0, this.height);
        grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
        grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
        this.cxColorBlock.fillStyle = grdBlack;
        this.cxColorBlock.fillRect(0, 0, this.colorBlockWidth, this.height);
    }


}
