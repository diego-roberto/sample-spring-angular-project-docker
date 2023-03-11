import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import * as FileSaver from 'file-saver';

import { isNullOrUndefined } from 'util';

import { ClientType } from 'app/shared/services/http-client.service';

@Component({
    'moduleId': module.id,
    'selector': 'input-file',
    'templateUrl': './input-file.component.html'
})
export class InputFileComponent {
    @Input() disabled: boolean;

    @Input() fileName: string;
    @Input() fileUrl: string;
    private _file: File;

    @Input() accept: string;
    @Input() clientType: ClientType;

    @Input() showClear = false;

    @Input() contentAlign = 'end center';
    
    @Input() buttonText = false;
    @Input() buttonIcon = 'attach_file';

    showName: boolean;
    @Input() set showFileName(show: boolean) {
        this.showName = !isNullOrUndefined(show) && show;
    }

    isDownloadable: boolean;
    @Input() set downloadable(downloadable: boolean) {
        this.isDownloadable = !isNullOrUndefined(downloadable) && downloadable;
    }

    @Output() onFileSelect: EventEmitter<File> = new EventEmitter<File>();

    @Output() undoClear: EventEmitter<{ fileName: string, fileUrl: string, file: File }> = new EventEmitter<{ fileName: string, fileUrl: string, file: File }>();
    @Output() clear: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('inputFile') nativeInputFile: ElementRef;

    constructor(private snackBar: MdSnackBar) { }

    onNativeInputFileSelect($event) {
        this._file = $event.srcElement.files[0];
        this.onFileSelect.emit(this._file);
    }

    selectFile() {
        this.nativeInputFile.nativeElement.click();
    }

    hasFile(): boolean {
        return (this._file !== null && this._file !== undefined) ||
            (this.fileUrl !== null && this.fileUrl !== undefined) ||
            (this.fileName !== null && this.fileName !== undefined);
    }

    doDownloadFile() {
        FileSaver.saveAs(this._file);
    }

    clearFile(): void {
        const fileName = this.fileName;
        const fileUrl = this.fileUrl;
        const file = this._file;
        this.nativeInputFile.nativeElement.value = '';

        this._file = null;
        this.clear.emit();

      /*  const ref = this.snackBar.open('Tem certeza que deseja excluir?', 'Desfazer', { duration: 4000 });

        ref.onAction().subscribe(() => {
            this._file = file;
            this.undoClear.emit({ fileName: fileName, fileUrl: fileUrl, file: file });
        });*/  
    }

    isBackendClientType(): boolean {
        return (this.clientType === undefined || this.clientType === ClientType.backend);
    }
}
