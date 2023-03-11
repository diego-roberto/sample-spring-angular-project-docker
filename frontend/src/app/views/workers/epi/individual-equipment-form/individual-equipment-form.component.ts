import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';

import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';

import { MaskUtil } from 'app/shared/util/mask.util';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'individual-equipment-form',
  templateUrl: './individual-equipment-form.component.html',
  styleUrls: ['./individual-equipment-form.component.scss']
})
export class IndividualEquipmentFormComponent implements OnInit {

  @Input() individualEquipment: IndividualEquipment;

  individualEquipmentForm: FormGroup;
  numberMask = MaskUtil.variableLengthMask(MaskUtil.NUMBER, 10);

  descMaxLength = 150;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildEpiForm();
  }

  buildEpiForm() {
    this.individualEquipmentForm = this.formBuilder.group({
      description: new FormControl('', [Validators.required]),
      size: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
    });
  }

  fileChangeHandler(file: File) {
    this.individualEquipment.file = file;
  }

  fileRemovedHandler() {
    this.individualEquipment.file = null;
    this.individualEquipment.fileName = null;
    this.individualEquipment.fileUrl = null;
  }

  isThumbnailMode(): boolean {
    return ! isNullOrUndefined(this.individualEquipment.file) || ! isNullOrUndefined(this.individualEquipment.fileUrl);
  }

  getEpiImg() {
    if (this.individualEquipment.fileUrl) {
      return environment.backendUrl + this.individualEquipment.fileUrl + '?t=' + this.individualEquipment.fileName;
    } else {
      return '';
    }
  }

}
