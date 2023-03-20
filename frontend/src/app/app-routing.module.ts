import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/sample', pathMatch: 'full' },
  // { path: 'sample', component: SampleComponent },
  { path: 'sample', loadChildren: () => import('./views/sample/sample.module').then(m => m.SampleModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
