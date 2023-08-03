import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMsgComponent } from '../dialog-msg/dialog-msg.component';
import { ModeService } from 'src/app/services/mode.service';

@Component({
  selector: 'app-create-scheme',
  templateUrl: './create-scheme.component.html',
  styleUrls: ['./create-scheme.component.css']
})
export class CreateSchemeComponent {

  isLinear = false;
  schemeFormGroup!: FormGroup;
  unitFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpService, private dialog: MatDialog, public modeService: ModeService) { }

  ngOnInit() {
    this.schemeFormGroup = this.formBuilder.group({
      v_SCHEME_CODE: ['', Validators.required],
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
  }

  onSubmit() {
    if (this.schemeFormGroup.valid && this.unitFormGroup.valid) {
      const schemeData = {
        ...this.schemeFormGroup.value,
        ...this.unitFormGroup.value,
      };

      // console.log(schemeData);

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

}
