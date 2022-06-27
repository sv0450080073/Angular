import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MtReprocessDataGrid } from '../Model/mt-reprocess-data-grid';
import { ReprocessSearch } from '../Model/reprocess-search';
import { TrackDataGrid } from '../shared/track-data-grid';
import { TrackSearch } from '../shared/track-search';

@Injectable({
  providedIn: 'root'
})
export class MetricReprocessService {


  constructor( private httpClient:HttpClient) { }
  private API_URL= "http://192.168.203.33:2001"//environment.API_URL;
  url = this.API_URL +"/MetricsReprocess";
  getStatusFiles(trackSearch : TrackSearch) : Observable<TrackDataGrid[]>
  {
    return this.httpClient.post<TrackDataGrid[]>(this.url + "/TrackStatusFile",trackSearch);
  }
  mtReprocess(reprocessSearch : ReprocessSearch) : Observable<MtReprocessDataGrid[]>
  {
    return this.httpClient.post<MtReprocessDataGrid[]>(this.url + "/MTReprocess",reprocessSearch);
  }

}
