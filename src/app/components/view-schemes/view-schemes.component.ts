import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { ModeService } from 'src/app/services/mode.service';
import { Router } from '@angular/router';
import { IdPassService } from 'src/app/services/id-pass.service';

export interface SchemesData {
  n_ID: number;
  v_CUT_OFF_DATE: Date;
  v_SCHEME_NAME: string;
  v_DIVISION: string;
  v_TYPE_NAME: string;
  v_ASSET_CATEGORY: string;
  v_ASSET_SUB_CATEGORY: string;
  ACTION: any;
  MASTER_DATA: any;
}

@Component({
  selector: 'app-view-schemes',
  templateUrl: './view-schemes.component.html',
  styleUrls: ['./view-schemes.component.css']
})
export class ViewSchemesComponent implements OnInit {

  allSchemesDataSource = new MatTableDataSource<any>([]);
  schemesData!: SchemesData[];
  schemesTableColumns: string[] = ['n_ID', 'v_CUT_OFF_DATE', 'v_SCHEME_NAME', 'v_DIVISION', 'v_TYPE_NAME', 'v_ASSET_CATEGORY', 'v_ASSET_SUB_CATEGORY', 'ACTION', 'MASTER_DATA'];
  id: any;

  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private httpService: HttpService,
    private modeService: ModeService,
    private router: Router,
    private idPassService: IdPassService) {

  }

  ngOnInit() {
    this.getAllSchemesData(this.id);
  }

  getAllSchemesData(id: any) {

    this.httpService.getAllSchemesData(id).subscribe(
      (response) => {
        console.log('Response:', response);

        if (response && Array.isArray(response.data)) {
          this.allSchemesDataSource.data = response.data;
        } else {
          console.error('Invalid response format or missing data array.');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allSchemesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.allSchemesDataSource.paginator) {
      this.allSchemesDataSource.paginator.firstPage();
    }
  }

  showCreateScheme() {
    this.modeService.createScheme = true;
    this.modeService.editScheme = false;
    this.modeService.viewScheme = false;
  }

  showEditScheme(n_ID: number) {
    this.modeService.createScheme = false;
    this.modeService.editScheme = true;
    this.modeService.viewScheme = false;
    this.idPassService.setN_ID(n_ID);
  }

  showViewScheme(n_ID: number) {
    this.modeService.createScheme = false;
    this.modeService.editScheme = false;
    this.modeService.viewScheme = true;
    this.idPassService.setN_ID(n_ID);
  }

}