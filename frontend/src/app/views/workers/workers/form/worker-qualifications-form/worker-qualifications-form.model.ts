import * as Moment from 'moment';

import { Qualification } from 'app/shared/models/qualification.model';
import { Worker } from 'app/shared/models/worker.model';
import { Qualities } from 'app/shared/models/qualities.model';
import { CanMergeWorker } from '../worker-generic/can-merge-worker';

export class QualificationsForm implements CanMergeWorker {

    qualifications: Qualification[] = [];

    initializeWithModel(model: Worker) {
        this.qualifications = this.transform([].concat(model.qualifications));
    }

    merge(model: Worker) {
        model.qualifications = this.qualifications;
    }

    private transform(qualifications: Qualification[]): Qualification[] {

        // Obs.: Faz uma cópia da lista na hora de fazer o sort porque enquanto o angular
        // está fazendo o sort ele altera a ordem dos itens dentro da lista que está ordenando,
        // o que por sua vez interfere na busca da originalQuality, portanto essa busca é feita
        // na lista original e o sort é feito em uma lista copiada.
        return [].concat(qualifications).sort((q1: Qualification, q2: Qualification) => {

            const originalQuality1 = this.findOriginalQuality(qualifications, q1.qualities);
            const originalQuality2 = this.findOriginalQuality(qualifications, q2.qualities);

            const id1: number = originalQuality1 == null ? q1.qualities.id : originalQuality1.id;
            const id2: number = originalQuality2 == null ? q2.qualities.id : originalQuality2.id;

            if (id1 === id2) {
                if (q1.realizationDate === q2.realizationDate) {
                    return 0;
                } else {
                    if (!q1.realizationDate || (q2.realizationDate && Moment(q1.realizationDate).isBefore(Moment(q2.realizationDate)))) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            } else {
                return id1 - id2;
            }
        });
    }

    private findOriginalQuality(qualifications: Qualification[], quality: Qualities): Qualities {
        let parent: Qualities = null;

        qualifications.forEach(qualification => {

            const iteratedQuality = qualification.qualities;

            if (iteratedQuality.recyclingId === quality.id) {
                parent = iteratedQuality;
                return 1;
            }
        });

        return parent;
    }
}
