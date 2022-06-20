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
      files: new FormControl(""
        , Validators.required)
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

  onSubmitBtnTrack() {
    try {
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
    console.log("onSubmitReprocess");
    console.log(trackGridHaveItemChecked);

    this.reprocessSearch = data;
    this.checkValidFormBeforeSubmitReprocess(trackGridHaveItemChecked);
    if (this.isSubmitFormReprocess) {
      this.getReprocessGrid(this.reprocessSearch);
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
    var fileRemovePath = file.slice(file.trim().lastIndexOf("\\") + 1);
    var fieds = fileRemovePath.trim().split('_');
    let obj = {} as TrackSearch;
    obj.PTransKeyIdIndex = fieds[0];
    obj.PInboxIdIndex = fieds[1];
    obj.POutboxIdIndex = fieds[1];
    obj.PYearQuaterIdIndex = fieds[2];
    obj.PFromCustIdIndex = fieds[3];
    obj.PToCustIdIndex = fieds[4];
    obj.PTransactionIdIndex = fieds[5];
    obj.PVersionIndex = fieds[6];
    obj.PCodePage = fieds[7];
    obj.Item08 = fieds[8];
    obj.Item09 = fieds[9];
    obj.Item10 = fieds[10];
    obj.FlowId = 1;
    obj.EndItem = fieds[10].split('.')[0];
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
    trackGridItem.Index = item.Index;
    trackGridItem.CustomerId = item.CustomerId;
    trackGridItem.YearQuarter = item.YearQuarter;
    var inteStatus = item.IntergrationStatus.toLowerCase();
    var note = item.Note.toLowerCase();
    var isCheckedItem = false;
    if (inteStatus !== "success" && inteStatus !== "pass" && inteStatus !== "hold" && inteStatus !== "importing"
      && !note.toLowerCase().includes("not exist in diasciir9 database")) {
      isCheckedItem = true;
    }
    trackGridItem.IsChecked = isCheckedItem;
    trackGridItem.IsDisable = isCheckedItem;
    return trackGridItem;
  }
  trackFileReprocessItemHandler(item, index) {
    if (item) {
      var fieds = item.trim().split('_');
      let obj = {} as TrackSearch;
      obj.PTransKeyIdIndex = fieds[0]
      obj.PInboxIdIndex = fieds[1];
      obj.POutboxIdIndex = fieds[1];
      obj.PYearQuaterIdIndex = fieds[2];
      obj.PFromCustIdIndex = fieds[3];
      obj.PToCustIdIndex = fieds[4];
      obj.PTransactionIdIndex = fieds[5];
      obj.PVersionIndex = fieds[6];
      obj.PCodePage = fieds[7];
      obj.Item08 = fieds[8];
      obj.Item09 = fieds[9];
      obj.Item10 = fieds[10].split('_')[0];
      obj.FlowId = 1;
      obj.EndItem = fieds[10].split('.')[0];
      obj.Extension = fieds[10].split('.')[1];
      obj.IsReprocess = true;
      obj.Index = fieds[11];
      return obj;
    }
    else {
      return null;
    }

  }
  getFilesChecked(accumulator, currentValue, currentIndex, originArray) {
    let infoReprocess = "_" + currentValue.Index;
    return accumulator += currentValue.FilePath + infoReprocess + "\n";
  }
  onUnsuccessOrNotImpBtnClick() {
    if (this.trackDataGrid) {
      this.isLoading = true;
      this.trackDataGrid = this.trackDataGrid.map(this.trackDataGridHandler);
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
  updateStatusTrackGridThenReporcess(trackdataGridNew: TrackDataGrid[]) {
    for (const item of trackdataGridNew) {
      this.showUpdatedItem(item);
    }
  }
  showUpdatedItem(newItem) {
    let updateItem = this.trackDataGrid.find(this.findIndexToUpdate, newItem.Index);
    let index = this.trackDataGrid.indexOf(updateItem);
    this.trackDataGrid[index] = newItem;
  }
  findIndexToUpdate(newItem) {
    return newItem.Index === this;
  }
  //#endregion

  //#region  CALL Service
  getStatusFileGrid(files) {
    if (files) {
      var cutStr = files.trim().split('\n');
      console.log(cutStr);
      var datas = cutStr.map(this.filesHandler);
      console.log(datas);
      if (datas) {
        this.isLoading = true;
        this.mtReprocessService.getStatusFiles(datas).subscribe(res => {
          this.isLoading = false;
          this.trackDataGrid = res;
          console.log(res);
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

  getReprocessGrid(reprocessSearch: ReprocessSearch) {
    if (reprocessSearch) {
      this.isLoading = true;
      this.mtReprocessService.mtReprocess(reprocessSearch).toPromise()
      .then(res => {
        this.mtReprocessGrid = res;
        this.isLoading = false;
        this.alertSuccess("Reprocess success !");
      }).then (res=> {
        if (this.rfSearchReprocess.value.isUseMTImportService) {
          var checkedFiles = reprocessSearch.TrackDataGrid.reduce(this.getFilesChecked, "");
          if (checkedFiles) {
            var cutStr = checkedFiles.trim().split('\n');
            var datas = cutStr.map(this.trackFileReprocessItemHandler);
            if (datas) {
              this.isLoading = true;
              this.mtReprocessService.getStatusFiles(datas).subscribe(res => {
                this.isLoading = false;
                this.updateStatusTrackGridThenReporcess(res);
                this.alertSuccess("Update status track view success !");
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
      })
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
