import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { ModeService } from 'src/app/services/mode.service';

export interface SchemesData {
  N_ID: number;
  V_CUT_OFF_DATE: string;
  V_SCHEME_NAME: string;
  V_DIVISION: string;
  V_TYPE_NAME: string;
  V_ASSET_CATEGORY: string;
  V_ASSET_SUB_CATEGORY: string;
  V_ASSET_TYPE: string;
  ACTION: any;
  MASTER_DATA: any;
}

@Component({
  selector: 'app-view-schemes',
  templateUrl: './view-schemes.component.html',
  styleUrls: ['./view-schemes.component.css']
})
export class ViewSchemesComponent implements OnInit {
  allSchemesDataSource: any;
  schemesData!: SchemesData[];
  schemesTableColumns: string[] = ["N_ID", "V_CUT_OFF_DATE", "V_SCHEME_NAME", "V_DIVISION", "V_TYPE_NAME", "V_ASSET_CATEGORY", "V_ASSET_SUB_CATEGORY", "V_ASSET_TYPE", "ACTION", "MASTER_DATA"];

  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private httpService: HttpService, private modeService: ModeService) { }

  ngOnInit() {
    this.httpService.getAllSchemesData()
      .subscribe((schemesData: SchemesData[]) => {
        this.schemesData = schemesData;
        this.allSchemesDataSource = new MatTableDataSource(schemesData);
        this.allSchemesDataSource.sort = this.sort;
        console.log('data fetched')
      });
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

  showEditScheme() {
    this.modeService.createScheme = false;
    this.modeService.editScheme = true;
    this.modeService.viewScheme = false;
  }

  showViewScheme() {
    this.modeService.createScheme = false;
    this.modeService.editScheme = false;
    this.modeService.viewScheme = true;
  }

}
