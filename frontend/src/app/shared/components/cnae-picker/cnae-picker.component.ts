import { Component, EventEmitter, Output, Input, OnChanges, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { CnaeService } from 'app/shared/services/cnae.service';
import { MaskUtil } from 'app/shared/util/mask.util';

@Component({
    selector: 'cnae-picker',
    templateUrl: './cnae-picker.component.html',
    styleUrls: ['./cnae-picker.component.scss']
})

export class CnaePickerComponent implements OnInit, OnChanges{

    @Input()
    cnaeCode: string;

    @Output()
    onSearch = new EventEmitter();

    @Input()
    disabled: boolean;

    cnaeCodeModel: string;
    loadingCnae = false;
    cnaeMask = MaskUtil.cnaeMask;

    constructor(
        private cnaeService: CnaeService,
        public snackBar: MdSnackBar
    ) {    }

    ngOnInit(): void{
      this.cnaeCodeModel = this.cnaeCode;
    }

    ngOnChanges(): void {
      this.cnaeCodeModel = this.cnaeCode;
    }

    searchCnae(cnaeCode) {
        if (cnaeCode && cnaeCode.trim() !== '') {
            this.loadingCnae = true;
            this.cnaeService.getCnae(this.removeMask(cnaeCode))
                .subscribe(
                data => {
                    if (data) {
                        this.onSearch.emit(data);
                    } else {
                        this.onSearch.emit(data);
                        this.snackBar.open('CNAE não encontrado!', null, { duration: 3000 });
                    }
                    this.loadingCnae = false;
                },
                error => {
                    this.snackBar.open('CNAE não encontrado!', null, { duration: 3000 });
                    this.loadingCnae = false;
                }
                );
        }
    }

    removeMask(cnaeCode) {
        return cnaeCode.replace(/[-\/_]/g, '');
    }

    onBlur() {
        this.searchCnae(this.cnaeCodeModel);
    }

}
