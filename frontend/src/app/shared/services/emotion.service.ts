import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import { Emotion } from 'app/shared/models/emotion.model';

export enum FeelingsEnum {
  EMPOLGADO = 1,
  CONTENTE = 2,
  TRISTE = 3,
  IRRITADO = 4,
  NAO_RESPONDIDO = 5
}

const convertToEmotionList = (jsonResponse: any) => {
    return jsonResponse.emotions.map((jsonEmotion) => {
      return new Emotion().initializeWithJSON(jsonEmotion);
  });
}

@Injectable()
export class EmotionService {
    public emotion: Emotion;
    private endpointEmotion = '/emotions';
    private endpointToday = '/today';
    private endpointYesterday = '/yesterday';
    private endpointWorker = '/findByWorkerId';
    private endpointWorkerByConstructionIdAndMonthYear = '/findWorkerEmotionsDTOByConstructionIdAndCreatedAt';
    private endpointWorkerByConstructionIdAndCreatedAtBetween = '/findWorkerEmotionsDTOByConstructionIdAndCreatedAtBetween';
    private endpointWorkerByConstructionAndCreatedAt = '/findWorkerEmotionByConstructionIdAndCreatedAt';

    constructor(private service: HttpClientService) { }

    getEmotionList() {
        return this.service.get(this.endpointEmotion).map(convertToEmotionList);
    }

    getEmotionToday(idconstruction: number) {
        return this.service.get(this.endpointEmotion + this.endpointToday + '/' + idconstruction).map(convertToEmotionList);
    }

    getEmotionYesterday(idconstruction: number) {
        return this.service.get(this.endpointEmotion + this.endpointYesterday + '/' + idconstruction).map(convertToEmotionList);
    }

    getEmotionTodayByWorker(idworker: number) {
        return this.service.get(this.endpointEmotion + this.endpointWorker + '/' + idworker).map(convertToEmotionList);
    }

    findByWorkerIdAndConstructionIdAndCreatedAtToday(idworker: number, idConstructoin: number) {
      return this.service.post(this.endpointEmotion + `/findByWorkerIdAndConstructionIdAndCreatedAtToday?idWorker=${idworker}&idConstruction=${idConstructoin}`, null).map(convertToEmotionList);
    }

    getfindWorkerEmotionsByConstructionIdAndCreatedAtBetween(idConstruction: number, initialdate: string, finaldate: string){
        return this.service.get(this.endpointEmotion + this.endpointWorkerByConstructionIdAndCreatedAtBetween + "/" +
            "id/"+ idConstruction + "/" +
            "initialdate/"+ initialdate + "/" +
            "finaldate/"+ finaldate)
            .map((response) => {
                return response;
            });
    }

    getWorkerEmotionsByConstructionIdAndMonthYear(idConstruction: number, dateMonth: number, dateYear: number){
        return this.service.get(this.endpointEmotion + this.endpointWorkerByConstructionIdAndMonthYear + "/" +
            "id/"+ idConstruction + "/" +
            "month/"+ dateMonth + "/" +
            "year/"+ dateYear)
            .map((response) => {
                return response;
            });
    }

    deleteEmotion(idemotion: number) {
        this.service.delete(this.endpointEmotion + '/' + idemotion).subscribe();
    }

    saveEmotion(emotion: Emotion) {
        return this.createEmotion(emotion);
    }

    private createEmotion(emotion: Emotion) {
        return this.service.post(this.endpointEmotion, JSON.stringify(emotion.toJSON())).map((jsonResponse) => {

            return new Emotion().initializeWithJSON(jsonResponse.emotion);
        });
    }
}
