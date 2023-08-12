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
import { DialogMsgComponent } from '../dialog-msg/dialog-msg.component';

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

export interface AllotteeData {
  n_SCHEME_ID: number;
  n_UNIT_ID: number;
  v_ALLOTTEE_NO: string;
  v_ALLOTTEE_DATE: string;
  v_ALLOTTEE_NAME: string;
  v_FATHER_SPOUSE_NAME: string;
  v_PHONE_NO: string;
  v_MAIL_ID: string;
  v_AADHAAR_NO: string;
  v_AADHAAR_DOC_PDF: string;
  v_OTHER_DOC_NAME: string;
  v_OTHER_DOC_NO: string;
  v_OTHER_DOC_PDF: string;
  v_ALLOTTEE_PHOTO: string;
}

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.css']
})
export class MasterDataComponent implements OnInit, AfterViewInit {

  dataFetched: boolean = false;
  showCreateButton!: boolean;
  fetchedUnitMasterData: any[] = [];
  unitMasterDataSource: MatTableDataSource<UnitData> = new MatTableDataSource<UnitData>();
  allotteeDataSource: MatTableDataSource<AllotteeData> = new MatTableDataSource<AllotteeData>()
  unitMasterTableColumns: any[] = [
    { prop: 'n_ID', display: 'S.No.' },
    { prop: 'n_SCHEME_ID', display: 'Scheme ID' },
    { prop: 'v_SCHEME_TYPE', display: 'Scheme Type' },
    { prop: 'v_ASSET_SUB_CATEGORY', display: 'Asset Sub-Category' },
    { prop: 'v_ASSET_TYPE', display: 'Asset Type' },
    { prop: 'v_UNIT_ID', display: 'Unit ID' },
    { prop: 'v_UNIT_NO', display: 'Unit No.' },
    { prop: 'v_BLOCK_NO', display: 'Block No.' },
    { prop: 'v_FLOOR_NO', display: 'Floor No.' },
    { prop: 'v_PLINTH_AREA', display: 'Plinth Area' },
    { prop: 'v_UDS_AREA', display: 'UDS Area' },
    { prop: 'v_PLOT_AREA', display: 'Plot Area' },
    { prop: 'v_CARPET_AREA', display: 'Carpet Area' },
    { prop: 'v_ROAD_FACING', display: 'Road Facing' },
    { prop: 'v_CORNER_PLOT_STATUS', display: 'Corner Plot Status' },
    { prop: 'v_GOVT_DISCRETION_QUOTA', display: 'Govt. Discretion Quota' },
    { prop: 'v_UNIT_ALLOTTED_STATUS', display: 'Unit Allotted Status' },
    { prop: 'v_ALLOTMENT_TYPE', display: 'Allotment Type' },
    { prop: 'v_CATEGORY', display: 'Category' }
  ];
  unitMasterDataColumns: any[] = this.unitMasterTableColumns.map(column => column.prop)

  allotteeTableColumns = [
    { property: 'v_ALLOTTEE_NO', display: 'Allotte No.' },
    { property: 'v_ALLOTTEE_DATE', display: 'Allotted Date' },
    { property: 'v_ALLOTTEE_NAME', display: 'Allotte Name' },
    { property: 'v_FATHER_SPOUSE_NAME', display: 'Father/Spouse Name' },
    { property: 'v_PHONE_NO', display: 'Phone No.' },
    { property: 'v_MAIL_ID', display: 'Mail ID' },
    { property: 'v_AADHAAR_NO', display: 'Aadhaar No.' },
    { property: 'v_AADHAAR_DOC_PDF', display: 'Aadhaar PDF' },
    { property: 'v_OTHER_DOC_NAME', display: 'Other Document Name' },
    { property: 'v_OTHER_DOC_NO', display: 'Other Document No' },
    { property: 'v_OTHER_DOC_PDF', display: 'Other Document PDF' },
    { property: 'v_ALLOTTEE_PHOTO', display: 'Allotte Photo' }
  ];

  get allotteeColumns(): string[] {
    return this.allotteeTableColumns.map(column => column.property);
  }

  editableRowIndex: number | null = null;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private loader: NgxUiLoaderService,
    private dialog: MatDialog,
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

    this.getAllAllotteeData(this.allotteeNId);

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
    const schemeId = this.schemeId;

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
        return { ...row, n_SCHEME_ID: schemeId };
      });

      this.unitMasterDataSource = new MatTableDataSource(modifiedData);
      this.unitMasterTableColumns = Object.keys(modifiedData[0]).map(prop => ({ prop, display: prop }));
      this.fileUploaded = true;
    };

    reader.readAsBinaryString(file);
  }

  startEdit(row: any, index: number): void {
    this.editableRowIndex = index;
  }

  cancelEdit(): void {
    this.editableRowIndex = null;
  }

  saveEdit(element: any, rowIndex: number): void {
    const updatedData = [...this.unitMasterDataSource.data];
    updatedData[rowIndex] = { ...element };
    this.unitMasterDataSource.data = updatedData;
    this.editableRowIndex = null;
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

          this.unitMasterTableColumns.forEach(column => {
            mappedData[column.prop] = element[column.prop as keyof UnitData];
          });

          return mappedData;
        });

        this.http.createUnitMasterData(unitData).subscribe(
          response => {
            if (response) {
              console.log('Success:', response.message);
              this.unitMasterDataSource.data = [];
              this.fileUploaded = false;
              this.dialog.open(DialogMsgComponent, {
                data: {
                  isSuccess: true,
                  message: 'Unit data created successfully',
                }
              }).afterClosed().subscribe(() => {
                window.location.reload();
              });
            }
            this.loader.stop();
          },
          error => {
            console.error('Error:', error);
            this.loader.stop();
            this.dialog.open(DialogMsgComponent, {
              data: {
                isSuccess: false,
                message: 'Failed to create unit data',
              }
            }).afterClosed().subscribe(() => {
              window.location.reload();
            });
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

      this.unitMasterTableColumns.forEach(column => {
        mappedData[column.prop] = element[column.prop as keyof UnitData];
      });

      return mappedData;
    });

    // console.log(unitData);

    this.http.updateUnitMasterData(unitData).subscribe(
      response => {
        if (response) {
          this.loader.start();
          console.log('Success:', response.message);
          this.unitMasterDataSource.data = [];
          this.dialog.open(DialogMsgComponent, {
            data: {
              isSuccess: true,
              message: 'Unit data updated successfully',
            }
          }).afterClosed().subscribe(() => {
            window.location.reload();
          });
        }
        this.loader.stop();
      },
      error => {
        this.loader.stop();
        console.error('Error:', error);
        this.dialog.open(DialogMsgComponent, {
          data: {
            isSuccess: false,
            message: 'Failed to update unit data',
          }
        }).afterClosed().subscribe(() => {
          window.location.reload();
        });
      }
    );
  }

  //Allottee Tab
  handleInitialAllotteeData() {
    this.unitMasterDataSource.data.forEach(item => {
      if (item.v_UNIT_ALLOTTED_STATUS === 'yes') {
        this.handleYes(item.n_ID, item.n_SCHEME_ID);
      }
    });
  }

  handleYes(n_ID: number, n_SCHEME_ID: number) {
    const selectedItem = this.unitMasterDataSource.data.find(item => item.n_ID === n_ID && item.n_SCHEME_ID === n_SCHEME_ID);

    if (selectedItem && selectedItem.v_UNIT_ALLOTTED_STATUS === 'yes') {
      const newDataForTable2: AllotteeData = {
        n_SCHEME_ID: selectedItem.n_SCHEME_ID,
        n_UNIT_ID: selectedItem.n_ID,
        v_ALLOTTEE_NO: '',
        v_ALLOTTEE_DATE: '',
        v_ALLOTTEE_NAME: '',
        v_FATHER_SPOUSE_NAME: '',
        v_PHONE_NO: '',
        v_MAIL_ID: '',
        v_AADHAAR_NO: '',
        v_AADHAAR_DOC_PDF: '',
        v_OTHER_DOC_NAME: '',
        v_OTHER_DOC_NO: '',
        v_OTHER_DOC_PDF: '',
        v_ALLOTTEE_PHOTO: ''
      };

      this.allotteeDataSource.data.push(newDataForTable2);
      this.allotteeDataSource.data = [...this.allotteeDataSource.data];
    }
  }

  selectedAadhaarFile!: File;
  selectedOtherFile!: File;
  selectedAllotteePhoto!: File;
  onAadhaarSelected(event: any) {
    this.selectedAadhaarFile = event.target.files[0];
  }
  onOtherSelected(event: any) {
    this.selectedOtherFile = event.target.files[0];
  }
  onAllotteePhotoSelected(event: any) {
    this.selectedAllotteePhoto = event.target.files[0];
  }

  async sendAllotteeData() {
    if (!this.selectedAadhaarFile || !this.selectedOtherFile || !this.selectedAllotteePhoto) {
      console.log('One or more files are not selected.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to send the allottee data?',
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
        this.processAllotteeData(); // If user confirms, proceed with data processing
      }
    });
  }

  async processAllotteeData() {
    try {
      this.loader.start();
      const base64Aadhaar = await this.readFileAsBase64(this.selectedAadhaarFile);
      const base64Other = await this.readFileAsBase64(this.selectedOtherFile);
      const base64AllotteePhoto = await this.readFileAsBase64(this.selectedAllotteePhoto);

      const newAllotteeData = this.allotteeDataSource.data.map((existingItem) => ({
        ...existingItem,
        v_AADHAAR_FILE: this.removeDataPrefix(base64Aadhaar),
        v_AADHAAR_FILE_NAME: this.selectedAadhaarFile.name,
        v_OTHER_FILE: this.removeDataPrefix(base64Other),
        v_OTHER_FILE_NAME: this.selectedOtherFile.name,
        v_ALLOTTE_FILE: this.removeDataPrefix(base64AllotteePhoto),
        v_ALLOTTE_FILE_NAME: this.selectedAllotteePhoto.name,
      }));

      await this.uploadData(newAllotteeData);
      this.loader.stop();
    } catch (error) {
      this.loader.stop();
      console.error('Error processing or uploading data:', error);
    }
  }

  async readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        resolve(this.removeDataPrefix(result));
      };
      reader.onerror = (event) => {
        reject(event.target?.error);
      };
      reader.readAsDataURL(file);
    });
  }

  async uploadData(newAllotteeData: any[]) {
    console.log(newAllotteeData);
    try {
      const response = await this.http.createAllottee(newAllotteeData).toPromise();
      this.dialog.open(DialogMsgComponent, {
        data: {
          isSuccess: true,
          message: 'Allottee data uploaded successfully',
        }
      });
      console.log('Data uploaded successfully', response);
      // You can update your UI or perform other actions here
    } catch (error) {
      this.dialog.open(DialogMsgComponent, {
        data: {
          isSuccess: false,
          message: 'Failed to upload allottee data',
        }
      });
      console.error('Error uploading data', error);
      // Handle errors here
    }
  }

  removeDataPrefix(base64Data: string): string {
    const prefixes = [
      'data:application/pdf;base64,',
      'data:image/png;base64,',
      'data:image/jpeg;base64,',
      'data:image/jpg;base64,'
    ];

    for (const prefix of prefixes) {
      if (base64Data.startsWith(prefix)) {
        return base64Data.slice(prefix.length);
      }
    }
    return base64Data;
  }


  allotteeNId!: number;
  getAllAllotteeData(allotteeNId: number) {
    this.http.getAllAllottees(allotteeNId).subscribe(
      (data: AllotteeData[]) => {
        this.allotteeNId = allotteeNId;
        this.allotteeDataSource.data = data;
        console.log(this.allotteeDataSource);
      },
      error => {
        console.error('Error fetching allottee data:', error);
      }
    );
  }

}


