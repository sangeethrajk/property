import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import * as XLSX from 'xlsx';

interface UnitData {
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
export class MasterDataComponent implements OnInit {
  // unitMasterDataSource: any;
  // unitTableColumns: string[] = [
  //   'N_ID',
  //   'V_TYPE_NAME',
  //   'V_UNIT_ID',
  //   'V_UNIT_NO',
  //   'V_BLOCK_NO',
  //   'V_FLOOR_NO',
  //   'V_PLINTH_AREA',
  //   'V_UDS_AREA',
  //   'V_PLOT_AREA',
  //   'V_CARPET_AREA',
  //   'V_ROAD_FACING',
  //   'V_CORNER_PLOT_STATUS',
  //   'V_GOVT_DISCRETION_QUOTA',
  //   'V_UNIT_ALLOTTED_STATUS',
  //   'V_ALLOTMENT_TYPE',
  //   'V_CATEGORY',
  //   'ACTION'
  // ];

  unitMasterDataSource: any[] = [];
  displayedColumns: string[] = [
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
  editedRowIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
  ) { }

  totalDevelopedUnits!: number;
  schemeId!: number;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.totalDevelopedUnits = +params.get('units')!;
      this.schemeId = +params.get('id')!;
    });
  }

  fileUploaded: boolean = false;
  onFileChange(event: any): void {
    const maxUnits = this.totalDevelopedUnits;
    const constantN_ID = this.schemeId;

    if (this.fileUploaded) {
      alert("Only once XLSX file upload is allowed.");
      return;
    }

    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(worksheet, { raw: true }) as UnitData[];

      if (parsedData.length !== maxUnits) {
        alert(`The uploaded file must contain exactly ${maxUnits} rows.`);
        return;
      }

      const modifiedData = parsedData.map(row => {
        return { ...row, N_ID: constantN_ID };
      });

      this.unitMasterDataSource = modifiedData;
      this.displayedColumns = Object.keys(modifiedData[0]);
      this.fileUploaded = true;
      console.log("Data:", modifiedData);
    };

    reader.readAsBinaryString(file);
  }

  startEdit(row: any, index: number): void {
    this.editedRowIndex = index;
  }

  cancelEdit(): void {
    this.editedRowIndex = null;
  }

  saveEdit(row: any, index: number): void {
    this.unitMasterDataSource[index] = { ...row };
    this.editedRowIndex = null;
  }

  onCreateUnitMasterData() {
    const unitData = this.unitMasterDataSource.map(element => {
      const mappedData: any = {
        n_SCHEME_ID: this.schemeId
      };

      this.displayedColumns.forEach(column => {
        mappedData[column] = element[column];
      });

      return mappedData;
    });

    console.log('unitData:', unitData);
    this.saveUnitDataArray(unitData);
  }


  saveUnitDataArray(unitData: any[]) {
    this.http.createUnitMasterData(unitData).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

}
