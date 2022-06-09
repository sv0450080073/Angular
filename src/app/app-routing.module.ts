import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { ClassComponent } from './class/class.component';
import { MetricReprocessComponent } from './metric-reprocess/metric-reprocess.component';
import { ShowStudentComponent } from './student/show-student/show-student.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [

 { path: "Home/About", component:AboutComponent },
 { path: "Employee", component:MetricReprocessComponent },
 { path: "MetricsReprocess", component: MetricReprocessComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] , declarations:[]
})
export class AppRoutingModule { }
