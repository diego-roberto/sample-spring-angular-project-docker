import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile } from 'ng2-file-drop';
import { MdSnackBar } from '@angular/material';

import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { Image } from 'angular-modal-gallery';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { FilesService } from '../../services/files.service';


@Component({
  selector: 'drop-file',
  templateUrl: './drop-file.component.html',
  styleUrls: ['./drop-file.component.scss'],
  animations: [
    trigger('easeInOut', [
      transition(':enter', [
        style({
          opacity: 0,
          'z-index': 99
        }),
        animate('0.3s', style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          'z-index': 99
        }),
        animate('0.3s', style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class DropFileComponent implements OnInit {

  type = '';
  editable = true;
  canChangeImage = false;
  multiple: string;
  loading = false;
  showGallery = false;

  @ViewChild('fileInput') input: ElementRef;

  @Input() canRemove: () => boolean;

  @Input() supportedFileTypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg'];
  @Input() showPreview = true;
  @Input() image: any;
  @Input() fileId: number = 0;
  @Input('editable') set editableFlag(editable: boolean) {
    editable ? this.editable = true : this.editable = false;
  }
  @Input('canChangeImage') set canChangeImageFlag(canChangeImage: boolean) {
    canChangeImage ? this.canChangeImage = true : this.canChangeImage = false;
  }
  @Input('multiple') set multipleFlag(multiple: boolean) {
    multiple ? this.multiple = 'multiple' : this.multiple = '';
  }

  @Output() fileChanged: EventEmitter<File> = new EventEmitter();
  @Output() fileRemoved: EventEmitter<File> = new EventEmitter();
  @Output() loadingFile: EventEmitter<boolean> = new EventEmitter();

  imagesTypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg'];

  constructor(
    public snackBar: MdSnackBar,
    public confirmDialogHandler: ConfirmDialogHandler,
    private ng2ImgMax: Ng2ImgMaxService,
    private filesService: FilesService
  ) { };

  ngOnInit() { }

  dragFileAccepted(acceptedFile: Ng2FileDropAcceptedFile) {
    this.processFile(acceptedFile.file);
  }

  dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    if (rejectedFile.rejectionReason) {
      this.showMessage('arquivo incompatível!');
      this.loadingFile.emit(false);
    }
  }

  showInput() {
    return this.canChangeImage ? null : this.editable ? this.input.nativeElement.click() : null;
  }

  onFileChange() {
    this.loadingFile.emit(true);
    for (let index = 0; index < this.input.nativeElement.files.length; index++) {
      this.processFile(this.input.nativeElement.files[index]);
    }
    this.input.nativeElement.value = '';
  }

  removeImage() {
    if (!this.canRemove || this.canRemove()) {
      this.confirmDialogHandler.call('excluir', 'deseja realmente excluir?').subscribe((confirm) => {
        if (confirm) {
          if (this.fileId) {
            this.loading = true;
            this.filesService.deleteFile(this.fileId).subscribe(
              response => {
                if (response.ok) {
                  this.showMessage('imagem removida com sucesso!');

                  this.image = null;
                  this.fileRemoved.emit();
                }

                this.loading = false;
              }
              , error => {
                this.showMessage('erro ao remover imagem');
                this.loading = false;
              });

            return;
          }

          this.image = null;
          this.fileRemoved.emit();
        }
      });
    }
  }

  private isImage(type: string) {
    if (this.imagesTypes.indexOf(type) !== -1) {
      return true;
    }
    return false;
  }

  private async processFile(file: File) {
    this.type = file.type;

    if (this.supportedFileTypes.indexOf(this.type) !== -1) {
      if (file.size < 209715200) {
        if (this.isImage(this.type)) {

          //Resize image
          let base64 = await this.convertFileToBase64(file);
          let resizeImage = await this.resizeImage(base64, 600, 600);
          var blob = await this.dataURItoBlob(resizeImage);
          file = new File([blob], file.name, { type: 'image/jpeg' });

          const fileReader = new FileReader();
          fileReader.onload = (() => {
            return (e) => {
              if (this.showPreview) {
                this.image = fileReader.result;
              }
              this.fileChanged.emit(file);
            };
          })();
          fileReader.readAsDataURL(file);
        } else {
          this.fileChanged.emit(file);
        }
      } else {
        this.showMessage('arquivo excede o limite de tamanho!');
        this.loadingFile.emit(false);
      }
    } else {
      this.showMessage('arquivo incompatível!');
      this.loadingFile.emit(false);
    }
  }

  async dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = encodeURI(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  async convertFileToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async resizeImage(url, maxWidth, maxHeight) {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const oc = document.createElement('canvas');
      const octx = oc.getContext('2d');

      img.onload = function () {

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;


        let cur = {
          width: Math.floor(img.width * 0.5),
          height: Math.floor(img.height * 0.5)
        }

        oc.width = cur.width;
        oc.height = cur.height;

        octx.drawImage(img, 0, 0, cur.width, cur.height);

        while (cur.width * 0.5 > width) {
          cur = {
            width: Math.floor(cur.width * 0.5),
            height: Math.floor(cur.height * 0.5)
          };

          octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
        }

        ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

        // Preview
        const urlCanvas = canvas.toDataURL('image/jpeg', 0.8);
        resolve(urlCanvas);

      }
      img.src = url;
    });
  }

  private showMessage(msg) {
    this.snackBar.open(msg, null, { duration: 3000 });
  }

  getViewGalleryImage() {
    return new Image(this.image);
  }

  public viewImage() {
    this.showGallery = !this.showGallery;
  }
}
