import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export interface UnitData {
  n_ID: number;
  n_SCHEME_ID: number;
  v_SCHEME_TYPE: string;
  v_ASSET_SUB_CATEGORY: string;
  v_ASSET_TYPE: string;
  v_UNIT_ID: string;
  v_UNIT_NO: string;
  v_BLOCK_NO: string;
  v_FLOOR_NO: string;
  v_PLINTH_AREA: string;
  v_UDS_AREA: string;
  v_PLOT_AREA: string;
  v_CARPET_AREA: string;
  v_ROAD_FACING: string;
  v_CORNER_PLOT_STATUS: string;
  v_GOVT_DISCRETION_QUOTA: string;
  v_UNIT_ALLOTTED_STATUS: string;
  v_ALLOTMENT_TYPE: string;
  v_CATEGORY: string;
}

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.css']
})
export class MasterDataComponent implements OnInit, AfterViewInit {

  dataFetched: boolean = false;
  fetchedUnitMasterData: any[] = [];
  unitMasterDataSource: MatTableDataSource<UnitData> = new MatTableDataSource<UnitData>();
  displayedColumns: string[] = [
    'n_ID',
    'n_SCHEME_ID',
    'v_SCHEME_TYPE',
    'v_ASSET_SUB_CATEGORY',
    'v_ASSET_TYPE',
    'v_UNIT_ID',
    'v_UNIT_NO',
    'v_BLOCK_NO',
    'v_FLOOR_NO',
    'v_PLINTH_AREA',
    'v_UDS_AREA',
    'v_PLOT_AREA',
    'v_CARPET_AREA',
    'v_ROAD_FACING',
    'v_CORNER_PLOT_STATUS',
    'v_GOVT_DISCRETION_QUOTA',
    'v_UNIT_ALLOTTED_STATUS',
    'v_ALLOTMENT_TYPE',
    'v_CATEGORY'
  ];
  editedRowIndex: number | null = null;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private loader: NgxUiLoaderService,
    private dialog: MatDialog
  ) { }

  totalDevelopedUnits!: number;
  schemeId!: number;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.totalDevelopedUnits = +params.get('units')!;
      this.schemeId = +params.get('id')!;
    });

    if (!this.dataFetched) {
      this.fetchUnitMasterData();
    } else {
      this.populateInitialRows(this.schemeId);
    }
  }

  populateInitialRows(schemeId: number) {
    const initialData: UnitData[] = [];
    for (let i = 1; i <= this.totalDevelopedUnits; i++) {
      const initialRow: UnitData = {
        n_ID: i,
        n_SCHEME_ID: schemeId,
        v_SCHEME_TYPE: '',
        v_ASSET_SUB_CATEGORY: '',
        v_ASSET_TYPE: '',
        v_UNIT_ID: '',
        v_UNIT_NO: '',
        v_BLOCK_NO: '',
        v_FLOOR_NO: '',
        v_PLINTH_AREA: '',
        v_UDS_AREA: '',
        v_PLOT_AREA: '',
        v_CARPET_AREA: '',
        v_ROAD_FACING: '',
        v_CORNER_PLOT_STATUS: '',
        v_GOVT_DISCRETION_QUOTA: '',
        v_UNIT_ALLOTTED_STATUS: '',
        v_ALLOTMENT_TYPE: '',
        v_CATEGORY: ''
      };
      initialData.push(initialRow);
    }

    this.unitMasterDataSource = new MatTableDataSource(initialData);
    this.initPaginator();
  }

  pageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
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
        return { ...row, n_SCHEME_ID: constantN_ID };
      });

      this.unitMasterDataSource = new MatTableDataSource(modifiedData);
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
    const updatedData = [...this.unitMasterDataSource.data]; // Create a copy of the data array
    updatedData[index] = { ...row }; // Update the specific row in the copy
    this.unitMasterDataSource.data = updatedData; // Update the data property with the modified data
    this.editedRowIndex = null;
  }

  onCreateUnitMasterData() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to create this unit data?',
        confirmBackgroundColor: 'green',
        cancelBackgroundColor: 'red',
        confirmTextColor: 'white',
        cancelTextColor: 'white',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loader.start();

        const unitData = this.unitMasterDataSource.data.map((element: UnitData) => {
          const mappedData: any = {
            n_SCHEME_ID: this.schemeId
          };

          this.displayedColumns.forEach((column: string) => {
            mappedData[column] = element[column as keyof UnitData];
          });

          return mappedData;
        });

        this.http.createUnitMasterData(unitData).subscribe(
          response => {
            if (response.result === true) {
              console.log('Success:', response.message);
              this.unitMasterDataSource.data = []; // Clear the data in the MatTableDataSource
              this.fileUploaded = false; // Reset the fileUploaded flag
            } else {
              console.error('API returned false result:', response.message);
            }
            this.loader.stop();
          },
          error => {
            console.error('Error:', error);
            this.loader.stop();
          }
        );
      }
    });
  }

  fetchUnitMasterData() {
    this.http.getUnitMasterData(this.schemeId).subscribe(
      (response: any) => {
        if (response) {
          const data = response.data;
          if (data.length === 0) {
            this.populateInitialRows(this.schemeId);
          } else {
            this.fetchedUnitMasterData = data.map((row: UnitData) => ({
              n_ID: row.n_ID,
              n_SCHEME_ID: row.n_SCHEME_ID,
              v_SCHEME_TYPE: row.v_SCHEME_TYPE,
              v_UNIT_ID: row.v_UNIT_ID,
              v_UNIT_NO: row.v_UNIT_NO,
              v_BLOCK_NO: row.v_BLOCK_NO,
              v_FLOOR_NO: row.v_FLOOR_NO,
              v_PLINTH_AREA: row.v_PLINTH_AREA,
              v_UDS_AREA: row.v_UDS_AREA,
              v_PLOT_AREA: row.v_PLOT_AREA,
              v_CARPET_AREA: row.v_CARPET_AREA,
              v_ROAD_FACING: row.v_ROAD_FACING,
              v_CORNER_PLOT_STATUS: row.v_CORNER_PLOT_STATUS,
              v_GOVT_DISCRETION_QUOTA: row.v_GOVT_DISCRETION_QUOTA,
              v_UNIT_ALLOTTED_STATUS: row.v_UNIT_ALLOTTED_STATUS,
              v_ALLOTMENT_TYPE: row.v_ALLOTMENT_TYPE,
              v_CATEGORY: row.v_CATEGORY
            }));
            this.dataFetched = true;
            this.unitMasterDataSource = new MatTableDataSource<UnitData>(data);
            this.initPaginator();
          }
        } else {
          console.error('API returned false result:', response.message);
        }
      },
      error => {
        console.error('Error fetching unit data:', error);
      }
    );

  }

  initPaginator() {
    // Initialize paginator here after data is fetched and assigned
    this.unitMasterDataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.unitMasterDataSource.paginator = this.paginator;
  }

  onUpdateUnitData() {
    const unitData = this.unitMasterDataSource.data.map((element: UnitData) => {
      const mappedData: any = {
        n_SCHEME_ID: this.schemeId
      };

      this.displayedColumns.forEach((column: string) => {
        mappedData[column] = element[column as keyof UnitData];
      });

      return mappedData;
    });

    console.log(unitData);

    this.http.updateUnitMasterData(unitData).subscribe(
      response => {
        if (response.result === true) {
          console.log('Success:', response.message);
          this.unitMasterDataSource.data = [];
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}


