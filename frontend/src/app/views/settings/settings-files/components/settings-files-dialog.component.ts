import { Component, OnInit, Inject, Input } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FileInfo } from 'app/shared/models/file-info.model';
import { FilesService } from 'app/shared/services/files.service';

@Component({
  selector: 'settings-files-dialog',
  templateUrl: './settings-files-dialog.component.html',
  styleUrls: ['./settings-files-dialog.component.scss']
})
export class SettingsFilesDialogComponent implements OnInit {

  title:string= "Cadastro de Arquivos";
  supportedFileTypes: Array<string> = ['application/zip'];
  files: FileInfo[];
  loading: boolean = false;

  constructor( public dialogRef: MdDialogRef<SettingsFilesDialogComponent>,
    private fileService: FilesService,
  ) { }

  ngOnInit() {
    if (!this.files) {
      this.files = new Array<FileInfo>();
    }
  }

   save(){
     this.loading = true;
      for (const file of this.files) {
        this.fileService.uploadFile("file", file.resourceFile).subscribe(result=>{
          if (this.files.indexOf(file) == (this.files.length - 1)) {
            this.closeDialog();
          }
        });
      }
      
   }

  closeDialog() {
    this.loading = false;
    this.dialogRef.close();
   }

  addFile(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const fileInfo = new FileInfo();
      fileInfo.resourceFile = file;
      fileInfo.filePath = fileReader.result.toString();
      this.files.push(fileInfo);
    };
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

}
