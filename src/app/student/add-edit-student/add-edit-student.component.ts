import { Component, EventEmitter, Input,OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { StudentService } from 'src/app/Service/student.service';
import { Result } from 'src/app/shared/result';
import { Student } from 'src/app/shared/student.model';
@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.scss']
})
export class AddEditStudentComponent implements OnInit {

  constructor(private studentService:StudentService , private toastr:ToastrService) { }
  exform:FormGroup;
  result : Result ={ IsSuccess : false};
  @Input() student: Student;
  @Output()
  public onLoaded = new EventEmitter<boolean>();
  Id:number  = 0 ;
  Name:string = "";
  Age:number = 0;
  Address: string = "";
  ngOnInit() : void {
  this.Id = this.student.Id;
  this.Name = this.student.Name;
  this.Age = this.student.Age;
  this.Address = this.student.Address;
  //validate
    this.exform = new FormGroup({
      'n' : new FormControl(null,Validators.required),
      'a' : new FormControl(
        null,
        [Validators.required,
          Validators.min(1),
          Validators.max(100),
        ]
        ),
      'ad' : new FormControl(null,Validators.required)
    })
  }
  addStudent(){
    var studenttemp = {
      Name:this.Name,
      Age:this.Age,
      Address:this.Address
    }
    this.onLoaded.emit(true);
    console.log(studenttemp);
    this.studentService.createStudent(studenttemp).toPromise()
    .then(response => {
      this.onLoaded.emit(false);
      console.log(response);

      this.result = response;
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn)
      {
        closeModalBtn.click();
      }
      if(this.result.IsSuccess)
      {
        this.toastr.success("Employee successfully added !", "Success");

      }
      else
      {
        this.toastr.error("Employee failly added !", "Fail");
      }
    })
  }
  updateStudent(){
    var studenttemp = {
      Id:this.Id,
      Name:this.Name,
      Age:this.Age,
      Address:this.Address
    }
      var id:number   = this.Id;
      this.onLoaded.emit(true);
       this.studentService.updateStudent(studenttemp).subscribe(res=> {
        this.onLoaded.emit(false);
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn)
      {
        closeModalBtn.click();
      }
      this.result = res;


      if(this.result.IsSuccess)
      {
        this.toastr.success("Employee successfully updated !", "Success");

      }
      else
      {
        this.toastr.error("Employee failly updated !", "Fail");
      }

    })
  }

  //#region  Property
  get name()
  {
    return this.exform.get('n');
  }
  get age()
  {
    return this.exform.get('a');
  }
  get address()
  {
    return this.exform.get('ad');
  }
  //#endregion
}
