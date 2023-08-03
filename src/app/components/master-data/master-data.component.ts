import { Component } from '@angular/core';

export interface UnitData {
  N_ID: number;
  V_TYPE_NAME: string;
  V_UNIT_ID: string;
  V_UNIT_NO: string;
  V_BLOCK_NO: string;
  V_FLOOR_NO: string;
  V_PLINTH_AREA: string;
  V_UDS_AREA: string;
  V_PLOT_AREA: string;
  V_CARPET_AREA: string;
  V_ROAD_FACING: string;
  V_CORNER_PLOT_STATUS: string;
  V_GOVT_DISCRETION_QUOTA: string;
  V_UNIT_ALLOTTED_STATUS: string;
  V_ALLOTMENT_TYPE: string;
  V_CATEGORY: string;
  ACTION: any;
}

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.css']
})
export class MasterDataComponent {
  unitDataSource: any;
  unitTableColumns: string[] = [
    'N_ID',
    'V_TYPE_NAME',
    'V_UNIT_ID',
    'V_UNIT_NO',
    'V_BLOCK_NO',
    'V_FLOOR_NO',
    'V_PLINTH_AREA',
    'V_UDS_AREA',
    'V_PLOT_AREA',
    'V_CARPET_AREA',
    'V_ROAD_FACING',
    'V_CORNER_PLOT_STATUS',
    'V_GOVT_DISCRETION_QUOTA',
    'V_UNIT_ALLOTTED_STATUS',
    'V_ALLOTMENT_TYPE',
    'V_CATEGORY',
    'ACTION'
  ];

}
