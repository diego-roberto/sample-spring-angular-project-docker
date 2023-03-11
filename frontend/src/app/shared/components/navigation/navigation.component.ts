import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SessionsService } from 'app/shared/services/sessions.service';
import { CompanyService } from 'app/shared/services/company.service';
import { Company } from 'app/shared/models/company.model';
import { User } from 'app/shared/models/user.model';
import { EnumPermission } from '../../models/permission/enum-permission';
import { PermissionService } from '../../services/permission.service';
import { Option } from 'app/shared/models/option.model';


@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [CompanyService]
})

export class NavigationComponent implements OnInit {
  company: Company;
  logo: string;
  currentUser: User;
  navbarHoverLock: boolean = false;
  optionsList: Array<Option>;

  menuItems = {
    main: [
      { route: 'constructions', icon: 'safety-icn-obra-svg', label: 'minhas obras', expectedPermissions: [EnumPermission.CONSTRUCTION_LIST_CONSTRUCTIONS] },

    ],
    setup: [
      {
        route: 'company', icon: 'safety-icn-company-svg', label: 'empresa',
        expectedPermissions: [EnumPermission.COMPANY_COMPANY_CREATE, EnumPermission.COMPANY_COMPANY_EDIT, EnumPermission.COMPANY_USER_LIST]
      },
      {
        route: 'suppliers', icon: 'safety-icn-gerenciamento-svg', label: 'fornecedores', expectedPermissions: [
          EnumPermission.COMPANY_SUPPLIERS_LIST,
        ]
      },
      {
        route: 'dashboard', mdIcon: 'pie_chart', label: 'Dashboard', expectedPermissions: [
          EnumPermission.COMPANY_DASHBOARD_LIST,
        ]
      },
      {
        route: 'workers', icon: 'safety-icn-worker-svg', label: 'trabalhadores', expectedPermissions: [
          EnumPermission.COMPANY_WORKERS_LIST,
        ]
      },

      {
        route: 'training/page/1/exclude/0', icon: 'safety-icn-capacita-svg', label: 'capacitações', expectedPermissions: [
          EnumPermission.COMPANY_TRAINING_LIST,
        ]
      },
      { route: 'totem', icon: 'safety-icn-toten-svg', label: 'totem' },
    ],
    settings: [
      {
        route: 'reports', mdIcon: 'assignment', label: 'Relatórios', expectedPermissions: [
          EnumPermission.COMPANY_REPORT,
        ]
      },
      {
        route: 'settings', mdIcon: 'settings', label: 'Configurações', expectedPermissions: [
          EnumPermission.COMPANY_SETTINGS,
        ]
      },
    ],
  };

  constructor(private router: Router, private service: CompanyService, private sessionsService: SessionsService,
    public permissionService: PermissionService) {
    this.currentUser = this.sessionsService.getCurrent() || new User();
  }

  ngOnInit(): void {
    this.getCompany();
    this.checkOptions();
    this.applyOptions();
  }

  getCompany(): void {
    this.service.getCompany(this.currentUser.companyId).subscribe(response => {
      this.logo = response.fakeName ? response.fakeName.charAt(0) : '?';
      this.company = new Company(response);
    }
    );
  }

  activeRoute(routename: string): boolean {
    const splitRouteName = routename.split('/');
    const routeUrlIndex = this.router.url.indexOf(splitRouteName[0]);
    return routeUrlIndex === 1;
  }

  checkOptions() {
    this.optionsList = JSON.parse(sessionStorage.getItem('settings_options'));

    if (this.optionsList != null) {
      this.optionsList.forEach(option => {

        if (option.name === 'navbar_hover') {
          this.navbarHoverLock = option.value;
        }

      })
    }
  }

  applyOptions() {
    if (this.navbarHoverLock) {
      document.documentElement.style.setProperty('--maximized-width', '65px');
    } else {
      document.documentElement.style.setProperty('--maximized-width', '500px');
    }
  }

  canEnableTooltip(tooltipText: string) {
    return this.navbarHoverLock ? tooltipText : "";
  }
}
