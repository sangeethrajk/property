import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ViewSchemesComponent } from 'src/app/components/view-schemes/view-schemes.component';
import { CreateSchemeComponent } from 'src/app/components/create-scheme/create-scheme.component';
import { MasterDataComponent } from 'src/app/components/master-data/master-data.component';
import { DialogMsgComponent } from 'src/app/components/dialog-msg/dialog-msg.component';

@NgModule({
    declarations: [ViewSchemesComponent, CreateSchemeComponent, HomeComponent, MasterDataComponent, DialogMsgComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        MaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class HomeModule { }
