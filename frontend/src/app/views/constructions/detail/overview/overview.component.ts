import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import * as Moment from 'moment';

import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { SectorCount } from 'app/shared/util/json/sector-count';
import { Construction } from 'app/shared/models/construction.model';
import { Task } from 'app/shared/models/task.model';
import { SectorsService } from 'app/shared/services/sector.service';
import { EmotionalResult } from 'app/shared/models/emotional-result.model';
import { Sector } from 'app/shared/models/sector.model';
import { PermissionService } from '../../../../shared/services/permission.service';
import { TrainingScheduleService } from '../../../../shared/services/training-schedule.service';
import { TrainingSchedule } from '../../../../shared/models/training-schedule.model';

@Component({
  selector: 'overview-component',
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  construction: Construction;
  workers: any;
  changeTask: Subject<Task> = new Subject<Task>();
  loadingForthcomingTrainings = true;
  dateFormat = 'DD/MMM';

  lastAlerts = [
    {
      title: '16/MAR', items: [
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '13:50' },
        { text: 'lorem ipsum dolor |', icon: 'assets/workers.png', time: '14:50' },
        { text: 'Entrada de pessoa não autorizada |', icon: 'assets/epis.png', time: '11:10' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '12:50' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '13:40' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '22:00' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '22:00' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '22:00' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '22:00' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '22:00' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '22:00' }
      ]
    },
    {
      title: '15/MAR', items: [
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '13:50' },
        { text: 'lorem ipsum dolor |', icon: 'assets/workers.png', time: '14:50' },
        { text: 'Entrada de pessoa não autorizada |', icon: 'assets/epis.png', time: '11:10' },
        { text: 'Equipamento com bateria baixa lorem ipsum dolor |', icon: 'assets/workers.png', time: '12:50' }
      ]
    },
  ];

  forthcomingMaturities = [
    {
      title: 'máquinas e equipamentos', dates: [
        {
          title: '01/ABR', items: [
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Limpeza dos bebedouros ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Limpeza dos bebedouros ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' }
          ]
        },
        {
          title: '05/ABR', items: [
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Limpeza dos bebedouros ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Limpeza dos bebedouros ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Limpeza dos bebedouros ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Limpeza dos bebedouros ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Limpeza dos bebedouros ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Limpeza dos bebedouros ', icon: 'assets/workers.png', display: 'left' },
            { text: 'Ensaios de aterramento elétrico (a cada ano) ', icon: 'assets/workers.png', display: 'left' },
          ]
        },
      ]
    },
  ];

  forthcomingTrainings = [];

  private sectorsCount: SectorCount[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sectorsService: SectorsService,
    public constructionItemResolver: ConstructionItemResolver,
    public permissionService: PermissionService,
    private trainingScheduleService: TrainingScheduleService
  ) { }

  ngOnInit() {
    Moment.locale('pt-br');
    this.constructionItemResolver.load.subscribe((construction: Construction) => {
      this.construction = construction;

      if (this.sectorsCount) {
        this.fillSectorsSummary(this.construction.sectors, this.sectorsCount);
      }

      this.workers = {
        total: this.construction.workers.length,
        results: new EmotionalResult(20, 76, 34, 250, 0)
      };

      this.trainingScheduleService.getForthcomingTrainings(this.construction.id)
        .subscribe(
          (trainingSchedules: TrainingSchedule[]) => {
            const forthcomingTrainingsMap = new Map<String, String[]>();

            for (const scheduledTraining of trainingSchedules) {
              const date = Moment(scheduledTraining.scheduledBegin).format(this.dateFormat);
              const forthcomingTrainingsDate = forthcomingTrainingsMap.get(date);
              if (forthcomingTrainingsDate) {
                forthcomingTrainingsDate.push(scheduledTraining.id.toString() + ';;;' + scheduledTraining.trainingTitle);
              } else {
                forthcomingTrainingsMap.set(date, [scheduledTraining.id.toString() + ';;;' + scheduledTraining.trainingTitle]);
              }
            }

            let trainingTitles = [];
            let idTitles = [];
            forthcomingTrainingsMap.forEach((trainings, date) => {
              trainings.forEach((trainingTitle) => {
                idTitles = trainingTitle.split(';;;', 2);
                trainingTitles.push({ text: idTitles[1], id: idTitles[0] });
              });
              this.forthcomingTrainings.push({ title: date, items: trainingTitles });
              trainingTitles = [];
            });
            this.loadingForthcomingTrainings = false;
          }
        );
    });

    this.route.parent.params.subscribe(params => {
      this.sectorsService.countDependencies(params.id).subscribe(count => {
        this.sectorsCount = count;
        this.fillSectorsSummary(this.construction.sectors, this.sectorsCount);
      });
    });
  }

  redirectToConstruction() {
    this.router.navigate(['/constructions/edit/' + this.construction.id], { relativeTo: this.route, fragment: 'blueprints' });
  }


  private fillSectorsSummary(sectors: Sector[], sectorsCount: SectorCount[]) {
    sectors.forEach(sector => {
      const sectorCount = sectorsCount.find(count => count.sectorId === sector.id);
      sector.summary = sectorCount;

      if (sectorCount) {
        sector.floors.forEach(floor => {
          const floorCount = sectorCount.floorsCount.find(count => count.floorId === floor.id);
          floor.summary = floorCount;
        });
      }
    });
  }
}
