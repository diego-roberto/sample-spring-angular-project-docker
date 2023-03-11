import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import { Sensor } from 'app/shared/models/sensor.model';

@Injectable()
export class SensorCompanyService {
    public sensor: Sensor;
    private endpoinSensorCompany = '/sensorcompany';
    
    constructor(private service: HttpClientService) { }

    getSensorCompanyList() {
        return this.service.get(this.endpoinSensorCompany).map(jsonResponse => {
            return jsonResponse.sensors.map((jsonSensor) => {
                return new Sensor().initializeWithJSON(jsonSensor);
            });
        });
    }

    saveSensorCompany(sensor: Sensor) {
        return this.createSensorCompany(sensor);
    }

    updateSensorCompany(sensor: Sensor) {
        return this.service.put(this.endpoinSensorCompany + '/' + sensor.id, JSON.stringify(sensor.toJSON())).map((jsonResponse) => {

            return new Sensor().initializeWithJSON(jsonResponse.sensor);
        });
    }

    createSensorCompany(sensor: Sensor) {
        return this.service.post(this.endpoinSensorCompany, JSON.stringify(sensor.toJSON())).map((jsonResponse) => {

            return new Sensor().initializeWithJSON(jsonResponse.sensor);
        });
    }
}
