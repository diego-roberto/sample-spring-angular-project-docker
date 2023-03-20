import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'sample-form',
    templateUrl: 'form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class SampleFormComponent implements OnInit {

    // @ViewChild('bodyContent') datailsCard: CardComponent;
    // @ViewChild('sampleDataForm') sampleDataForm: SupplierDataFormComponent;

    sample: Sample = new Sample();

    constructor(
        private sampleService: SampleService,
        public snackBar: MdSnackBar,
        private router: Router,
        private route: ActivatedRoute
        private service: HttpClientService
    ) { }

    ngOnInit() {
        this.checkSampleToEdit();
    }

    checkSampleToEdit() {
        this.route.params.subscribe(params => {
            const sampleId = params['id'];

            if (sampleId) {
                this.sampleService.getSupplier(sampleId).subscribe(sample => {
                    this.sample = sample;
                });
            }
        });
    }

    private saveSample(self: FormComponent, sampleToSave: Sample): Observable<Sample> {
        return self.sampleService.saveSample(sampleToSave);
    }

    protected getInitialInstance(): Sample {
        let sample: Sample;
        this.route.data.subscribe(routeData => {
            sample = routeData.sample;
        });
        return sample;
    }

    protected handleSaveError(err) {
      const error = err.json();

      if(error){
        if(error.status == 400){
          if (error.errors && error.errors.length > 0) {
            this.notifyUser(error.errors[0].message);
          } else if (error.message){
            this.notifyUser(error.message);
          }
        } else {
          this.notifyUser('Server Error!');
        }
      } else {
        this.notifyUser('Server Error!');
      }
    }

    protected notifyUser(message: string) {
        this.snackBar.open(message, null, { duration: 3000 });
    }

}
