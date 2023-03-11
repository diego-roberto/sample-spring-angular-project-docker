import { ManagementsProfiles } from './../../../../shared/models/managements-profiles.model';
import { UserAddCompanyComponent } from './../user-add-company/user-add-company.component';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { UserProfile } from './../../../../shared/models/user-profile.model';
import { UserProfileService } from './../../../../shared/services/user-profile.service';
import { WorkerService } from 'app/shared/services/worker.service';
import { CompanyService } from 'app/shared/services/company.service';
import { Worker } from 'app/shared/models/worker.model';
import { SessionsService } from './../../../../shared/services/sessions.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { UtilValidators } from '../../../../shared/util/validators.util';
import { MdDialogRef, MdSnackBar, MdDialog } from '@angular/material';
import { ManagementsService } from '../../../../shared/services/managements.service';
import { Managements } from '../../../../shared/models/managements.model';
import { ConstructionsService } from '../../../../shared/services/constructions.service';
import { Construction } from '../../../../shared/models/construction.model';
import { ConstructionUserProfileService } from '../../../../shared/services/construction-user-profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
})
export class UserAddComponent implements OnInit {
  public managements: Managements = new Managements();
  public userForm: FormGroup;
  public currentUser: User;
  public currentCompany: any;
  public title = 'CADASTRO DE USUÁRIO';
  public workers: any[] = [];
  public userProfiles: any[] = [];
  public selectedUserProfiles: any[] = [];
  public constructions: Array<Construction> = [];
  public selectedConstruction: any = {};
  public constructionsProfiles: any[] = [];
  messageErrorConstructionProfile: string[] = [];
  companyProfiles: any[] = [];
  selectedCompanyProfiles: any[] = [];
  selectedConstructionProfiles: any[] = [];
  mapConstructionProfiles: any = {};
  profiles: boolean = false;
  companies: Array<Number> = [];
  managementList: Array<Managements> = [];
  globalNotificationProfiles = [];

  public mode: String = 'create';

  constructor(
    private managementsService: ManagementsService,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<UserAddComponent>,
    private _dialog: MdDialog,
    public sessionsService: SessionsService,
    public companyService: CompanyService,
    public workerService: WorkerService,
    public userProfileService: UserProfileService,
    private snackBar: MdSnackBar,
    private constructionsService: ConstructionsService,
    private constructionUserProfileService: ConstructionUserProfileService,
    public confirmDialogHandler: ConfirmDialogHandler,
  ) {
    this.userForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, UtilValidators.email]),
    });
    this.currentUser = this.sessionsService.getCurrent() || new User();
    this.currentCompany = this.sessionsService.getCurrentCompany();
  }

  ngOnInit() {
    this.initWorkers();
    this.initProfiles();
    this.initConstructions();
    this.viewUserProfile(this.currentUser.id, this.currentCompany.companyId);
  }

  private initConstructions() {
    this.constructionUserProfileService
      .findAllProfileModulesGroupByConstruction(
        this.sessionsService.getCurrentCompany().companyId,
      )
      .flatMap(values => {
        this.setGlobalNotificationProfiles(values.constructionProfiles);

        let constructionUserProfiles = values.constructionProfiles;
        this.companyProfiles = values.companyProfiles;

        this.handleConstructionsProfile(constructionUserProfiles);
        return Observable.of(constructionUserProfiles);
      })
      .flatMap(values => {
        if (this.managements.user.id) {
          return this.constructionUserProfileService.findAllProfileModulesGroupByConstructionOfUser(
            this.sessionsService.getCurrentCompany().companyId,
            this.managements.user.id,
          );
        } else {
          return null;
        }
      })
      .subscribe(selectedValues => {
        let selectedConstructionProfiles = selectedValues.constructionProfiles;
        this.verifyAllCheckedNotificationProfiles(selectedConstructionProfiles);

        selectedConstructionProfiles.forEach(item => {
          let userItem = this.mapConstructionProfiles[
            item.constructionId + '-' + item.userProfileId
          ];
          if (userItem) {
            userItem.checked = true;
          }
        });

        this.selectedCompanyProfiles = selectedValues.companyProfiles.map(
          item => {
            return item.id;
          },
        );
      });
  }

  private initWorkers() {
    const firstWorker: any = { id: 0, name: 'Não é trabalhador' };
    this.workers.push(firstWorker);
    this.workerService
      .getWorkersByCompany(this.currentCompany.companyId)
      .subscribe(response => {
        response.map((worker: Worker) => {
          this.workers.push({ id: worker.id, name: worker.name });
        });
        this.managements.workerId = this.managements.workerId
          ? this.managements.workerId
          : this.workers[0].id;
      });
  }

  private initProfiles() {
    this.userProfileService.getUserProfiles().subscribe(response => {
      response.map((userProfile: UserProfile) => {
        this.userProfiles.push(userProfile);
      });
    });
    this.managements.profiles.forEach(profile => {
      this.selectedUserProfiles.push(profile.userProfile.id);
    });
  }

  compareById(obj1, obj2) {
    return obj1.id === obj2.id;
  }

  public saveManagements(): void {
    let selectedConstructionProfiles = [];
    let selectedProfiles = new Set<number>();

    this.constructionsProfiles.forEach(constructionProfiles => {
      let profilesChecked = constructionProfiles.profiles
        .filter(profile => profile.checked === true)
        .map(item => {
          return item.id;
        });
      if (profilesChecked.length > 0) {
        selectedConstructionProfiles.push({
          constructionId: constructionProfiles.construction.id,
          profilesId: profilesChecked,
        });

        profilesChecked.forEach(element => {
          selectedProfiles.add(element);
        });
      }
    });

    if (
      this.selectedCompanyProfiles.length < 1 &&
      selectedConstructionProfiles.length < 1
    ) {
      this.snackBar.open(
        'Necessário vincular algum perfil (obra e/ou empresa).',
        null,
        { duration: 5000 },
      );
    } else {
      this.onSelectUserProfile(
        Array.from(selectedProfiles).concat(this.selectedCompanyProfiles),
      );

      this.selectedConstructionProfiles = selectedConstructionProfiles;

      if (this.mode === 'create') {
        this.save();
      } else if (this.mode === 'update') {
        this.update();
      }
    }
  }

  public save() {
    this.managements.company.id = this.currentUser.companyId;
    const isNewUser: Boolean = !this.managements.user.id;
    this.managementsService
      .createManagements(this.managements)
      .flatMap(response => {
        this.managements = response;
        return this.constructionsService.saveUserProfileConstruction(
          this.managements.user.id,
          this.selectedConstructionProfiles,
        );
      })
      .subscribe(
        response => {
          this.dialogRef.close();
          if (isNewUser) {
            this.snackBar.open(
              'Usuário cadastrado com sucesso! Em breve você receberá um e-mail com as instruções para definição de senha.',
              null,
              { duration: 6000 },
            );
            this.linkCompaniesToUser().subscribe();
          } else {
            this.snackBar.open('Usuário cadastrado com sucesso!', null, {
              duration: 4000,
            });
            this.linkCompaniesToUser().subscribe();
          }
        },
        error => {
          this.handleError(error, 'cadastrar');
        },
      );
  }

  public linkCompaniesToUser() {
    if (this.companies.length > 0 && !!this.managements.user.id) {
      return this.managementsService.linkCompaniesToUser(
        this.companies,
        this.managements.user.id,
      );
    }
  }

  public verifyEmailAlreadyExists() {
    if (this.mode === 'create') {
      if (!this.managements.company.id) {
        this.managements.company.id = this.currentCompany.companyId;
      }
      this.managementsService
        .verifyEmailAlreadyExists(this.managements)
        .subscribe(
          response => {
            if (response.user && response.companies) {
              this.loadExistingUser(response.user, response.companies);
            } else {
              this.snackBar.open('Email de usuário válido!', null, {
                duration: 4000,
              });
            }
          },
          error => {
            this.snackBar.open(
              'E-mail já está sendo utilizado para esta empresa!',
              null,
              { duration: 4000 },
            );
            this.managements.user.email = '';
          },
        );
    }
  }

  public update(): void {
    this.managementsService
      .updateManagements(this.managements)
      .flatMap(response => {
        this.managements = response;
        return this.constructionsService.saveUserProfileConstruction(
          this.managements.user.id,
          this.selectedConstructionProfiles,
        );
      })
      .subscribe(
        response => {
          this.updatePermissionsOfCurrentUser();
          this.dialogRef.close();
          this.snackBar.open('Usuário alterado com sucesso!', null, {
            duration: 4000,
          });
        },
        error => {
          this.handleError(error, 'alterar');
        },
      );
  }

  public handleError(error: any, action: String): void {
    if (error.status === 409) {
      this.snackBar.open(
        'Não foi possível ' +
        action +
        ' o usuário. Já existe uma conta cadastrada com esse e-mail para esta empresa.',
        null,
        { duration: 6000 },
      );
    } else {
      this.snackBar.open('Não foi possível ' + action + ' o usuário.', null, {
        duration: 4000,
      });
    }
  }

  public loadExistingUser(user: User, companies: String[]) {
    const description =
      'O email ' +
      this.managements.user.email +
      ' já foi encontrado para a(s) empresa(s) ' +
      companies.join(', ') +
      '. Deseja vincular esse usuário a esta empresa?';
    this.confirmDialogHandler
      .call('Oops', description, { trueValue: 'Sim', falseValue: 'Não' })
      .subscribe(confirm => {
        if (confirm) {
          this.managements.user = user;
          this.userForm.disable();
        } else {
          this.managements.user = new User();
        }
      });
  }

  onWorkerChange() {
    if (this.managements.workerId > 0) {
      let selectedWorker = this.workers.filter(
        item => item.id === this.managements.workerId,
      );
      this.managements.user.name = selectedWorker[0].name;
    } else {
      this.managements.user.name = '';
    }
  }

  onSelectUserProfile(profilesChecked: number[]) {
    this.managements.profiles = [];
    this.userProfiles.forEach(userProfile => {
      if (profilesChecked.filter(profile => profile === userProfile.id)[0]) {
        const managementsProfiles: ManagementsProfiles = <
          ManagementsProfiles
          >{};
        managementsProfiles.userProfile = userProfile;
        this.managements.profiles.push(managementsProfiles);
      }
    });
  }

  updatePermissionsOfCurrentUser() {
    this.constructionUserProfileService
      .findAllPermissionOfCurrentUser(
        this.sessionsService.getCurrentCompany().companyId,
      )
      .subscribe(permissions => {
        this.sessionsService.setUserPermissions(permissions);
      });
  }

  isValid(): boolean {
    return this.userForm.valid || this.userForm.disabled;
  }

  handleConstructionsProfile(constructionUserProfiles: any[]): any[] {
    let constructions = [];
    let map = {};
    constructionUserProfiles.forEach(item => {
      if (!map[item.constructionId]) {
        map[item.constructionId] = item.constructionId;
        constructions.push({
          id: item.constructionId,
          name: item.constructionName,
        });
      }
    });

    this.mapConstructionProfiles = {};

    constructions.forEach(construction => {
      this.constructionsProfiles.push({
        construction: construction,
        profiles: constructionUserProfiles
          .filter(profile => profile.constructionId == construction.id)
          .map(item => {
            let prf = {
              id: item.userProfileId,
              name: item.userProfileName,
              checked: false,
            };
            this.mapConstructionProfiles
            [item.constructionId + '-' + item.userProfileId] = prf;
            return prf;
          }),
      });
    });

    return constructionUserProfiles;
  }

  onChange(check, profile, constructionProfiles, i) {
    const globalProfile = this.globalNotificationProfiles.find(gnp => gnp.name === profile.name);

    if (check.checked) {
      if (profile.name === 'Consultor Sesi') {
        this.constructionUserProfileService
          .canAddUserProfile(profile.id, constructionProfiles.construction.id)
          .subscribe(resul => {
            if (resul.canAdd) {
              profile.checked = true;
            } else {
              profile.checked = false;
              this.messageErrorConstructionProfile[
                constructionProfiles.construction.id
              ] = resul.message;
              check.toggle();
            }
          });
      } else {
        profile.checked = true;

        if (globalProfile) {
          globalProfile.checkedCount++;
          if (globalProfile.checkedCount === globalProfile.constructions) {
            globalProfile.checked = true;
          }
        }
      }

    } else {
      profile.checked = false;

      if (globalProfile) {
        globalProfile.checkedCount--;
        if (globalProfile.checkedCount < globalProfile.constructions) {
          globalProfile.checked = false;
        }
      }
    }
  }

  verifyAllCheckedNotificationProfiles(checkedConstructionProfiles) {
    let checkedCount = 0;
    this.globalNotificationProfiles.forEach(globalNotification => {
      checkedConstructionProfiles.forEach(checkedProfile => {
        if (globalNotification.name === checkedProfile.userProfileName) {
          checkedCount++
        }
      });

      globalNotification.checkedCount = checkedCount;
      if (checkedCount >= globalNotification.constructions) {
        globalNotification.checked = true;
      }

      checkedCount = 0;
    });
  }

  setGlobalNotificationProfiles(constructionProfiles) {
    const globalNotificationProfiles = new Set();

    constructionProfiles.forEach(profile => {
      if (profile.userProfileName.includes('Notificação')) {
        globalNotificationProfiles.add(profile.userProfileName);
      }
    });

    const globalNotificationProfilesArray = Array
      .from(globalNotificationProfiles)
      .map((gp: string) => ({
        name: gp, checked: false, constructions: 0, checkedCount: 0
      }));

    constructionProfiles.forEach(profile => {
      globalNotificationProfilesArray.forEach(globalProfile => {
        if (profile.userProfileName === globalProfile.name) {
          globalProfile.constructions++;
        }
      })
    });

    this.globalNotificationProfiles = globalNotificationProfilesArray;
  }

  onChangeGlobalNotificationProfile(check, notificationProfile, i) {
    const { checked } = check;

    notificationProfile.checked = checked;
    notificationProfile.checkedCount = checked ? notificationProfile.constructions : 0;

    this.constructionsProfiles.forEach(constructionProfile => {
      constructionProfile.profiles.forEach(profile => {
        if (profile.name === notificationProfile.name) {
          profile.checked = checked;
        }
      });
    });
  }

  onCloseModal(companies, managements) {
    this.companies = companies;
    this.managementList = managements;
  }

  async viewCompanyUser() {
    const dialogRef = this._dialog.open(UserAddCompanyComponent, {
      data: { companies: this.companies, managementList: this.managementList },
    });
    dialogRef.afterClosed().subscribe(() => {
      const companies = dialogRef.componentInstance.companiesToAdd;
      const managementList = dialogRef.componentInstance.managementsList;
      this.onCloseModal(companies, managementList);
    });
    dialogRef.componentInstance.managementsList = this.managementList;
    dialogRef.componentInstance.companiesToAdd = this.companies;
    dialogRef.componentInstance.managements = new Managements().initializeWithJSON(
      this.managements,
    );
  }

  async viewUserProfile(userId, companyId) {
    await this.managementsService
      .getUserProfileListByUserAndCompany(userId, companyId)
      .then(
        userProfile => {
          userProfile.filter(profile => {
            switch (profile.name) {
              case 'Admin Sesi':
                this.profiles = true;
                // console.log(`visualizar profiles Admin Sesi: ${this.profiles}`);
                return this.profiles;
              /**
               * Inicio - Implementação em andamento, aguardando retorno.
               */
              // case "Admin Empresa":
              //   if (this.currentUser.companyId == this.managements.company.id) {
              //     this.profiles = true;
              //     console.log(
              //       `visualizar profiles Admin Empresa: ${this.profiles}`
              //     );
              //     return this.profiles;
              // }
              /**
               * Fim - Implementação em andamento, aguardando retorno.
               */
            }
          });
        },
        err => {
          console.log(err);
        },
      );
  }
}
