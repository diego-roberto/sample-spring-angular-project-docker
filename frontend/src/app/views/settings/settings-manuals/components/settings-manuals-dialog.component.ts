import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FileInfo } from 'app/shared/models/file-info.model';
import { FilesService } from 'app/shared/services/files.service';

@Component({
  selector: 'settings-manuals-dialog',
  templateUrl: './settings-manuals-dialog.component.html',
  styleUrls: ['./settings-manuals-dialog.component.scss']
})
export class SettingsManualsDialogComponent implements OnInit {

  title: string = "Cadastro de Manuais";
  supportedFileTypes: Array<string> = ['application/pdf'];
  manuals: FileInfo[];
  loading: boolean = false;

  constructor(public dialogRef: MdDialogRef<SettingsManualsDialogComponent>,
    private fileService: FilesService,
  ) { }

  ngOnInit() {
    if (!this.manuals) {
      this.manuals = new Array<FileInfo>();
    }
  }

  save() {
    this.loading = true;
    for (const manual of this.manuals) {
      this.fileService.uploadFile("manual", manual.resourceFile).subscribe(result => {
        if (this.manuals.indexOf(manual) == (this.manuals.length - 1)) {
          this.closeDialog();
        }
      });
    }
  }

  closeDialog() {
    this.loading = false;
    this.dialogRef.close();
  }

  addManual(manual: File) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(manual);
    fileReader.onload = () => {
      const fileInfo = new FileInfo();
      fileInfo.resourceFile = manual;
      fileInfo.filePath = fileReader.result.toString();
      this.manuals.push(fileInfo);
    };
  }

  removeManual(index: number) {
    this.manuals.splice(index, 1);
  }

}
