import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog } from '@angular/material';

import { SampleService } from '../../../../shared/service/sample.service';
import { Sample } from '../../../../shared/model/sample';

@Component({
  selector: 'sample-list',
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})

export class SampleListComponent implements OnInit {

  samples: Sample[];

constructor(
  private dialog: MdDialog,
  private router: Router,
  private route: ActivatedRoute, 
  private sampleService: SampleService
){}

  ngOnInit() {
    this.fetchSamples();
  }

  fetchSamples() {
    this.sampleService.getSampleList().subscribe((response) => {
      this.samples = response.samples;
    });
  }

  editSample(id: number) {
    const urlEditing = '/samples/' + id + '/edit';
    this.router.navigate([urlEditing], { relativeTo: this.route });
  }

  deleteSample(sample: Sample) {
    //TODO: implementar confirmação (dialog)
    this.sampleService.deleteSample(sample);
  }

  redirectTo(path) {
    this.router.navigate([path], { relativeTo: this.route });
  }

}
