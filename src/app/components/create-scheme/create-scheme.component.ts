import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMsgComponent } from '../dialog-msg/dialog-msg.component';
import { ModeService } from 'src/app/services/mode.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IdPassService } from 'src/app/services/id-pass.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-create-scheme',
  templateUrl: './create-scheme.component.html',
  styleUrls: ['./create-scheme.component.css'],
  providers: [DatePipe]
})
export class CreateSchemeComponent implements OnInit {

  isLinear = false;
  schemeFormGroup!: FormGroup;
  unitFormGroup!: FormGroup;
  schemeData: any;
  id!: number;
  schemeDataById: any;
  private subscription!: Subscription;
  schemeDataForm!: FormGroup;
  unitDataForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private dialog: MatDialog,
    public modeService: ModeService,
    private route: ActivatedRoute,
    private router: Router,
    private idPassService: IdPassService,
    private datePipe: DatePipe,
    private loader: NgxUiLoaderService,
  ) {
  }

  ngOnInit() {
    if (!this.modeService.createScheme && !this.modeService.editScheme && !this.modeService.viewScheme) {
      // Route to the desired component when all modes are false
      this.router.navigate(['/property/home/view-scheme']);
    }
    this.schemeFormGroup = this.formBuilder.group({
      v_DIVISION: ['', Validators.required],
      v_UNIT_TYPE: ['', Validators.required],
      v_SCHEME_CODE: [''],
      v_SCHEME_NAME: ['', Validators.required],
      n_NO_OF_HIG_UNITS: ['', Validators.required],
      n_NO_OF_MIG_UNITS: ['', Validators.required],
      n_NO_OF_LIG_UNITS: ['', Validators.required],
      n_NO_OF_EWS_UNITS: ['', Validators.required],
      n_TOTAL_NO_OF_RESIDENTIAL_UNITS: ['', Validators.required],
      n_TOTAL_NO_OF_COMMERCIAL_UNITS: ['', Validators.required],
      n_NO_OF_OUTRIGHT_UNITS: ['', Validators.required],
      n_NO_OF_HIREPURCHASE_UNITS: ['', Validators.required],
      n_NO_OF_SFS_UNITS: ['', Validators.required],
      v_CUT_OFF_DATE: ['', Validators.required],
      v_FINAL_CUTOFF_DATE: ['', Validators.required],
      n_RATE_OF_SCHEME_INTEREST: ['', Validators.required],
      v_REPAYMENT_PERIOD: ['', Validators.required],
      n_SELLING_PRICE: ['', Validators.required],
      v_SELLING_EXTENT: ['', Validators.required],
      n_TENTATIVE_LAND_COST: ['', Validators.required],
      n_FINAL_LAND_COST: ['', Validators.required],
      n_PROFIT_ON_LAND: ['', Validators.required],
      n_RATE_ADOPTED: ['', Validators.required],
    });

    this.unitFormGroup = this.formBuilder.group({
      n_TOTAL_DEVELOPED_UNITS: [''],
      n_TOTAL_ALLOTTED_UNITS: [''],
      n_TOTAL_ALLOTTED_UNITS_FOR_OUTRIGHT: [''],
      n_TOTAL_ALLOTTED_UNITS_FOR_HIRE_PURCHASE: [''],
      n_TOTAL_ALLOTTED_UNITS_FOR_SFS: [''],
      n_TOTAL_ALLOTTED_UNITS_FOR_RESIDENTIAL: [''],
      n_TOTAL_ALLOTTED_UNITS_FOR_COMMERCIAL: [''],
      n_TOTAL_ARREARS_EMI: [''],
      n_TOTAL_BALANCE_EMI: [''],
      n_TOTAL_CURRENT_EMI: [''],
      n_TOTAL_NO_OF_SALE_DEED_ISSUED: [''],
      n_TOTAL_LIVE_CASES_FOR_HIRE: [''],
      n_TOTAL_NO_OF_PAID_CASES: [''],
      n_TOTAL_RIPPED_UNIT: [''],
      n_TOTAL_UNSOLD_UNITS: [''],
      v_REMARKS: [''],
    });

    this.id = this.idPassService.getN_ID();
    this.fetchDataById();

    this.schemeDataForm = this.formBuilder.group({
      v_DIVISION: new FormControl(),
      v_UNIT_TYPE: new FormControl(),
      v_SCHEME_CODE: new FormControl(),
      v_SCHEME_NAME: new FormControl(),
      n_NO_OF_HIG_UNITS: new FormControl(),
      n_NO_OF_MIG_UNITS: new FormControl(),
      n_NO_OF_LIG_UNITS: new FormControl(),
      n_NO_OF_EWS_UNITS: new FormControl(),
      n_TOTAL_NO_OF_RESIDENTIAL_UNITS: new FormControl(),
      n_TOTAL_NO_OF_COMMERCIAL_UNITS: new FormControl(),
      n_NO_OF_OUTRIGHT_UNITS: new FormControl(),
      n_NO_OF_HIREPURCHASE_UNITS: new FormControl(),
      n_NO_OF_SFS_UNITS: new FormControl(),
      v_CUT_OFF_DATE: new FormControl(),
      v_FINAL_CUTOFF_DATE: new FormControl(),
      n_RATE_OF_SCHEME_INTEREST: new FormControl(),
      v_REPAYMENT_PERIOD: new FormControl(),
      n_SELLING_PRICE: new FormControl(),
      v_SELLING_EXTENT: new FormControl(),
      n_TENTATIVE_LAND_COST: new FormControl(),
      n_FINAL_LAND_COST: new FormControl(),
      n_PROFIT_ON_LAND: new FormControl(),
      n_RATE_ADOPTED: new FormControl(),
    });
    this.unitDataForm = this.formBuilder.group({
      n_TOTAL_DEVELOPED_UNITS: new FormControl(),
      n_TOTAL_ALLOTTED_UNITS: new FormControl(),
      n_TOTAL_ALLOTTED_UNITS_FOR_OUTRIGHT: new FormControl(),
      n_TOTAL_ALLOTTED_UNITS_FOR_HIRE_PURCHASE: new FormControl(),
      n_TOTAL_ALLOTTED_UNITS_FOR_SFS: new FormControl(),
      n_TOTAL_ALLOTTED_UNITS_FOR_RESIDENTIAL: new FormControl(),
      n_TOTAL_ALLOTTED_UNITS_FOR_COMMERCIAL: new FormControl(),
      n_TOTAL_ARREARS_EMI: new FormControl(),
      n_TOTAL_BALANCE_EMI: new FormControl(),
      n_TOTAL_CURRENT_EMI: new FormControl(),
      n_TOTAL_NO_OF_SALE_DEED_ISSUED: new FormControl(),
      n_TOTAL_LIVE_CASES_FOR_HIRE: new FormControl(),
      n_TOTAL_NO_OF_PAID_CASES: new FormControl(),
      n_TOTAL_RIPPED_UNIT: new FormControl(),
      n_TOTAL_UNSOLD_UNITS: new FormControl(),
      v_REMARKS: new FormControl(),
    });

  }

  validateCounts() {
    const assetSubCategory =
      this.schemeFormGroup.value.n_NO_OF_HIG_UNITS +
      this.schemeFormGroup.value.n_NO_OF_MIG_UNITS +
      this.schemeFormGroup.value.n_NO_OF_LIG_UNITS +
      this.schemeFormGroup.value.n_NO_OF_EWS_UNITS;
    const assetType =
      this.schemeFormGroup.value.n_TOTAL_NO_OF_RESIDENTIAL_UNITS +
      this.schemeFormGroup.value.n_TOTAL_NO_OF_COMMERCIAL_UNITS;

    const schemeType =
      this.schemeFormGroup.value.n_NO_OF_OUTRIGHT_UNITS +
      this.schemeFormGroup.value.n_NO_OF_HIREPURCHASE_UNITS +
      this.schemeFormGroup.value.n_NO_OF_SFS_UNITS;

    if (assetSubCategory === assetType && assetSubCategory === schemeType) {
      alert('The total count is matched');
      return true;
    } else {
      alert('The total counts do not match. Please ensure the counts are correct.');
      return false;
    }
  }

  onSubmit() {
    if (this.schemeFormGroup.valid && this.unitFormGroup && this.validateCounts()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          message: 'Are you sure you want to create this scheme?',
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
          const schemeData = {
            ...this.schemeFormGroup.value,
            ...this.unitFormGroup.value,
          };

          this.http.createSchemeData([schemeData]).subscribe(
            (response) => {
              this.loader.stop();
              console.log('Successfully created scheme data:', response);
              this.dialog.open(DialogMsgComponent, {
                data: {
                  isSuccess: true,
                  message: 'Scheme data created successfully!',
                  routerLink: '/property/home/view-scheme'
                }
              });
            },
            (error) => {
              this.loader.stop();
              console.error('Error creating scheme data:', error);
              this.openDialog(false, 'Error creating scheme data. Please try again later.');
            }
          );
        }
      });
    }
  }

  onUpdate(id: number) {
    const schemeData = {
      n_ID: id,
      ...this.schemeDataForm.value,
      ...this.unitDataForm.value,
    };

    // console.log(schemeData);

    this.http.createSchemeData([schemeData]).subscribe(
      (response) => {
        // Handle the successful response here if needed
        console.log('Successfully updated scheme data:', response);
        this.openDialog(true, 'Scheme data updated successfully!');
      },
      (error) => {
        // Handle errors here if needed
        console.error('Error in updating scheme data:', error);
        this.openDialog(false, 'Error in updating scheme data. Please try again later.');
      }
    );
  }

  onDelete(id: number) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to delete this scheme data?',
        confirmBackgroundColor: 'red',
        cancelBackgroundColor: 'white',
        confirmTextColor: 'white',
        cancelTextColor: 'black',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loader.start();
        this.deleteScheme(id);
      }
    });
  }

  deleteScheme(id: number) {
    this.http.deleteSchemeDataById(id).subscribe(
      (response) => {
        this.loader.stop();
        this.openDialog(true, 'Scheme data deleted successfully!');
      },
      (error) => {
        this.loader.stop();
        this.openDialog(false, 'Error in deleting scheme data. Please try again later.');
      }
    );
  }

  openDialog(isSuccess: boolean, message: string) {
    const dialogRef = this.dialog.open(DialogMsgComponent, {
      width: '400px', // Set the desired width of the dialog
      data: { isSuccess, message } // Pass the isSuccess flag and the message to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Do something when the dialog is closed (optional)
    });
  }

  getSchemeData(id: any) {
    this.http.getSchemeDataById(id).subscribe(
      (response) => {
        this.schemeData = response.data;
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  fetchDataById() {
    this.subscription = this.http.getSchemeDataById(this.id)
      .subscribe((response) => {
        const data = response.data;
        const formattedCutOffDate = new Date(data.v_CUT_OFF_DATE).toLocaleDateString();
        const formattedFinalCutOffDate = new Date(data.v_FINAL_CUTOFF_DATE).toLocaleDateString();
        console.log(formattedCutOffDate);
        console.log(formattedFinalCutOffDate);
        this.schemeDataForm.patchValue({
          v_DIVISION: data.v_DIVISION,
          v_UNIT_TYPE: data.v_UNIT_TYPE,
          v_SCHEME_CODE: data.v_SCHEME_CODE,
          v_SCHEME_NAME: data.v_SCHEME_NAME,
          n_NO_OF_HIG_UNITS: data.n_NO_OF_HIG_UNITS,
          n_NO_OF_MIG_UNITS: data.n_NO_OF_MIG_UNITS,
          n_NO_OF_LIG_UNITS: data.n_NO_OF_LIG_UNITS,
          n_NO_OF_EWS_UNITS: data.n_NO_OF_EWS_UNITS,
          n_TOTAL_NO_OF_RESIDENTIAL_UNITS: data.n_TOTAL_NO_OF_RESIDENTIAL_UNITS,
          n_TOTAL_NO_OF_COMMERCIAL_UNITS: data.n_TOTAL_NO_OF_COMMERCIAL_UNITS,
          n_NO_OF_OUTRIGHT_UNITS: data.n_NO_OF_OUTRIGHT_UNITS,
          n_NO_OF_HIREPURCHASE_UNITS: data.n_NO_OF_HIREPURCHASE_UNITS,
          n_NO_OF_SFS_UNITS: data.n_NO_OF_SFS_UNITS,
          v_SCHEME_TYPE: data.v_SCHEME_TYPE,
          v_CUT_OFF_DATE: formattedCutOffDate,
          v_FINAL_CUTOFF_DATE: formattedFinalCutOffDate,
          n_RATE_OF_SCHEME_INTEREST: data.n_RATE_OF_SCHEME_INTEREST,
          v_REPAYMENT_PERIOD: data.v_REPAYMENT_PERIOD,
          n_SELLING_PRICE: data.n_SELLING_PRICE,
          v_SELLING_EXTENT: data.v_SELLING_EXTENT,
          n_TENTATIVE_LAND_COST: data.n_TENTATIVE_LAND_COST,
          n_FINAL_LAND_COST: data.n_FINAL_LAND_COST,
          n_PROFIT_ON_LAND: data.n_PROFIT_ON_LAND,
          n_RATE_ADOPTED: data.n_RATE_ADOPTED,

        });
        this.unitDataForm.patchValue({
          n_TOTAL_DEVELOPED_UNITS: data.n_TOTAL_DEVELOPED_UNITS,
          n_TOTAL_ALLOTTED_UNITS: data.n_TOTAL_ALLOTTED_UNITS,
          n_TOTAL_ALLOTTED_UNITS_FOR_OUTRIGHT: data.n_TOTAL_ALLOTTED_UNITS_FOR_OUTRIGHT,
          n_TOTAL_ALLOTTED_UNITS_FOR_HIRE_PURCHASE: data.n_TOTAL_ALLOTTED_UNITS_FOR_HIRE_PURCHASE,
          n_TOTAL_ALLOTTED_UNITS_FOR_SFS: data.n_TOTAL_ALLOTTED_UNITS_FOR_SFS,
          n_TOTAL_ALLOTTED_UNITS_FOR_RESIDENTIAL: data.n_TOTAL_ALLOTTED_UNITS_FOR_RESIDENTIAL,
          n_TOTAL_ALLOTTED_UNITS_FOR_COMMERCIAL: data.n_TOTAL_ALLOTTED_UNITS_FOR_COMMERCIAL,
          n_TOTAL_ARREARS_EMI: data.n_TOTAL_ARREARS_EMI,
          n_TOTAL_BALANCE_EMI: data.n_TOTAL_BALANCE_EMI,
          n_TOTAL_CURRENT_EMI: data.n_TOTAL_CURRENT_EMI,
          n_TOTAL_NO_OF_SALE_DEED_ISSUED: data.n_TOTAL_NO_OF_SALE_DEED_ISSUED,
          n_TOTAL_LIVE_CASES_FOR_HIRE: data.n_TOTAL_LIVE_CASES_FOR_HIRE,
          n_TOTAL_NO_OF_PAID_CASES: data.n_TOTAL_NO_OF_PAID_CASES,
          n_TOTAL_RIPPED_UNIT: data.n_TOTAL_RIPPED_UNIT,
          n_TOTAL_UNSOLD_UNITS: data.n_TOTAL_UNSOLD_UNITS,
          v_REMARKS: data.v_REMARKS,
        });
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the subscription to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}