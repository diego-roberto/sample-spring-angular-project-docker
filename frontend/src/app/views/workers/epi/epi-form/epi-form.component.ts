import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { MdSelectChange } from "@angular/material";

import { Epi } from "app/shared/models/epi.model";
import { EpiTypes } from "app/shared/models/epi-types.model";
import { CaEpi } from "app/shared/models/ca-epi.model";

import { EpiService } from "app/shared/services/epi.service";
import { EpiTypesService } from "app/shared/services/epi-types.service";
import { ExternalImportEpiService } from "app/shared/services/external-import-epi.service";

import { isNullOrUndefined } from "util";
import { MaskUtil } from "app/shared/util/mask.util";
import { CaEpiListResolver } from "app/resolves/ca-epi-list.resolver";
import { environment } from "environments/environment";

import { CaEpiService } from "../../../../shared/services/ca-epi.service";
import { ExternalImportEpi } from "app/shared/models/external-import-epi.model";

@Component({
  selector: "epi-form",
  templateUrl: "./epi-form.component.html",
  styleUrls: ["./epi-form.component.scss"]
})
export class EpiFormComponent implements OnInit {
  @Input() caEpi: CaEpi;
  epiForm: FormGroup;
  listEpiType: Array<EpiTypes> = [];
  epiTypeSelected: EpiTypes;
  listEpi: Array<Epi> = [];
  caNumber: number;
  minDate: Date = new Date();
  numberMask = MaskUtil.variableLengthMask(MaskUtil.NUMBER, 10);

  constructor(
    private formBuilder: FormBuilder,
    private epiTypesService: EpiTypesService,
    private epiService: EpiService,
    private externalImportEpiService: ExternalImportEpiService,
    private caEpiListResolver: CaEpiListResolver,
    private caEpiService: CaEpiService
  ) {}

  ngOnInit() {
    if (this.caEpi.epiId) {
      this.epiTypeSelected = this.caEpi.epiId.epiType;
    }
    if (this.epiTypeSelected) {
      this.loadEpisByEpiType(this.epiTypeSelected.id);
    }
    if (this.caEpi.ca && this.caEpi.ca.ca) {
      this.caNumber = this.caEpi.ca.ca;
    }

    this.buildEpiForm();
    this.loadEpiTypes();

    this.getEpiDate(this.epiTypeSelected.id);
  }

  buildEpiForm() {
    this.epiForm = this.formBuilder.group({
      type: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      caNumber: new FormControl("", [Validators.required]),
      dueDate: new FormControl({ value: "", disabled: true }, [
        Validators.required
      ]),
      size: new FormControl("", [Validators.required]),
      quantity: new FormControl("", [Validators.required]),
      approvedTo: new FormControl({ value: "", disabled: true })
    });

    if (this.isOnEdit()) {
      this.epiForm.controls.caNumber.disable();
    }
    this.epiForm.controls.caNumber.setValidators(this.caNumberValidation())
  }

  loadEpiTypes() {
    this.epiTypesService.getEpiTypeList().subscribe(listEpiType => {
      this.listEpiType = listEpiType;
    });
  }

  loadEpisByEpiType(epiTypeId: number) {
    this.epiService.getEpiByEpiTypesIdList(epiTypeId).subscribe(listEpi => {
      return (this.listEpi = listEpi);
    });
  }

  getEpiDate(id: number) {
    this.caEpiService.getCaEpiById(id).subscribe();
  }

  epiTypeChangeHandler(event: MdSelectChange) {
    this.epiTypeSelected = this.listEpiType.find(
      epiType => epiType.id === event.value
    );
    this.loadEpisByEpiType(this.epiTypeSelected.id);
  }

  epiChangeHandler(event: MdSelectChange) {
    this.caEpi.epiId = this.listEpi.find(epi => epi.id === event.value);
  }

  fileChangeHandler(file: File) {
    this.caEpi.epiFile = file;
  }

  fileRemovedHandler() {
    this.caEpi.epiFile = null;
    this.caEpi.epiFileName = null;
    this.caEpi.epiUrl = null;
  }

  isOnEdit(): boolean {
    return this.caEpi.id !== undefined;
  }

  isThumbnailMode(): boolean {
    return (
      !isNullOrUndefined(this.caEpi.epiFile) ||
      !isNullOrUndefined(this.caEpi.epiUrl)
    );
  }

  getCaDueDate(): Date {
    if (
      this.epiForm.controls.caNumber.invalid ||
      isNullOrUndefined(this.caEpi.ca)
    ) {
      return undefined;
    }
    return this.caEpi.ca.due_date;
  }

  getDate(date) {
    if (this.caEpi.ca) {
      this.caEpi.ca.due_date = date;
    }
  }

  getApprovedTo(approvedTo) {
    if (this.caEpi.ca) {
      this.caEpi.ca.approvedTo = approvedTo;
    }
  }

  getCaApprovedTo(): String {
    if (
      this.epiForm.controls.caNumber.invalid ||
      isNullOrUndefined(this.caEpi.ca)
    ) {
      return "";
    }
    return this.caEpi.ca.approvedTo === undefined
      ? ""
      : this.caEpi.ca.approvedTo;
  }

  loadExternalImportEpiByCaNumber(caNumber: any) {
    if (caNumber === "" || isNullOrUndefined(caNumber)) {
      this.caEpi.ca = undefined;
      return;
    }
    this.externalImportEpiService
      .getExternalImportEpiByCa(caNumber)
      .subscribe(externalImportEpi => {
        if (!externalImportEpi.id) {
          const externalEpiDeafult = new ExternalImportEpi();
          externalEpiDeafult.id = -1;
          externalEpiDeafult.ca = this.epiForm.controls.caNumber.value;
          externalEpiDeafult.approvedTo = "";
          externalEpiDeafult.dtLastUpdate = new Date();
          externalEpiDeafult.due_date = this.epiForm.controls.dueDate.value;
          externalEpiDeafult.situation = true;
          externalImportEpi = externalEpiDeafult;
          this.epiForm.controls.approvedTo.enable();
        }else{
          this.epiForm.controls.approvedTo.disable();
        }
        this.caEpi.ca = externalImportEpi;
        this.epiForm.controls.caNumber.updateValueAndValidity();
      });
  }

  caNumberValidation() {
    return (control: FormControl) => {
      if (control.value === "") {
        return null;
      }
      if (
        isNullOrUndefined(this.caEpi.ca) ||
        isNullOrUndefined(this.caEpi.ca.id)
      ) {
        return { caNotFound: true };
      }
      if (
        this.caEpiListResolver.loadRegistered
          .getValue()
          .some(x => x.ca.ca === this.caEpi.ca.ca)
      ) {
        return { caAlreadyRegistered: true };
      }
      return null;
    };
  }

  getEpiImg() {
    if (this.caEpi.epiUrl) {
      return (
        environment.backendUrl +
        this.caEpi.epiUrl +
        "?t=" +
        this.caEpi.epiFileName
      );
    } else {
      return "";
    }
  }
}
