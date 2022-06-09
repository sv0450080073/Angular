import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MetricReprocessService } from '../Service/metric-reprocess.service';
import { TrackDataGrid } from '../shared/track-data-grid';
import { TrackSearch } from '../shared/track-search';

@Component({
  selector: 'app-metric-reprocess',
  templateUrl: './metric-reprocess.component.html',
  styleUrls: ['./metric-reprocess.component.scss']
})
export class MetricReprocessComponent implements OnInit {
  rfTrackFile : FormGroup;
  trackSearch : TrackSearch;
  trackDataGrid : TrackDataGrid[];
  constructor(private mtReprocess: MetricReprocessService) { }

  ngOnInit() {
    this.rfTrackFile = new FormGroup({
      files : new FormControl('',Validators.required)
    })
  }

  onSubmit()
  {
    var str = this.rfTrackFile.value.files;
   var cutStr = str.trim().split('\n');
   console.log(typeof cutStr);
   //console.log(cutStr);
    var mapStr= cutStr.map(this.filesHandler);
    console.log(mapStr);

  this.mtReprocess.getStatusFiles(mapStr).subscribe(res => {

      this.trackDataGrid= res;

      console.log(res);

   })
  }


    filesHandler (file,index) {
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
          obj.EndItem ="inbox";
          return  obj ;
    }

}
