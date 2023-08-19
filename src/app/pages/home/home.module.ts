import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ViewSchemesComponent } from 'src/app/components/view-schemes/view-schemes.component';
import { CreateSchemeComponent } from 'src/app/components/create-scheme/create-scheme.component';
import { MasterDataComponent } from 'src/app/components/master-data/master-data.component';
import { DialogMsgComponent } from 'src/app/components/dialog-msg/dialog-msg.component';
import { FinanceDetailsComponent } from 'src/app/components/finance-details/finance-details.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    text: "Loading...",
    textColor: "#470A3C",
    textPosition: "center-center",
    bgsColor: "#ffffff",
    fgsColor: "#470A3C",
    fgsType: SPINNER.squareJellyBox,
    fgsSize: 100,
};

@NgModule({
    declarations: [
        ViewSchemesComponent,
        CreateSchemeComponent,
        HomeComponent,
        MasterDataComponent,
        DialogMsgComponent,
        FinanceDetailsComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        MaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgxUiLoaderModule,
        NgxUiLoaderHttpModule.forRoot(ngxUiLoaderConfig)
    ]
})
export class HomeModule { }
