import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Construction } from 'app/shared/models/construction.model';
import { GeneralFormBase } from 'app/shared/util/generic/form/general-form-base';
import { EventSave } from 'app/shared/util/generic/form/event-save';
import { Floor } from 'app/shared/models/floor.model';
import { Sector } from 'app/shared/models/sector.model';
import { SectorsService } from 'app/shared/services/sector.service';
import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { ConstructionsService } from 'app/shared/services/constructions.service';
import { PermissionService } from '../../../../shared/services/permission.service';
import { SessionsService } from '../../../../shared/services/sessions.service';

@Component({
  selector: 'construction-form',
  templateUrl: './construction-form.component.html',
  styleUrls: ['./construction-form.component.scss']
})
export class ConstructionFormComponent extends GeneralFormBase<Construction> implements OnInit {
  @ViewChild('detailsCard') detailsCard: SafetyCardComponent;
  @ViewChild('constructionModulesCard') constructionModulesCard: SafetyCardComponent;
  @ViewChild('managersCard') managersCard: SafetyCardComponent;
  @ViewChild('blueprintsCard') blueprintsCard: SafetyCardComponent;
  @ViewChild('maintenancesCard') maintenancesCard: SafetyCardComponent;
  @ViewChild('workersCard') workersCard: SafetyCardComponent;
  @ViewChild('documentationCard') documentationCard: SafetyCardComponent;
  elements: Array<SafetyCardComponent>;

  construction: Construction = new Construction();

  constructor(
    public constructionItemResolver: ConstructionItemResolver,
    public service: ConstructionsService,
    public sectorsService: SectorsService,
    public permissionService: PermissionService,
    private sessionsService: SessionsService,
    public snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private router: Router) {

    super(constructionItemResolver);

    this.loadInitialInstance();
  };

  ngOnInit(): void {
    this.elements = [this.detailsCard, this.constructionModulesCard, this.managersCard, this.blueprintsCard, this.maintenancesCard, this.workersCard, this.documentationCard];

    this.route.fragment.subscribe(fragment => {
      if (fragment === 'managers') {
        this.detailsCard && this.detailsCard.close();
        this.open(this.managersCard);
      }
      if (fragment === 'blueprints') {
        this.detailsCard && this.detailsCard.close();
        this.open(this.blueprintsCard);
      }
      if (fragment === 'maintenances') {
        this.detailsCard && this.detailsCard.close();
        this.open(this.maintenancesCard);
      }
      if (fragment === 'workers') {
        this.detailsCard && this.detailsCard.close();
        this.open(this.workersCard);
      }
    });
  }

  /*
   * =========================|
   * Template methods         |
   * =========================|
   */
  onConstructionDetailsSaved(event: EventSave<Construction>) {
    const constructionToSave = this.requestCloneToSave();
    event.modelToSave.merge(constructionToSave);

    this.saveConstructionWithLogo(constructionToSave).subscribe(
      (persistedConstruction) => {
        this.notifyUser('Detalhes da obra salvos com sucesso!');
        this.notifyChange(event.modelToSave, persistedConstruction);
        event.onSaved(persistedConstruction);
        this.detailsCard.close();
        this.open(this.constructionModulesCard);

        this.sessionsService.setCurrentConstruction(persistedConstruction.id);
      },
      error => {
        event.onError(error);
        this.notifyUser('Erro ao salvar os Detalhes da obra!');
      }
    );
  }

  onConstructionModulesSaved(event: any) {
    this.constructionModulesCard.close();
    this.open(this.managersCard);
  }

  onConstructionManagersSaved(event: EventSave<Construction>) {
    this.genericSave(event, this.saveConstruction, (persistedConstruction) => {
      this.notifyUser('Dados dos responsáveis salvos com sucesso!');
      this.managersCard.close();
      this.open(this.documentationCard);
    });
  }

  onConstructionBlueprintsSaved(event: EventSave<Construction>) {
    const constructionToSave = this.requestCloneToSave();
    event.modelToSave.merge(constructionToSave);
    let error: boolean;

    this.sectorsService.createUpdateSectors(constructionToSave.sectors).subscribe(
      saved => {
        const floorBlueprint = Object.assign(new FloorBlueprint(), saved.floor);
        floorBlueprint.error = saved.error;

        constructionToSave.sectors[saved.sectorPosition] = saved.sector;
        constructionToSave.sectors[saved.sectorPosition].floors[saved.floorPosition] = floorBlueprint;

        if (saved.error) {
          error = true;
        }
      },

      () => { },

      () => {
        this.notifyChange(event.modelToSave, constructionToSave);
        event.onSaved(constructionToSave);

        if (error) {
          this.notifyUser('ocorreu algum erro ao salvar, verifique e tente novamente.');
        } else {
          this.blueprintsCard.close();
          this.open(this.maintenancesCard);
          if (this.route.snapshot.fragment === 'blueprints') {
            const ref = this.snackBar.open('Salvo com sucesso! Deseja voltar para o mapeamento?', 'Sim', { duration: 4000 });
            ref.onAction().subscribe(() => {
              this.router.navigate(['/constructions/' + this.getValue().id + '/monitoring'], { relativeTo: this.route });
            });
          } else {
            this.notifyUser('Plantas salvas com sucesso!');
          }
        }
      }
    );
  }

  onConstructionMaintenancesSaved(event: EventSave<Construction>) {
    this.genericSave(event, this.saveConstruction, (persistedConstruction) => {
      this.notifyUser('Máquinas e Equipamentos salvos com sucesso!');
      this.maintenancesCard.close();
      this.open(this.workersCard);
    });
  }

  onConstructionWorkersSaved(event: EventSave<Construction>) {
    this.genericSave(event, this.saveConstruction, (persistedConstruction) => {
      this.notifyUser('Trabalhadores salvos com sucesso!');
      this.workersCard.close();
    });
  }

  doSaveConstructionDocumentation(event: EventSave<Construction>) {
    const constructionToSave = this.requestCloneToSave();
    event.modelToSave.merge(constructionToSave);
    this.construction.constructionDocumentationList = constructionToSave.constructionDocumentationList;

    this.service.saveConstructionDocumentationList(constructionToSave).subscribe(
      (persistedConstruction) => {
        this.notifyUser('Documentação da obra salva com sucesso!');
        this.documentationCard.close();
        this.open(this.blueprintsCard);
      },
      error => {
        this.notifyUser('Erro ao salvar a documentação da obra!');
      }
    );
  }

  /*
   * =========================|
   * Saving methods           |
   * =========================|
   */
  private saveConstruction(self: ConstructionFormComponent, construction: Construction): Observable<Construction> {
    return self.service.saveConstruction(construction);
  }

  private saveConstructionWithLogo(construction: Construction): Observable<Construction> {
    return new Observable(observer => {
      this.service.saveConstruction(construction).subscribe(
        (persistedConstruction) => {
          const logoRequest = construction.logoFile ? { id: persistedConstruction.id, logoFile: construction.logoFile } : null;
          const ceiRequest = construction.ceiFile ? { id: persistedConstruction.id, ceiFile: construction.ceiFile } : null;

          if (!logoRequest && !ceiRequest) {
            observer.next(persistedConstruction);
            observer.complete();
          }

          this.updateDetailFiles(persistedConstruction, logoRequest, ceiRequest).subscribe(
            (persistedConstructionWithLogo) => {
              observer.next(persistedConstructionWithLogo);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /*
   * =========================|
   * Override methods         |
   * =========================|
   */
  protected handleSaveError(error) {
    this.handleError(error);
  }

  protected getInitialInstance(): Construction {
    let construction: Construction;
    this.route.data.subscribe(routeData => {
      construction = routeData.construction;
      this.construction = construction;
    });
    return construction;
  }
  protected notifyUser(message: string) {
    this.snackBar.open(message, null, { duration: 3000 });
  }

  protected handleAfterSaveError(error) { this.notifyUser('Erro ao salvar imagens.'); }

  /*
  * =========================|
  * Auxiliar methods         |
  * =========================|
  */
  closeAll() {
    this.elements.forEach(e => {
      if (e) {
        e.close();
      }
    });
  }

  updateDetailFiles(construction: Construction, logoRequest, ceiRequest): Observable<Construction> {
    return new Observable(observer => {
      this.updateConstructionLogo(logoRequest).subscribe(
        (constructionLogo: Construction) => {

          if (constructionLogo) {
            construction.logoFileName = constructionLogo.logoFileName;
            construction.logoUrl = constructionLogo.logoUrl;
            construction.logoFile = null;
          }

          this.updateConstructionCei(ceiRequest).subscribe(
            (constructionCei: Construction) => {

              if (constructionCei) {
                construction.ceiFileName = constructionCei.ceiFileName;
                construction.ceiUrl = constructionCei.ceiUrl;
                construction.ceiFile = null;
              }

              observer.next(construction);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private findOriginalFloor(sectors: Sector[], id: number): Floor {
    for (let i = 0; i < sectors.length; i++) {
      for (let j = 0; j < sectors[i].floors.length; j++) {
        if (sectors[i].floors[j].id === id) {
          return sectors[i].floors[j];
        }
      }
    }
    return null;
  }

  private updateConstructionLogo(logoRequest): Observable<Construction> {
    if (logoRequest) {
      return this.service.updateConstructionLogo(logoRequest);
    }
    return new BehaviorSubject<Construction>(null);
  }

  private updateConstructionCei(ceiRequest): Observable<Construction> {
    if (ceiRequest) {
      return this.service.updateConstructionCei(ceiRequest);
    }
    return new BehaviorSubject<Construction>(null);
  }

  private handleError(error) {
    if (error.json() && error.json().errors && error.json().errors.length > 0) {
      this.snackBar.open(error.json().errors[0].message, null, { duration: 4000 });
    } else {
      this.snackBar.open('Erro no servidor!', null, { duration: 4000 });
    }
  }

  private open(toggle) {
    this.closeAll();
    toggle && toggle.open();
  }
}

export class FloorBlueprint extends Floor {
  error: Error;
}
