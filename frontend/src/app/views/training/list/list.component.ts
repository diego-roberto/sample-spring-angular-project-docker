import { Observable } from 'rxjs/Observable';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainingService } from '../../../shared/services/training.service';
import { Training } from 'app/shared/models/training.model';
import { variable } from '@angular/compiler/src/output/output_ast';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { TrainingConfirmDialogComponent } from 'app/views/training/training-confirm-dialog/training-confirm-dialog.component';
@Component({
  selector: 'safety-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})


export class TrainingListComponent implements OnInit {
  @Input() training: Training;

  trainings: Array<Training> = new Array<Training>();
  showSearch = false;
  showListDashboard = true;
  trainingList: Training[] = [];
  lista: string;
  activeFilters = {
    text: '',
    professionalize: false,
    sst: false,
    others: false,
  };
  page: any;
  @Input() query: string;
  functions: any;

  categoriesFilter: string;
  filters: boolean[] = [false, false, false];
  open = false;
  fixed = false;
  spin = true;
  direction = 'up';
  animationMode = 'fling';
  loading = true;
  showFabButton = false;

  constructor(
    public trainingService: TrainingService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MdDialog,

  ) { }

  ngOnInit() {
    this.route
      .params
      .subscribe(params => {
        this.page = (params['page']);
        if (this.route.snapshot.queryParams['q']) {
          this.query = this.route.snapshot.queryParams['q'];
        } else {
          this.query = '';
        }
      });

    this.trainings = [];
    this.categoriesFilter = '0';
    this.trainingService.getTrainingList(0, '0', this.query).subscribe((training) => {
      this.trainings = training;
    });
    this.setShowFabButton();
  }

  setShowFabButton() {
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        this.showFabButton = true;
      }
    }, 200);
  }

  onSearchValueChange(text: string) {
    this.query = text;
  }

  redirectTo(path) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  togglePage(newPage: Number) {
    if (newPage <= 0) {
      newPage = 1;
    }
    this.page = newPage;
    this.updateCategoriesFilter();
    this.reload();
    this.router.navigate(['../../../../page/' + newPage + '/exclude/0'], { queryParams: { q: this.query }, relativeTo: this.route });
  }

  updateCategoriesFilter() {
    this.categoriesFilter = '';
    let separator = '';
    this.filters.forEach((item, index) => {
      if (item) {
        this.categoriesFilter = this.categoriesFilter + separator + index;
        separator = '-';
      }
    });
    if (this.categoriesFilter.length === 0) {
      this.categoriesFilter = '0';
    }
  }

  update() {
    this.trainingService.getTrainingList(0, '0', this.query).subscribe((training) => {
      this.trainings = training;
    });
    this.reload();
  }

  confirmInactivate(training) {
    const dialogRef = this.dialog.open(TrainingConfirmDialogComponent, { width: '400px' });
    dialogRef.componentInstance.id = training.id;
    dialogRef.afterClosed().subscribe(() => {
      this.togglePage(1);
    });
  }

  toggleActiveFilter(id: any) {
    this.filters[id] = !this.filters[id];
    this.page = 1;
    this.updateCategoriesFilter();
    this.reload();
    this.router.navigate(['../../../../page/1/exclude/' + this.categoriesFilter], { queryParams: { q: this.query }, relativeTo: this.route });
  }

  reload() {
    this.trainingService.getTrainingList(this.page - 1, this.categoriesFilter, this.query).subscribe((training) => {
      this.trainings = training;
    });
  }

  doSearch() {
    this.page = 1;
    this.reload();
    this.router.navigate(['../../../../page/' + this.page + '/exclude/0'], { queryParams: { q: this.query }, relativeTo: this.route });
  }

  updateQuery(q: string) {
    this.query = q;
  }

}
