import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { ReprocessSeaarchcondition } from '../Model/reprocess-seaarchcondition';
import { ReprocessSearch } from '../Model/reprocess-search';
import { MetricReprocessService } from '../Service/metric-reprocess.service';
import { TrackDataGrid } from '../shared/track-data-grid';
import { TrackSearch } from '../shared/track-search';

@Component({
  selector: 'app-metric-reprocess',
  templateUrl: './metric-reprocess.component.html',
  styleUrls: ['./metric-reprocess.component.scss']
})
export class MetricReprocessComponent implements OnInit {
  isLoading: boolean = false;
  isSubmitFormReprocess : boolean = false;
  rfTrackFile: FormGroup;
  rfSearchReprocess: FormGroup;
  trackSearch: TrackSearch;
  trackDataGrid: TrackDataGrid[];
  reprocessSearch: ReprocessSearch;
  isChecked: boolean;
  constructor(private mtReprocessService: MetricReprocessService, private toastr: ToastrService) { }

  ngOnInit() {
    this.rfTrackFile = new FormGroup({
      files: new FormControl('', Validators.required)
    });
    this.rfSearchReprocess = new FormGroup({
      remainProcess: new FormControl(1, Validators.required),
      numberOfThread: new FormControl(5, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.maxLength(3)
      ]),
      importServiceUrl: new FormControl('', Validators.required),
      isUseMTImportService: new FormControl(false, null),
      runOptions: new FormControl('multi', null),
    });
  }

  onSubmitTrack() {
    try {
      console.log(this.isLoading);
      console.log(this.rfTrackFile.valid);
      if (this.rfTrackFile.valid && !this.isLoading) {
        var files = this.rfTrackFile.value.files;
        console.log(files);
        if (files) {
          var cutStr = files.trim().split('\n');
          var datas = cutStr.map(this.filesHandler);
          if (datas) {
            this.isLoading = true;
            this.getStatusFile(datas);
          }
          else {
            // Fail alert
          }
        }
        else {
          //File error
        }
      }
    }
    catch {
      // alert Catch
    }
  }
  onSubmitReprocess() {
    var formValue = this.rfSearchReprocess.value;
    console.log(this.rfSearchReprocess.value);
    let searchCondition = {} as ReprocessSeaarchcondition;
    searchCondition.FlowId = 1; // phase 1
    searchCondition.IsImportMetric = formValue.isUseMTImportService;
    searchCondition.IsRunMultiThread = this.isRunMultiThread(formValue.runOptions.toLowerCase());
    searchCondition.IsRunParallel =  !this.isRunMultiThread(formValue.runOptions.toLowerCase());
    searchCondition.NumberOfThread = this.getNumberFromForm(formValue.numberOfThread , 0,100);
    searchCondition.ImportServiceUrl = this.getStringFromForm(formValue.importServiceUrl);
    let data = {} as ReprocessSearch;
    data.SearchCondition = searchCondition;
    data.TrackDataGrid = this.trackDataGrid;
    this.reprocessSearch = data;
    this.checkValidFormBeforeSubmitReprocess();
    if(this.isSubmitFormReprocess)
    {
      this.mtReprocess(this.reprocessSearch);
    }

    //check issubmit form cuar reprocess data

  }



  //#region  Property
  get files() {
    return this.rfTrackFile.get('files');
  }
  get importServiceUrl() {
    return this.rfSearchReprocess.get('importServiceUrl');
  }
  get numberOfThread() {
    return this.rfSearchReprocess.get('numberOfThread');
  }

  //#endregion
  //#region  Method
  filesHandler(file, index) {
    var fieds = file.trim().split('_');
    let obj = {} as TrackSearch;
    obj.PTransKeyIdIndex = fieds[0] + fieds[1];
    obj.PInboxIdIndex = fieds[2];
    obj.POutboxIdIndex = fieds[2];
    obj.PYearQuaterIdIndex = fieds[3];
    obj.PFromCustIdIndex = fieds[4];
    obj.PToCustIdIndex = fieds[5];
    obj.PTransactionIdIndex = fieds[6];
    obj.PVersionIndex = fieds[7];
    obj.PCodePage = fieds[8];
    obj.Item08 = fieds[9];
    obj.Item09 = fieds[10];
    obj.Item10 = fieds[11];
    obj.FlowId = 1;
    obj.EndItem = fieds[11].split('.')[0];
    obj.Files = file;
    return obj;
  }

  trackDataGridHandler(item, index) {
    let trackGridItem = {} as TrackDataGrid;
    trackGridItem.InOutboxId = item.InOutboxId;
    trackGridItem.TransactionType = item.TransactionType;
    trackGridItem.IntergrationStatus = item.IntergrationStatus;
    trackGridItem.FileName = item.FileName;
    trackGridItem.Note = item.Note;
    trackGridItem.Files = item.Files;
    var inteStatus = item.TransactionType.toLowerCase();
    var note = item.Note.toLowerCase();
    var isCheckedItem = false;
    if (inteStatus !== "success" && inteStatus !== "pass" && inteStatus !== "hold" && inteStatus !== "importing"
      && !note.toLowerCase().includes("not exist in diasciir9 database")) {
      isCheckedItem = true;
    }
    trackGridItem.IsChecked = isCheckedItem;
    return trackGridItem;
  }
  onUnsuccessOrNotImpBtnClick() {
    if (this.trackDataGrid) {
      this.isLoading = true;
      this.trackDataGrid = this.trackDataGrid.map(this.trackDataGridHandler);
      console.log(this.trackDataGrid);
      this.isLoading = false;
    }
  }
  isCheckedItem(inteStatus: string, note: string) {
    inteStatus = inteStatus.toLowerCase();
    if (inteStatus !== "success" && inteStatus !== "pass" && inteStatus !== "hold" && inteStatus !== "importing"
      && !note.toLowerCase().includes("not exist in diasciir9 database"))
      return true;
    else
      return false;
  }
  isRunMultiThread(value: string): boolean {
    if (value.trim().includes("multi") || value.trim().includes("parallel")) {
      if (value === "multi")
        return true;
      else
        return false;
    }
    else {
      return true;
    }
  }
  getNumberFromForm(value: number , minValue:  number , maxValue : number)
  {
    if(value > minValue  && value <= maxValue )
    {
      return value;
    }
    return 0;
  }
  getStringFromForm(value:string)
  {
    value = value.trim();
    if(value ==="" || value === undefined || value ===null )
    return "";
    else
    return value;
  }
  checkValidFormBeforeSubmitReprocess()
  {
      if(this.rfSearchReprocess.valid && !this.isLoading )
      {
        if(this.trackDataGrid !== undefined  && this.trackDataGrid.length > 0  && this.trackDataGrid)
        {
          this.isSubmitFormReprocess = true;
        }
        else
        {
          this.isSubmitFormReprocess = false;;
        }
      }
      else
      {
        this.isSubmitFormReprocess = false;;
      }
  }
  //#endregion
  //#region  Alert Toasrt

  alertSuccess(message: string) {
    this.toastr.success(message, "Success");
  }
  alertError(message: string) {
    this.toastr.error(message, "Fail");
  }
  //#endregion
  //#region  CALL Service
  getStatusFile(datas) {
    this.mtReprocessService.getStatusFiles(datas).subscribe(res => {
      this.isLoading = false;
      this.trackDataGrid = res;
      console.log(res);
      this.alertSuccess("Track status " + this.trackDataGrid.length);
    })
  }
  mtReprocess(reprocessSearch)
  {
    this.mtReprocessService.mtReprocess(reprocessSearch).subscribe(res => {
      console.log("Success");

    })
  }
  //#endregion
}
