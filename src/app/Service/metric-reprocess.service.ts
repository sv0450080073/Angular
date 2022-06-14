import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReprocessSearch } from '../Model/reprocess-search';
import { TrackDataGrid } from '../shared/track-data-grid';
import { TrackSearch } from '../shared/track-search';

@Injectable({
  providedIn: 'root'
})
export class MetricReprocessService {
  url = 'https://localhost:44333/MetricsReprocess';
  constructor( private httpClient:HttpClient) { }

  getStatusFiles(trackSearch : TrackSearch) : Observable<TrackDataGrid[]>
  {
    return this.httpClient.post<TrackDataGrid[]>(this.url + "/TrackStatusFile",trackSearch);
  }
  mtReprocess(reprocessSearch : ReprocessSearch) : Observable<TrackDataGrid[]>
  {
    return this.httpClient.post<TrackDataGrid[]>(this.url + "/MTReprocess",reprocessSearch);
  }

}