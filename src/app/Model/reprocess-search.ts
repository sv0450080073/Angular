import { TrackDataGrid } from "../shared/track-data-grid";
import { ReprocessSeaarchcondition } from "./reprocess-seaarchcondition";


export class ReprocessSearch {
 public SearchCondition :ReprocessSeaarchcondition;
 public TrackDataGrid: TrackDataGrid [];
  constructor (obj: any)
  {
    this.SearchCondition = obj.SearchCondition  as ReprocessSeaarchcondition;


  }


}


