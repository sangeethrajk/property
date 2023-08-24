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
import { FormBuilder, FormControl, Validators } from '@angular/forms';

export interface UnitData {
  sno: number;
  n_SCHEME_ID: number;
  n_ID: number;
  v_TYPE_NAME: string;
  vassetSubCategory: string;
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
  nid: number | null;
  nschemeId: number;
  nunitId: number;
  v_ALLOTTEE_NO: string;
  d_ALLOTTEE_DATE: string;
  v_ALLOTTEE_NAME: string;
  v_FATHER_SPOUSE_NAME: string;
  n_PHONE_NUMBER: string;
  emailid: string;
  n_AADHAAR_NO: string;
  v_AADHAAR_DOC_PDF: string;
  v_OTHER_DOC_NAME: string;
  v_OTHER_DOC_NUMBER: string;
  v_OTHER_DOC_PDF: string;
  v_ALLOTTEE_PHOTO: string;
  v_AADHAAR_FILE_PATH: string;
  v_OTHER_FILE_PATH: string;
  v_ALLOTTE_FILE_PATH: string;
  v_OTHER_FILE_NAME: string;
  v_AADHAAR_FILE_NAME: string;
  v_ALLOTTE_FILE_NAME: string;
  v_AADHAAR_FILE: string;
  v_ALLOTTE_FILE: string;
  v_OTHER_FILE: string;
}

export interface SaleDeed {
  sno: number;
  nid: number;
  nschemeId: number;
  nunitId: number;
  nallotteeId: number;
  loanFilePath: string;
  lcsfilePath: string;
  lcsfileName: string;
  loanFileName: string;
  saleDeedFile: string;
  loanFile: string;
  lcsfile: string;
  fieldBookFile: string;
  allotmentOrderFile: string;
  allotmentOrderFileName: string;
  allotmentOrderFilePath: string;
  handingReportFileName: string;
  fieldBookFileName: string;
  handingReportFile: string;
  fieldBookFilePath: string;
  saleDeedFileName: string;
  handingReportFilePath: string;
  saleDeedFilePath: string;
}

export interface FinanceData {
  sno: number;
  nID: number | null;
  v_SCHEME_ID: number;
  n_UNIT_ID: number;
  emi_START_DATE: string;
  v_RATE_OF_INTEREST: number;
  v_PAYMENT_PERIOD_IN_YEARS: number;
  v_PRINCIPAL_AMOUNT: number;
  n_INITIAL_DEPOSIT: number;
  n_INITIAL_DEPOSIT_PAID: number;
  N_INITIAL_DEPOSIT_TO_BE_PAID: number;
}

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.css']
})
export class MasterDataComponent implements OnInit, AfterViewInit {

  n_NO_OF_HIG_UNITS!: number;
  nUnitId!: number;
  nAllotteeId!: number;
  dataFetched: boolean = false;
  showCreateButton!: boolean;
  fetchedUnitMasterData: any[] = [];
  unitMasterDataSource: MatTableDataSource<UnitData> = new MatTableDataSource<UnitData>();
  allotteeDataSource: MatTableDataSource<AllotteeData> = new MatTableDataSource<AllotteeData>();
  saleDeedDataSource: MatTableDataSource<SaleDeed> = new MatTableDataSource<SaleDeed>();
  financeDataSource: MatTableDataSource<FinanceData> = new MatTableDataSource<FinanceData>();
  unitMasterTableColumns: any[] = [
    { prop: 'sno', display: 'S.No.' },
    { prop: 'n_SCHEME_ID', display: 'Scheme ID' },
    { prop: 'n_ID', display: 'Unit ID' },
    { prop: 'v_TYPE_NAME', display: 'Scheme Type' },
    { prop: 'vassetSubCategory', display: 'Asset Sub-Category' },
    { prop: 'v_ASSET_TYPE', display: 'Asset Type' },
    { prop: 'v_UNIT_ID', display: 'Unit Code' },
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
    { property: 'nschemeId', display: 'Scheme ID' },
    { property: 'nunitId', display: 'Unit ID' },
    { property: 'v_ALLOTTEE_NO', display: 'Allotte No.' },
    { property: 'd_ALLOTTEE_DATE', display: 'Allotted Date' },
    { property: 'v_ALLOTTEE_NAME', display: 'Allotte Name' },
    { property: 'v_FATHER_SPOUSE_NAME', display: 'Father/Spouse Name' },
    { property: 'n_PHONE_NUMBER', display: 'Phone No.' },
    { property: 'emailid', display: 'Mail ID' },
    { property: 'n_AADHAAR_NO', display: 'Aadhaar No.' },
    { property: 'v_AADHAAR_DOC_PDF', display: 'Aadhaar PDF' },
    { property: 'v_OTHER_DOC_NAME', display: 'Other Document Name' },
    { property: 'v_OTHER_DOC_NUMBER', display: 'Other Document No' },
    { property: 'v_OTHER_DOC_PDF', display: 'Other Document PDF' },
    { property: 'v_ALLOTTEE_PHOTO', display: 'Allotte Photo' }
  ];

  get allotteeColumns(): string[] {
    return this.allotteeTableColumns.map(column => column.property);
  }

  editableRowIndex: number | null = null;

  saleDeedColumns: string[] = ['sno', 'nschemeId', 'nunitId', 'allotmentOrder', 'lcs', 'handingOverReport', 'fieldMeasurementBook', 'abLoan', 'saleDeed']

  financeTableColumns: string[] = [
    'sno',
    'v_SCHEME_ID',
    'n_UNIT_ID',
    'emi_START_DATE',
    'v_RATE_OF_INTEREST',
    'v_PAYMENT_PERIOD_IN_YEARS',
    'v_PRINCIPAL_AMOUNT',
    'n_INITIAL_DEPOSIT',
    'n_INITIAL_DEPOSIT_PAID',
    'n_INITIAL_DEPOSIT_PAID',
    'action'
  ];

  pageSize = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private loader: NgxUiLoaderService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.rateOfInterestControl = this.fb.control('', [
      Validators.pattern(/^\d+\.\d{1}$/)
    ]);
  }

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

    this.getAllAllotteeData(this.schemeId);
    this.getInitialSalesData();
    this.getSalesDeedFiles(this.schemeId);
  }

  populateInitialRows(schemeId: number) {
    this.http.getSchemeDataById(schemeId).subscribe(
      (response: any) => {
        const unitCounts = response.data;

        console.log('Fetched Unit Counts:', unitCounts);

        const initialData: UnitData[] = [];
        const unitTypes = ['HIG', 'MIG', 'LIG', 'EWS'];
        let snoCounter = 1; // Initialize the serial number counter

        for (const type of unitTypes) {
          const typeCount = unitCounts[`n_NO_OF_${type}_UNITS`];
          for (let i = 0; i < typeCount; i++) { // Change this line
            const initialRow: UnitData = {
              sno: snoCounter++, // Increment the counter and assign it to sno
              n_SCHEME_ID: schemeId,
              n_ID: 0,
              v_TYPE_NAME: '',
              vassetSubCategory: type,
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
        }

        this.unitMasterDataSource.data = initialData;
        this.initPaginator();
      },
      error => {
        console.error('Error fetching unit counts:', error);
      }
    );
  }

  pageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
  }

  fileUploaded: boolean = false;
  convertExcelToJson(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        resolve(jsonData);
      };

      reader.readAsArrayBuffer(file);
    });
  }
  async handleFileInput(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      try {
        const jsonData = await this.convertExcelToJson(file);
        if (jsonData.length !== this.totalDevelopedUnits) {
          // Show an alert message indicating that the row count is not correct
          alert(`The number of rows in the uploaded file should be equal to ${this.totalDevelopedUnits}.`);
          return;
        }
        console.log("jsonData:", jsonData);
        const mappedData = jsonData.map((item, index) => {
          const serialNumber = index + 1;
          return {
            sno: serialNumber,
            n_SCHEME_ID: this.schemeId,
            n_ID: 0,
            v_TYPE_NAME: item.v_TYPE_NAME,
            vassetSubCategory: item.vassetSubCategory,
            v_ASSET_TYPE: item.v_ASSET_TYPE,
            v_UNIT_ID: item.v_UNIT_ID,
            v_UNIT_NO: item.v_UNIT_NO,
            v_BLOCK_NO: item.v_BLOCK_NO,
            v_FLOOR_NO: item.v_FLOOR_NO,
            v_PLINTH_AREA: item.v_PLINTH_AREA,
            v_UDS_AREA: item.v_UDS_AREA,
            v_PLOT_AREA: item.v_PLOT_AREA,
            v_CARPET_AREA: item.v_CARPET_AREA,
            v_ROAD_FACING: item.v_ROAD_FACING,
            v_CORNER_PLOT_STATUS: item.v_CORNER_PLOT_STATUS,
            v_GOVT_DISCRETION_QUOTA: item.v_GOVT_DISCRETION_QUOTA,
            v_UNIT_ALLOTTED_STATUS: item.v_UNIT_ALLOTTED_STATUS,
            v_ALLOTMENT_TYPE: item.v_ALLOTMENT_TYPE,
            v_CATEGORY: item.v_CATEGORY
          };
        });
        this.unitMasterDataSource.data = mappedData;
      } catch (error) {
        console.error('Error converting Excel to JSON:', error);
      }
    }
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
          console.log(response);
          const data = response.data;
          if (data.length === 0) {
            this.populateInitialRows(this.schemeId);
          } else {
            this.fetchedUnitMasterData = data.map((row: UnitData, index: number) => ({
              sno: index + 1,
              n_ID: row.n_ID,
              n_SCHEME_ID: row.n_SCHEME_ID,
              v_TYPE_NAME: row.v_TYPE_NAME,
              vassetSubCategory: row.vassetSubCategory,
              v_ASSET_TYPE: row.v_ASSET_TYPE,
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
            this.unitMasterDataSource = new MatTableDataSource<UnitData>(this.fetchedUnitMasterData);
            this.initPaginator();
            console.log("data:", this.fetchedUnitMasterData);
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
    window.dispatchEvent(new Event('resize'));
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
  processedUnitIDs = new Set<number>();
  handleInitialAllotteeData() {
    this.unitMasterDataSource.data.forEach(({ v_UNIT_ALLOTTED_STATUS, n_ID, n_SCHEME_ID }) => {
      const isAllotted = v_UNIT_ALLOTTED_STATUS === 'yes';
      const isProcessed = this.processedUnitIDs.has(n_ID);

      if (isAllotted && !isProcessed) {
        this.checkAllotteeData(n_ID, n_SCHEME_ID);
        this.processedUnitIDs.add(n_ID);
      }
    });
  }

  checkAllotteeData(n_ID: number, n_SCHEME_ID: number) {
    let isAllotteeDataExists = false;

    for (const item of this.allotteeDataSource.data) {
      if (item.nunitId === n_ID) {
        isAllotteeDataExists = true;
        break;
      }
    }

    if (isAllotteeDataExists) {
      console.log('Allottee data already exists for unit:', n_ID);
    } else {
      console.log('Allottee data does not exist for unit:', n_ID);
      this.handleYes(n_ID, n_SCHEME_ID);
    }
  }

  handleYes(n_ID: number, n_SCHEME_ID: number) {
    const selectedItem = this.unitMasterDataSource.data.find(item => item.n_ID === n_ID && item.n_SCHEME_ID === n_SCHEME_ID);

    if (!selectedItem) {
      return; // Exit the function if selectedItem doesn't exist
    }

    const isAlreadyProcessed = this.processedUnitIDs.has(selectedItem.n_ID);
    const allotteeExists = this.allotteeDataSource.data.some(item => item.nunitId === selectedItem.n_ID);

    if (selectedItem.v_UNIT_ALLOTTED_STATUS === 'yes' && !isAlreadyProcessed && !allotteeExists) {
      const newDataForTable2: AllotteeData = {
        nid: null,
        nschemeId: selectedItem.n_SCHEME_ID,
        nunitId: selectedItem.n_ID,
        v_ALLOTTEE_NO: '',
        d_ALLOTTEE_DATE: '',
        v_ALLOTTEE_NAME: '',
        v_FATHER_SPOUSE_NAME: '',
        n_PHONE_NUMBER: '',
        emailid: '',
        n_AADHAAR_NO: '',
        v_AADHAAR_DOC_PDF: '',
        v_OTHER_DOC_NAME: '',
        v_OTHER_DOC_NUMBER: '',
        v_OTHER_DOC_PDF: '',
        v_ALLOTTEE_PHOTO: '',
        v_AADHAAR_FILE_PATH: '',
        v_OTHER_FILE_PATH: '',
        v_ALLOTTE_FILE_PATH: '',
        v_OTHER_FILE_NAME: '',
        v_AADHAAR_FILE_NAME: '',
        v_ALLOTTE_FILE_NAME: '',
        v_AADHAAR_FILE: '',
        v_ALLOTTE_FILE: '',
        v_OTHER_FILE: '',

      };

      this.allotteeDataSource.data.push(newDataForTable2);
      this.allotteeDataSource.data = [...this.allotteeDataSource.data];

      this.processedUnitIDs.add(selectedItem.n_ID);
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
    // if (!this.selectedAadhaarFile || !this.selectedOtherFile || !this.selectedAllotteePhoto) {
    //   console.log('One or more files are not selected.');
    //   return;
    // }

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
        nschemeId: this.schemeId
      }));
      console.log("newAllotteeData:", newAllotteeData);
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
    console.log("allotte:", newAllotteeData);
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

  getAllAllotteeData(schemeId: number) {
    this.http.getAllAllottees(schemeId).subscribe(
      (response: any) => {
        const data = response.data;
        this.allotteeDataSource.data = data.map((item: AllotteeData) => ({
          nid: item.nid,
          nschemeId: item.nschemeId,
          nunitId: item.nunitId,
          v_ALLOTTEE_NO: item.v_ALLOTTEE_NO,
          d_ALLOTTEE_DATE: item.d_ALLOTTEE_DATE,
          v_ALLOTTEE_NAME: item.v_ALLOTTEE_NAME,
          v_FATHER_SPOUSE_NAME: item.v_FATHER_SPOUSE_NAME,
          n_PHONE_NUMBER: item.n_PHONE_NUMBER,
          emailid: item.emailid,
          n_AADHAAR_NO: item.n_AADHAAR_NO,
          v_AADHAAR_FILE_PATH: item.v_AADHAAR_FILE_PATH,
          v_OTHER_DOC_NAME: item.v_OTHER_DOC_NAME,
          v_OTHER_DOC_NUMBER: item.v_OTHER_DOC_NUMBER,
          v_OTHER_FILE_PATH: item.v_OTHER_FILE_PATH,
          v_ALLOTTE_FILE_PATH: item.v_ALLOTTE_FILE_PATH,
          v_OTHER_FILE_NAME: item.v_OTHER_FILE_NAME,
          v_AADHAAR_FILE_NAME: item.v_AADHAAR_FILE_NAME,
          v_ALLOTTE_FILE_NAME: item.v_ALLOTTE_FILE_NAME

        }));
        this.nUnitId = data.map((item: any) => ({
          id: item.n_UNIT_ID,
        }));
        console.log("Unit ID:", this.nUnitId);
        console.log("fetched allottee:", this.allotteeDataSource.data);
        console.log(data);
      },
      error => {
        console.error('Error fetching allottee data:', error);
      }
    );
  }

  updateAllotteeData() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to update the allottee data?',
        confirmBackgroundColor: 'green',
        cancelBackgroundColor: 'red',
        confirmTextColor: 'white',
        cancelTextColor: 'white',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === true) {
        this.loader.start();
        const promises: Promise<string>[] = [];

        if (this.selectedAadhaarFile) {
          promises.push(this.readFileAsBase64(this.selectedAadhaarFile));
        }

        if (this.selectedOtherFile) {
          promises.push(this.readFileAsBase64(this.selectedOtherFile));
        }

        if (this.selectedAllotteePhoto) {
          promises.push(this.readFileAsBase64(this.selectedAllotteePhoto));
        }

        const [base64Aadhaar, base64Other, base64AllotteePhoto] = await Promise.all(promises);

        const updatedAllotteeData: AllotteeData[] = this.allotteeDataSource.data.map(item => {
          const updatedItem: AllotteeData = { ...item }; // Create a copy of the current item

          if (this.selectedAadhaarFile) {
            updatedItem.v_AADHAAR_FILE = this.removeDataPrefix(base64Aadhaar);
            updatedItem.v_AADHAAR_FILE_NAME = this.selectedAadhaarFile.name;
          }

          if (this.selectedOtherFile) {
            updatedItem.v_OTHER_FILE = this.removeDataPrefix(base64Other);
            updatedItem.v_OTHER_FILE_NAME = this.selectedOtherFile.name;
          }

          if (this.selectedAllotteePhoto) {
            updatedItem.v_ALLOTTE_FILE = this.removeDataPrefix(base64AllotteePhoto);
            updatedItem.v_ALLOTTE_FILE_NAME = this.selectedAllotteePhoto.name;
          }

          return updatedItem;
        });

        console.log("updatedAllotteeData", updatedAllotteeData);
        this.http.updateAllotteeData(updatedAllotteeData).subscribe(
          response => {
            this.loader.stop();
            this.dialog.open(DialogMsgComponent, {
              data: {
                isSuccess: true,
                message: 'Allottee Data updated successfully',
              }
            }).afterClosed().subscribe(() => {
              window.location.reload();
            });
            console.log('Update successful:', response);
          },
          error => {
            this.loader.stop();
            this.dialog.open(DialogMsgComponent, {
              data: {
                isSuccess: false,
                message: 'Error in  updating Allottee Data',
              }
            }).afterClosed().subscribe(() => {
              window.location.reload();
            });
            console.error('Update failed:', error);
          }
        );
      }
    });
  }

  // Sale Deed
  processedUnitIDsForSales = new Set<number>();
  getInitialSalesData() {
    this.unitMasterDataSource.data.forEach(({ v_UNIT_ALLOTTED_STATUS, n_ID, n_SCHEME_ID }) => {
      const isAllotted = v_UNIT_ALLOTTED_STATUS === 'yes';
      const isProcessed = this.processedUnitIDsForSales.has(n_ID);

      if (isAllotted && !isProcessed) {
        this.checkSalesData(n_ID, n_SCHEME_ID);
        this.processedUnitIDsForSales.add(n_ID);
      }
    });
  }

  checkSalesData(n_ID: number, n_SCHEME_ID: number) {
    let isSalesDataExists = false;

    for (const item of this.saleDeedDataSource.data) {
      if (item.nunitId === n_ID) {
        isSalesDataExists = true;
        break;
      }
    }

    if (isSalesDataExists) {
      console.log('Sales data already exists for unit:', n_ID);
    } else {
      console.log('Sales data does not exist for unit:', n_ID);
      this.handleYesForSales(n_ID, n_SCHEME_ID);
    }
  }

  private selectedUnitId!: number
  handleYesForSales(n_ID: number, n_SCHEME_ID: number,) {
    const selectedItem = this.unitMasterDataSource.data.find(item => item.n_ID === n_ID && item.n_SCHEME_ID === n_SCHEME_ID);

    if (!selectedItem) {
      return;
    }

    const isAlreadyProcessed = this.processedUnitIDsForSales.has(selectedItem.n_ID);
    const allotteeExists = this.saleDeedDataSource.data.some(item => item.nunitId === selectedItem.n_ID);

    if (selectedItem.v_UNIT_ALLOTTED_STATUS === 'yes' && !isAlreadyProcessed && !allotteeExists) {
      this.selectedUnitId = selectedItem.n_ID;
      const newDataForTable2: SaleDeed = {
        nid: 0,
        nschemeId: selectedItem.n_SCHEME_ID,
        nunitId: selectedItem.n_ID,
        sno: 0,
        nallotteeId: 0,
        loanFilePath: '',
        lcsfilePath: '',
        lcsfileName: '',
        loanFileName: '',
        saleDeedFile: '',
        loanFile: '',
        lcsfile: '',
        fieldBookFile: '',
        allotmentOrderFile: '',
        allotmentOrderFileName: '',
        allotmentOrderFilePath: '',
        handingReportFileName: '',
        fieldBookFileName: '',
        handingReportFile: '',
        fieldBookFilePath: '',
        saleDeedFileName: '',
        handingReportFilePath: '',
        saleDeedFilePath: ''
      };

      this.saleDeedDataSource.data.push(newDataForTable2);
      this.saleDeedDataSource.data = [...this.saleDeedDataSource.data];

      this.processedUnitIDsForSales.add(selectedItem.n_ID);
    }
  }

  selectedAllotmentFile!: File;
  selectedLCSFile!: File;
  selectedHandingOverFile!: File;
  selectedFieldFile!: File;
  selectedABFile!: File;
  selectedSaleDeedFile!: File;
  onAllotmentUpload(event: any) {
    this.selectedAllotmentFile = event.target.files[0];
  }
  onLCSUpload(event: any) {
    this.selectedLCSFile = event.target.files[0];
  }
  onHandingOverUpload(event: any) {
    this.selectedHandingOverFile = event.target.files[0];
  }
  onFieldUpload(event: any) {
    this.selectedFieldFile = event.target.files[0];
  }
  onABUpload(event: any) {
    this.selectedABFile = event.target.files[0];
  }
  onSaleDeedUpload(event: any) {
    this.selectedSaleDeedFile = event.target.files[0];
  }

  async uploadSaleDeedFiles() {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to send the sale deed files?',
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
        this.processSaleDeedFiles();
      }
    });
  }

  async processSaleDeedFiles() {
    try {
      this.loader.start();
      const base64Allotment = await this.readFileAsBase64(this.selectedAllotmentFile);
      const base64LCS = await this.readFileAsBase64(this.selectedLCSFile);
      const base64HandingOver = await this.readFileAsBase64(this.selectedHandingOverFile);
      const base64Field = await this.readFileAsBase64(this.selectedFieldFile);
      const base64AB = await this.readFileAsBase64(this.selectedABFile);
      const base64SaleDeed = await this.readFileAsBase64(this.selectedSaleDeedFile);

      const saleDeedFiles = {
        allotmentOrderFile: this.removeDataPrefix(base64Allotment),
        allotmentOrderFileName: this.selectedAllotmentFile.name,
        lcsfile: this.removeDataPrefix(base64LCS),
        lcsfileName: this.selectedLCSFile.name,
        handingReportFile: this.removeDataPrefix(base64HandingOver),
        handingReportFileName: this.selectedHandingOverFile.name,
        fieldBookFile: this.removeDataPrefix(base64Field),
        fieldBookFileName: this.selectedFieldFile.name,
        loanFile: this.removeDataPrefix(base64AB),
        loanFileName: this.selectedABFile.name,
        saleDeedFile: this.removeDataPrefix(base64SaleDeed),
        saleDeedFileName: this.selectedSaleDeedFile.name,
        nschemeId: this.schemeId,
        nunitId: this.selectedUnitId,
      };

      await this.uploadSaleDeed([saleDeedFiles]);
      this.loader.stop();
    } catch (error) {
      this.loader.stop();
      console.error('Error processing or uploading data:', error);
    }
  }

  async uploadSaleDeed(saleDeedFiles: any) {
    console.log(saleDeedFiles);
    try {
      const response = await this.http.uploadSaleDeedFiles(saleDeedFiles).toPromise();
      this.dialog.open(DialogMsgComponent, {
        data: {
          isSuccess: true,
          message: 'Sale Deed File(s) uploaded successfully',
        }
      });
      console.log('Data uploaded successfully', response);
    } catch (error) {
      this.dialog.open(DialogMsgComponent, {
        data: {
          isSuccess: false,
          message: 'Failed to upload Sale Deed File(s)',
        }
      });
      console.error('Error uploading Sale Deed File(s)', error);
    }
  }

  getSalesDeedFiles(nschemeId: number) {
    this.http.getSalesDeedFiles(nschemeId).subscribe((response: any) => {
      const data = response.data;
      this.saleDeedDataSource.data = data.map((item: SaleDeed, index: number) => ({
        sno: index + 1,
        nid: item.nid,
        nschemeId: item.nschemeId,
        nunitId: item.nunitId,
        nallotteeId: item.nallotteeId,
        allotmentOrderFilePath: item.allotmentOrderFilePath,
        lcsfilePath: item.lcsfilePath,
        handingReportFilePath: item.handingReportFilePath,
        fieldBookFilePath: item.fieldBookFilePath,
        loanFilePath: item.loanFilePath,
        saleDeedFilePath: item.saleDeedFilePath
      }));
      console.log("sale", this.saleDeedDataSource);
    });
  }

  updateSaleDeedFiles() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to update the sale files?',
        confirmBackgroundColor: 'green',
        cancelBackgroundColor: 'red',
        confirmTextColor: 'white',
        cancelTextColor: 'white',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === true) {
        this.loader.start();
        const promises: Promise<string>[] = [];

        if (this.selectedAllotmentFile) {
          promises.push(this.readFileAsBase64(this.selectedAllotmentFile));
        }

        if (this.selectedLCSFile) {
          promises.push(this.readFileAsBase64(this.selectedLCSFile));
        }

        if (this.selectedHandingOverFile) {
          promises.push(this.readFileAsBase64(this.selectedHandingOverFile));
        }

        if (this.selectedFieldFile) {
          promises.push(this.readFileAsBase64(this.selectedFieldFile));
        }

        if (this.selectedABFile) {
          promises.push(this.readFileAsBase64(this.selectedABFile));
        }

        if (this.selectedSaleDeedFile) {
          promises.push(this.readFileAsBase64(this.selectedSaleDeedFile));
        }

        const [base64Allotment, base64LCS, base64HandingOver, base64Field, base64AB, base64SaleDeed] = await Promise.all(promises);

        const updatedSalesDeedData: SaleDeed[] = this.saleDeedDataSource.data.map(item => {
          const updatedItem: SaleDeed = { ...item }; // Create a copy of the current item

          if (this.selectedAllotmentFile) {
            updatedItem.allotmentOrderFile = this.removeDataPrefix(base64Allotment);
            updatedItem.allotmentOrderFileName = this.selectedAllotmentFile.name;
          }

          if (this.selectedLCSFile) {
            updatedItem.lcsfile = this.removeDataPrefix(base64LCS);
            updatedItem.lcsfileName = this.selectedLCSFile.name;
          }

          if (this.selectedHandingOverFile) {
            updatedItem.handingReportFile = this.removeDataPrefix(base64HandingOver);
            updatedItem.handingReportFileName = this.selectedHandingOverFile.name;
          }

          if (this.selectedFieldFile) {
            updatedItem.fieldBookFile = this.removeDataPrefix(base64Field);
            updatedItem.fieldBookFileName = this.selectedFieldFile.name;
          }

          if (this.selectedABFile) {
            updatedItem.loanFile = this.removeDataPrefix(base64AB);
            updatedItem.loanFileName = this.selectedABFile.name;
          }

          if (this.selectedSaleDeedFile) {
            updatedItem.saleDeedFile = this.removeDataPrefix(base64SaleDeed);
            updatedItem.saleDeedFileName = this.selectedSaleDeedFile.name;
          }

          return updatedItem;
        });

        console.log("updatedSalesDeedData:", updatedSalesDeedData);

        this.http.updateSaleDeedFiles(updatedSalesDeedData).subscribe(
          response => {
            this.loader.stop();
            this.dialog.open(DialogMsgComponent, {
              data: {
                isSuccess: true,
                message: 'Sales files updated successfully',
              }
            }).afterClosed().subscribe(() => {
              window.location.reload();
            });
            console.log('Update successful:', response);
          },
          error => {
            this.loader.stop();
            this.dialog.open(DialogMsgComponent, {
              data: {
                isSuccess: false,
                message: 'Error in  updating Sales Files',
              }
            }).afterClosed().subscribe(() => {
              window.location.reload();
            });
            console.error('Update failed:', error);
          }
        );
      }
    });
  }

  //Finance Tab
  processedUnitIDsForFinance = new Set<number>();
  getInitialFinanceData() {
    this.unitMasterDataSource.data.forEach(({ v_UNIT_ALLOTTED_STATUS, n_ID, n_SCHEME_ID }) => {
      const isAllotted = v_UNIT_ALLOTTED_STATUS === 'yes';
      const isProcessed = this.processedUnitIDsForFinance.has(n_ID);

      if (isAllotted && !isProcessed) {
        this.checkFinanceData(n_ID, n_SCHEME_ID);
        this.processedUnitIDsForFinance.add(n_ID);
      }
    });
  }

  checkFinanceData(n_ID: number, n_SCHEME_ID: number) {
    let isFinanceDataExists = false;

    for (const item of this.financeDataSource.data) {
      if (item.n_UNIT_ID === n_ID) {
        isFinanceDataExists = true;
        break;
      }
    }

    if (isFinanceDataExists) {
      console.log('Finance data already exists for unit:', n_ID);
    } else {
      console.log('Finance data does not exist for unit:', n_ID);
      this.handleYesForFinance(n_ID, n_SCHEME_ID);
    }
  }

  handleYesForFinance(n_ID: number, n_SCHEME_ID: number) {
    const selectedItem = this.unitMasterDataSource.data.find(item => item.n_ID === n_ID && item.n_SCHEME_ID === n_SCHEME_ID);

    if (!selectedItem) {
      return;
    }

    const isAlreadyProcessed = this.processedUnitIDsForFinance.has(selectedItem.n_ID);
    const allotteeExists = this.financeDataSource.data.some(item => item.n_UNIT_ID === selectedItem.n_ID);

    if (selectedItem.v_UNIT_ALLOTTED_STATUS === 'yes' && !isAlreadyProcessed && !allotteeExists) {
      this.selectedUnitId = selectedItem.n_ID;
      const emptyRowForFinance: FinanceData = {
        sno: 0,
        nID: null,
        v_SCHEME_ID: selectedItem.n_SCHEME_ID,
        n_UNIT_ID: selectedItem.n_ID,
        emi_START_DATE: '',
        v_RATE_OF_INTEREST: 0,
        v_PAYMENT_PERIOD_IN_YEARS: 0,
        v_PRINCIPAL_AMOUNT: 0,
        n_INITIAL_DEPOSIT: 0,
        n_INITIAL_DEPOSIT_PAID: 0,
        N_INITIAL_DEPOSIT_TO_BE_PAID: 0
      };

      this.financeDataSource.data.push(emptyRowForFinance);
      this.financeDataSource.data = [...this.financeDataSource.data];
      this.processedUnitIDsForFinance.add(selectedItem.n_ID);
      console.log("financeDataSource:", this.financeDataSource);
    }
  }

  startFinanceEdit(element: any) {
    element.editing = true;
  }

  cancelFinanceEdit(element: any) {
    element.editing = false;
  }

  rateOfInterestControl: FormControl;

  updateFinanceData() {
    const updatedElements: FinanceData[] = []; // Create an array to hold the updated elements

    this.financeDataSource.data.forEach(element => {
      const N_INITIAL_DEPOSIT_TO_BE_PAID = element.n_INITIAL_DEPOSIT - element.n_INITIAL_DEPOSIT_PAID;
      element.N_INITIAL_DEPOSIT_TO_BE_PAID = N_INITIAL_DEPOSIT_TO_BE_PAID;

      // Push the updated element into the array
      updatedElements.push(element);
    });

    console.log(updatedElements);
    this.http.updateFinanceData(updatedElements).subscribe(
      (response) => {
        console.log("updateFinanceData:", response);
      },
      (error) => {
        console.error(error);
      }
    );
  }


}


