import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { isEmptyObject } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MtReprocessDataGrid } from '../Model/mt-reprocess-data-grid';

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
  isSubmitFormReprocess: boolean = false;
  rfTrackFile: FormGroup;
  rfSearchReprocess: FormGroup;
  trackSearch: TrackSearch;
  trackDataGrid: TrackDataGrid[];
  reprocessSearch: ReprocessSearch;
  mtReprocessGrid: MtReprocessDataGrid[];
  isChecked: boolean;
  isReprocess: boolean;
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
      isUseMTImportService: new FormControl(true, null),
      runOptions: new FormControl('multi', null),
    });
  }

  onSubmitTrack() {
    try {
      console.log(this.isLoading);
      console.log(this.rfTrackFile.valid);
      if (this.rfTrackFile.valid && !this.isLoading) {
        var files = this.rfTrackFile.value.files;
        this.getStatusFileGrid(files);
      }
    }
    catch {
      // alert Catch
    }
  }
  onSubmitReprocess() {
    var trackGridHaveItemChecked: TrackDataGrid[] = [];
    trackGridHaveItemChecked = this.trackDataGrid.filter(function (item, index) {
      return item.IsChecked === true;
    })
    var formValue = this.rfSearchReprocess.value;
    let searchCondition = {} as ReprocessSeaarchcondition;
    searchCondition.FlowId = 1; // phase 1
    searchCondition.IsImportMetric = formValue.isUseMTImportService;
    searchCondition.IsRunMultiThread = this.isRunMultiThread(formValue.runOptions.toLowerCase());
    searchCondition.IsRunParallel = !this.isRunMultiThread(formValue.runOptions.toLowerCase());
    searchCondition.NumberOfThread = this.getNumberFromForm(formValue.numberOfThread, 0, 100);
    searchCondition.ImportServiceUrl = this.getStringFromForm(formValue.importServiceUrl);
    let data = {} as ReprocessSearch;
    data.SearchCondition = searchCondition;
    data.TrackDataGrid = trackGridHaveItemChecked;
    this.reprocessSearch = data;
    this.checkValidFormBeforeSubmitReprocess(trackGridHaveItemChecked);
    if (this.isSubmitFormReprocess) {
      this.mtReprocess(this.reprocessSearch);
    }
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
    trackGridItem.FilePath = item.FilePath;
    trackGridItem.Index  = item.Index;
    var inteStatus = item.TransactionType.toLowerCase();
    var note = item.Note.toLowerCase();
    var isCheckedItem = false;
    if (inteStatus !== "success" && inteStatus !== "pass" && inteStatus !== "hold" && inteStatus !== "importing"
      && !note.toLowerCase().includes("not exist in diasciir9 database")) {
      isCheckedItem = true;
    }
    if (isCheckedItem) {
      trackGridItem.IsChecked = isCheckedItem;
      trackGridItem.IsDisable = isCheckedItem;
    }


    return trackGridItem;
  }

  getFilesChecked(accumulator, currentValue, currentIndex, originArray) {
    return accumulator += currentValue.FilePath + "\n";
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
  getNumberFromForm(value: number, minValue: number, maxValue: number) {
    if (value > minValue && value <= maxValue) {
      return value;
    }
    return 0;
  }
  getStringFromForm(value: string) {
    value = value.trim();
    if (value === "" || value === undefined || value === null)
      return "";
    else
      return value;
  }
  checkValidFormBeforeSubmitReprocess(trackGridHaveItemChecked) {
    if (this.rfSearchReprocess.valid && !this.isLoading) {
      if (trackGridHaveItemChecked !== undefined && trackGridHaveItemChecked.length > 0
        && trackGridHaveItemChecked) {
        this.isSubmitFormReprocess = true;
      }
      else {
        this.isSubmitFormReprocess = false;
      }
    }
    else {
      this.isSubmitFormReprocess = false;
    }
  }
  onChangenumberOfThread(e) {
    if (isNaN(+e)) {
      this.rfSearchReprocess.value.numberOfThread = 5;
    }
    else {
      this.rfSearchReprocess.value.numberOfThread = e;
    }
  }
  onCheckboxValue(ev, data) {
    if (data) {
      this.trackDataGrid.forEach(function (item, index) {
        if (!item.IsDisable) {
          if (item.Index === data.Index) {
            if (ev.target.checked) {
              item.IsChecked = true;
            }
            else {
              item.IsChecked = false;
            }
          }
         }
      });
    }
  }
  //#endregion

  //#region  CALL Service
  getStatusFileGrid(files) {
    if (files) {
      var cutStr = files.trim().split('\n');
      var datas = cutStr.map(this.filesHandler);
      if (datas) {
        this.isLoading = true;
        this.mtReprocessService.getStatusFiles(datas).subscribe(res => {
          this.isLoading = false;
          this.trackDataGrid = res;
          console.log(this.trackDataGrid);
          this.alertSuccess("Track status " + this.trackDataGrid.length);
        })
      }
      else {
        // Fail alert
      }
    }
    else {
      //File error
    }
  }

  mtReprocess(reprocessSearch: ReprocessSearch) {
    if (reprocessSearch) {
      this.isLoading = true;
      this.mtReprocessService.mtReprocess(reprocessSearch).subscribe(res => {
        this.mtReprocessGrid = res;
      })
      if (this.rfSearchReprocess.value.isUseMTImportService) {
        this.getStatusFileGrid(this.files)
        // var checkedFiles = reprocessSearch.TrackDataGrid.reduce(this.getFilesChecked, "");
        // var trackFileReprocess = reprocessSearch.TrackDataGrid.map(this.getTrackFileReprocessItem);
      }
    }
    //Call TrackGrid again

  }
  //Not Use
  getTrackFileReprocessItem(item, index) {
    if (item.FilePath.trim()) {
      var fieds = item.FilePath.trim().split('_');
      let obj = {} as TrackSearch;
      obj.Index = item.Index;
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
      obj.Files = item.FilePath;
      obj.IsReprocess = true;
      return obj;
    }
    else {
      return null;
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
}
