import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { StudentService } from 'src/app/Service/student.service';
import { Result } from 'src/app/shared/result';
import { Student } from 'src/app/shared/student.model';

@Component({
  selector: 'app-show-student',
  templateUrl: './show-student.component.html',
  styleUrls: ['./show-student.component.scss']
})
export class ShowStudentComponent implements OnInit {
  isLoading: boolean = false;
  students : Observable<Student[]>;
  result: Result;
  constructor(private studentService : StudentService,private toastr:ToastrService) { }

  ngOnInit() {
    this.students = this.studentService.getStudentsV1();
    console.log(this.students);
  }
  modalTile: string ='';
  activeAddEditStudentComponent : boolean =false;
  student : Student;

modalAdd() {
  this.student = {
    Id:0 ,
    Index:0,
    Name:null,
    Age:0,
    Address:null
  }
  this.modalTile  = "Add Employee ";
  this.activeAddEditStudentComponent = true;
}
modalEdit(item:any){
  this.activeAddEditStudentComponent = true;
  this.student = item;
  this.modalTile = "Edit Employee "
}
modalClose() {
  this.activeAddEditStudentComponent = false;
  this.students = this.studentService.getStudentsV1();
  console.log(this.students );

}
delete(item:any) {
  if(confirm(`Are you sure you want to delete employee ${item.Index}`)) {

    this.isLoading =  true;
    this.studentService.deleteStudent(item.Id).subscribe(res => {
      this.isLoading =  false;
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn)
      {
        closeModalBtn.click();
      }
      this.result = res;
      if(this.result.IsSuccess)
      {
        this.toastr.success("Employee successfully deleted !", "Success");
      //   setTimeout(() => {
      //   window.alert(" ");
      // }, 1000);
      }
      else
      {

        this.toastr.error("Employee failly deleted !", "Fail");
      //   setTimeout(() => {
      //   window.alert("Student failly deleted !");
      // }, 1000);
      }
      this.studentService.getStudentsV1();
    })
  }
}
loaderHanler($event) {
  this.isLoading = $event;
}

}
