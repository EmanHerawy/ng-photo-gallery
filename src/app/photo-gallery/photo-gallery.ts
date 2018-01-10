import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';
@Component({
    selector: 'app-photo-gallery',
    templateUrl: './photo-gallery.html',
    styleUrls: ['./photo-gallery.css']
})

export class PhotoGalleryComponent implements OnInit, AfterViewInit, AfterViewChecked {

    @ViewChild('pic') public picCanvas: ElementRef;
    @ViewChild('lens') public lensCanvas: ElementRef;

    @Input() public width = 500;
    @Input() public height = 500;
    private imgSrc = '../../assets/20170410_185838.jpg';
    imageObj = new Image();
    private cxPic: CanvasRenderingContext2D;
    private cxLens: CanvasRenderingContext2D;
    @Input() public picList = [];
    @Output() public exportPic = new EventEmitter();
    constructor() { }

    ngOnInit() {
        this.imageObj.src = this.imgSrc;
    }
    ngAfterViewChecked(): void {

        this.setCanvasPic();


    }

    public ngAfterViewInit() {
        const imgEl: HTMLCanvasElement = this.picCanvas.nativeElement;
        this.cxPic = imgEl.getContext('2d');

        const lensEl: HTMLCanvasElement = this.lensCanvas.nativeElement;
        this.cxLens = lensEl.getContext('2d');

        imgEl.width = this.width;
        imgEl.height = this.height;
        lensEl.width = 50;
        lensEl.height = 50;

        this.captureEvents(imgEl);
    }
    private setCanvasPic() {

        Observable
            .fromEvent(this.imageObj, 'load').subscribe((e) => {
                this.cxPic.drawImage(this.imageObj, 0, 0, this.width, this.height);
            });
    }
    private captureEvents(imgEl: HTMLCanvasElement) {
        Observable
            .fromEvent(imgEl, 'mouseenter')
            .switchMap((e) => {
                return Observable
                    .fromEvent(imgEl, 'mousemove')
                    .takeUntil(Observable.fromEvent(imgEl, 'mouseleave'))
                    .pairwise()
            })
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                const rect = imgEl.getBoundingClientRect();
                const prevPos = {
                    x: res[0].clientX - rect.left,
                    y: res[0].clientY - rect.top
                };

                const currentPos = {
                    x: res[1].clientX - rect.left,
                    y: res[1].clientY - rect.top
                };

                this.drawOnCanvas(currentPos);
            });
    }

    private drawOnCanvas( currentPos: { x: number, y: number }) {

        let cropedImg = this.cxPic.getImageData(currentPos.x, currentPos.y, 50, 50);
        this.cxLens.putImageData(cropedImg, 0, 0);

    }
    onImageSelect(item) {
        this.imageObj.src = item;
        this.setCanvasPic();
    }
    onUploadPic(target): void {

        let fileList: FileList = target.files;
        if (fileList.length > 0) {
            let file = fileList[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            Observable
                .fromEvent(reader, 'load').subscribe((e) => {
                    this.picList.push(reader.result);
                    // if we need the data in based64/string formate
                    this.exportPic.emit(reader);
                    /**if you need to save it as file un comment these lines 
                     * 
                     *     let formData: FormData = new FormData();
                    formData.append('uploadFile', file, Math.random().toString(36).substring(2) + file.name);
                     */
                });

        }





    }
}