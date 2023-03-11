import { WorkerItemResolver } from 'app/resolves/worker-item.resolver';
import { OnInit } from '@angular/core/core';
import { OnDestroy } from '@angular/core/src/core';
import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { FormBase } from 'app/shared/util/generic/form/form-base';
import { Aso } from 'app/shared/models/aso.model';
import { Qualification } from 'app/shared/models/qualification.model';
import { Construction } from 'app/shared/models/construction.model';
import { Worker } from 'app/shared/models/worker.model';
import { Sector } from 'app/shared/models/sector.model';
import { Equipment } from 'app/shared/models/equipment.model';

export abstract class ConstructionFormBase<M extends CanMerge<Construction>> extends FormBase<Construction, M> {

    isCreating(): boolean {
        return this.persistedModel.id == null;
    }

    isEditing(): boolean {
        return !this.isCreating();
    }
}
