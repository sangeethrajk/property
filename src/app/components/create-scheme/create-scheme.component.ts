import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMsgComponent } from '../dialog-msg/dialog-msg.component';
import { ModeService } from 'src/app/services/mode.service';
import { ActivatedRoute } from '@angular/router';
import { IdPassService } from 'src/app/services/id-pass.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

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
    private idPassService: IdPassService,
    private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.schemeFormGroup = this.formBuilder.group({
      v_SCHEME_CODE: ['', Validators.required],
      v_DIVISION: ['', Validators.required],
      v_ASSET_CATEGORY: ['', Validators.required],
      v_ASSET_SUB_CATEGORY: ['', Validators.required],
      v_TYPE_NAME: ['', Validators.required],
      v_SCHEME_NAME: ['', Validators.required],
      v_UNIT_TYPE: ['', Validators.required],
      v_CUT_OFF_DATE: ['', Validators.required],
      d_FINAL_CUTOFF_DATE: ['', Validators.required],
      n_RATE_OF_SCHEME_INTEREST: ['', Validators.required],
      v_REPAYMENT_METHOD: ['', Validators.required],
      n_SELLING_PRICE: ['', Validators.required],
      v_SELLING_EXTENT: ['', Validators.required],
      n_TENTATIVE_LAND_COST: ['', Validators.required],
      n_FINAL_LAND_COST: ['', Validators.required],
      n_PROFIT_ON_LAND: ['', Validators.required],
      n_RATE_ADOPTED: ['', Validators.required],
    });

    this.unitFormGroup = this.formBuilder.group({
      n_TOTAL_DEVELOPED_UNITS: ['', Validators.required],
      n_TOTAL_ALLOTTED_UNITS: ['', Validators.required],
      n_TOTAL_ALLOTTED_UNITS_FOR_OUTRIGHT: ['', Validators.required],
      n_TOTAL_ALLOTTED_UNITS_FOR_HIRE_PURCHASE: ['', Validators.required],
      n_TOTAL_ARREARS_EMI: ['', Validators.required],
      n_TOTAL_BALANCE_EMI: ['', Validators.required],
      n_TOTAL_CURRENT_EMI: ['', Validators.required],
      n_TOTAL_NO_OF_SALE_DEED_ISSUED: ['', Validators.required],
      n_TOTAL_LIVE_CASES_FOR_HIRE: ['', Validators.required],
      n_TOTAL_NO_OF_PAID_CASES: ['', Validators.required],
      n_TOTAL_RIPPED_UNIT: ['', Validators.required],
      n_TOTAL_UNSOLD_UNITS: ['', Validators.required],
      v_REMARKS: ['', Validators.required],
    });

    this.id = this.idPassService.getN_ID();
    this.fetchDataById();

    this.schemeDataForm = this.formBuilder.group({
      v_SCHEME_CODE: new FormControl(),
      v_DIVISION: new FormControl(),
      v_ASSET_CATEGORY: new FormControl(),
      v_ASSET_SUB_CATEGORY: new FormControl(),
      v_TYPE_NAME: new FormControl(),
      v_SCHEME_NAME: new FormControl(),
      v_UNIT_TYPE: new FormControl(),
      v_CUT_OFF_DATE: new FormControl(),
      d_FINAL_CUTOFF_DATE: new FormControl(),
      n_RATE_OF_SCHEME_INTEREST: new FormControl(),
      v_REPAYMENT_METHOD: new FormControl(),
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

  onSubmit() {

    if (this.schemeFormGroup.valid && this.unitFormGroup.valid) {
      const schemeData = {
        ...this.schemeFormGroup.value,
        ...this.unitFormGroup.value,
      };

      this.http.createSchemeData(schemeData).subscribe(
        (response) => {
          // Handle the successful response here if needed
          console.log('Successfully created scheme data:', response);
          this.openDialog(true, 'Scheme data created successfully!');
        },
        (error) => {
          // Handle errors here if needed
          console.error('Error creating scheme data:', error);
          this.openDialog(false, 'Error creating scheme data. Please try again later.');
        }
      );
    }
  }

  openDialog(isSuccess: boolean, message: string) {
    const dialogRef = this.dialog.open(DialogMsgComponent, {
      width: '250px', // Set the desired width of the dialog
      data: { isSuccess, message } // Pass the isSuccess flag and the message to the dialog
    });

    // Optionally, you can handle dialog events
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
        const formattedCutOffDate = this.datePipe.transform(data.v_CUT_OFF_DATE, 'dd/MM/yyyy');
        const formattedFinalCutOffDate = this.datePipe.transform(data.d_FINAL_CUTOFF_DATE, 'dd/MM/yyyy');
        this.schemeDataForm.patchValue({
          v_SCHEME_CODE: data.v_SCHEME_CODE,
          v_DIVISION: data.v_DIVISION,
          v_ASSET_CATEGORY: data.v_ASSET_CATEGORY,
          v_ASSET_SUB_CATEGORY: data.v_ASSET_SUB_CATEGORY,
          v_TYPE_NAME: data.v_TYPE_NAME,
          v_SCHEME_NAME: data.v_SCHEME_NAME,
          v_UNIT_TYPE: data.v_UNIT_TYPE,
          v_CUT_OFF_DATE: formattedCutOffDate,
          d_FINAL_CUTOFF_DATE: formattedFinalCutOffDate,
          n_RATE_OF_SCHEME_INTEREST: data.n_RATE_OF_SCHEME_INTEREST,
          v_REPAYMENT_METHOD: data.v_REPAYMENT_METHOD,
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
