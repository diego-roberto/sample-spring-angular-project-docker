import { Component, Input, OnInit } from '@angular/core';

import { Task } from 'app/shared/models/task.model';
import { AttachmentTaskFile } from 'app/shared/models/attachmentTaskFile.model';

@Component({
    selector: 'tasks-attachment-files',
    templateUrl: 'tasks-attachment-files.component.html',
    styleUrls: ['./tasks-attachment-files.component.scss']
})

export class TasksAttachmentFilesComponent implements OnInit{

    editable = true;
    supportedFileTypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg'];

    attachmentFiles: any[];

    @Input() task: Task;
    @Input() history: boolean;
    @Input('editable') set editableFlag(editable: boolean) {
        editable ? this.editable = true : this.editable = false;
    }

    ngOnInit() {  
        if(this.history === undefined){
            this.attachmentFiles = this.task.attachmentFiles;
        }else{
            this.attachmentFiles = this.task.attachmentFiles.filter(file => file.history == this.history);
        }
    }

    attachmentFileAdded(imageFile: File) {
        const newFile = new AttachmentTaskFile();
        newFile.file = imageFile;

        const fileReader = new FileReader();
        fileReader.onload = ((theFile) => {
            return (e) => {
                if (this.task.attachmentFiles.length < 5) {
                    newFile.resourceFile = fileReader.result;
                    newFile.fileName = imageFile.name;
                    newFile.type = imageFile.type;
                    this.task.attachmentFiles.push(newFile);
                }
            };
        })(imageFile);
        fileReader.readAsDataURL(imageFile);
    }

    attachmentFileEdited(attachmentFile: AttachmentTaskFile, index: number, imageFile: File) {
        const updatedFile = new AttachmentTaskFile();
        updatedFile.file = imageFile;

        const fileReader = new FileReader();
        fileReader.onload = ((theFile) => {
            return (e) => {
                updatedFile.resourceFile = fileReader.result;
                updatedFile.fileName = imageFile.name;
                updatedFile.type = imageFile.type;
                const newArray = Object.assign(new Array<AttachmentTaskFile>(), this.task.attachmentFiles.slice(), { [index]: updatedFile });
                this.task.attachmentFiles = newArray;
            };
        })(imageFile);
        fileReader.readAsDataURL(imageFile);
    }

    downloadFile(index: number) {
        const downloadedFile = this.task.attachmentFiles[index];
        const blob = new Blob([downloadedFile.file], { type: downloadedFile.type });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    removeFile(index: number) {
        this.task.attachmentFiles.splice(index, 1);
    }
}
