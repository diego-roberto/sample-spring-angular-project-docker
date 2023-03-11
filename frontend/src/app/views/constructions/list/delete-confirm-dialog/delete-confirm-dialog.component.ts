import { MdDialogRef } from "@angular/material";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import * as _ from "lodash/collection";
import { ConstructionsService } from "app/shared/services/constructions.service";
import { Construction } from "app/shared/models/construction.model";

const includesString = (toCheck, value) =>
  toCheck.toLowerCase().includes(value.toLowerCase());

@Component({
  selector: "delete-dialog",
  templateUrl: "delete-confirm-dialog.component.html",
  styleUrls: ["./delete-confirm-dialog.component.scss"]
})
export class deleteConfirmDialog implements OnInit {
  //   @Output() onUpdate = new EventEmitter();
  title: string;
  construction: Construction;

  constructor(
    public dialogRef: MdDialogRef<deleteConfirmDialog>,
    private service: ConstructionsService
  ) {}

  ngOnInit() {
    this.title = "Excluir";
  }

  removed(confirmed) {
    if (confirmed) {
      this.service.deleteConstruction(this.construction).subscribe();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
