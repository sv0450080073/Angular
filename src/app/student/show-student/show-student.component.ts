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
  this.modalTile  = "Add Student ";
  this.activeAddEditStudentComponent = true;
}
modalEdit(item:any){
  this.activeAddEditStudentComponent = true;
  this.student = item;
  this.modalTile = "Edit Student "
}
modalClose() {
  this.activeAddEditStudentComponent = false;
  this.students = this.studentService.getStudentsV1();
}
delete(item:any) {
  if(confirm(`Are you sure you want to delete student ${item.Index}`)) {
    this.studentService.deleteStudent(item.Id).subscribe(res => {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn)
      {
        closeModalBtn.click();
      }
      this.result = res;
      console.log(res);
      if(this.result.IsSuccess)
      {  setTimeout(() => {
        window.alert("Student successfully deleted ! ");
      }, 1000);
      }
      else
      {setTimeout(() => {
        window.alert("Student failly deleted !");
      }, 1000);
      }
      this.studentService.getStudentsV1();
    })
  }
}

}
