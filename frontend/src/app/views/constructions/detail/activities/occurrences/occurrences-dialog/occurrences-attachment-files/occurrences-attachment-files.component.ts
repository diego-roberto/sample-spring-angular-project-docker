import { Component, OnInit, Input } from '@angular/core';

import { Occurrence } from 'app/shared/models/occurrence.model';
import { FileInfo } from 'app/shared/models/file-info.model';

@Component({
  selector: 'occurrences-attachment-files',
  templateUrl: './occurrences-attachment-files.component.html',
  styleUrls: ['./occurrences-attachment-files.component.scss']
})
export class OccurrencesAttachmentFilesComponent implements OnInit {

  @Input() occurrence: Occurrence;
  @Input() disabled: boolean;
  @Input() onEdit: boolean;

  supportedFileTypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg'];
  limitAttachmentFiles = 5;

  constructor() { }

  ngOnInit() {
    if (! this.occurrence.files) { this.occurrence.files = new Array<FileInfo>(); }
  }

  addFile(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const fileInfo = new FileInfo();
      fileInfo.resourceFile = file;
      fileInfo.filePath = fileReader.result;
      this.occurrence.files.push(fileInfo);
    };
  }

  removeFile(index: number) {
    this.occurrence.files.splice(index, 1);
  }

  isEditableFile(file: FileInfo): boolean {
    if (this.disabled) {
      return false;
    }

    if (this.onEdit && file.id) {
      return false;
    }

    return true;
  }

  limitSelectionReached(): boolean {
    return this.occurrence.files.length >= this.limitAttachmentFiles;
  }

}
