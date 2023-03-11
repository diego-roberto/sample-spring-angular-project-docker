import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ConstructionItemResolver } from '../../../../../../resolves/construction.item.resolver';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ConstructionsService } from '../../../../../../shared/services/constructions.service';
import { Construction } from '../../../../../../shared/models/construction.model';
import { ConstructionFormBase } from '../construction-generic/construction-form-base';
import { ConstructionManagers } from '../construction-managers-form/construction-managers-form.model';
import { ConstructionModules } from './construction-modules-form.model';
import { MdSnackBar } from '@angular/material';
import { SessionsService } from '../../../../../../shared/services/sessions.service';
import { ConstructionUserProfileService } from '../../../../../../shared/services/construction-user-profile.service';
import { Module } from '../../../../../../shared/models/module.model';
import { PermissionService } from '../../../../../../shared/services/permission.service';

@Component({
  selector: 'construction-modules-form',
  templateUrl: './construction-modules-form.component.html',
  styleUrls: ['./construction-modules-form.component.scss']
})
export class ConstructionModulesFormComponent extends ConstructionFormBase<ConstructionModules> implements OnInit {

  @Output() saved: EventEmitter<any> = new EventEmitter();

  itemsModules: Array<any> = [];

  constructionModulesFormGroup: FormGroup;
  construction: Construction;

  constructor(
    public constructionItemResolver: ConstructionItemResolver,
    private constructionsService: ConstructionsService,
    private formBuilder: FormBuilder,
    private snackBar: MdSnackBar,
    private sessionsService: SessionsService,
    private constructionUserProfileService: ConstructionUserProfileService,
    private permissionService: PermissionService
  ) {
    super(constructionItemResolver);
  }

  protected create(): ConstructionModules {
    return new ConstructionModules();
  }

  ngOnInit() {
    this.construction = this.constructionItemResolver.getValue();
    this.constructionModulesFormGroup = this.formBuilder.group({
      selectedItems: this.formBuilder.array([])
    });

    this.loadModules();
  }

  loadModules() {
    this.itemsModules = [];
    this.permissionService.getAllModules().subscribe(response => {

      response.map((module: Module) => {
        this.itemsModules.push(module);
      });
      this.loadModulesOfConstruction();
    });
  }

  loadModulesOfConstruction() {
    if (this.construction && this.construction.id) {
      this.constructionsService.getModules(this.construction.id)
        .subscribe(modules => {

          const selectedItems = <FormArray>this.constructionModulesFormGroup.get('selectedItems') as FormArray;
          modules.forEach(moduleId => {
            selectedItems.push(new FormControl(moduleId));
            let item = this.itemsModules.filter(
              ietmModule => ietmModule.id === moduleId);
            item[0].checked = true;
          });
        });
    }
  }

  onChange(event) {
    const selectedItems = <FormArray>this.constructionModulesFormGroup.get('selectedItems') as FormArray;

    if (event.checked) {
      selectedItems.push(new FormControl(event.source.value));
    } else {
      const i = selectedItems.controls.findIndex(x => x.value === event.source.value);
      selectedItems.removeAt(i);
    }
  }

  save() {
    const modulesId = this.constructionModulesFormGroup.value.selectedItems;
    this.constructionsService.saveConstructionModules(this.constructionItemResolver.getValue(), modulesId).subscribe(
      (modules) => {
        this.updatePermissionsOfCurrentUser();
        this.notifyUser('Módulos da obra atualizado com sucesso');
        this.saved.emit();
      },
      error => {
        console.log(error);
        this.notifyUser('Erro ao salvar os Módulos da obra!');
      }
    );
  }

  updatePermissionsOfCurrentUser() {

    this.constructionUserProfileService.findAllPermissionOfCurrentUser(this.sessionsService.getCurrentCompany().companyId).subscribe(permissions => {
      this.sessionsService.setUserPermissions(permissions);
    });
  }

  isValidForm() {
    if (this.isEditing() && this.constructionModulesFormGroup.value.selectedItems.length > 0) {
      return true;
    }
    return false;
  }

  protected notifyUser(message: string) {
    this.snackBar.open(message, null, { duration: 3000 });
  }
}

