import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSchemeComponent } from 'src/app/components/create-scheme/create-scheme.component';
import { HomeComponent } from './home.component';
import { ViewSchemesComponent } from 'src/app/components/view-schemes/view-schemes.component';
import { MasterDataComponent } from 'src/app/components/master-data/master-data.component';

const routes: Routes = [
    {
        path: 'home', component: HomeComponent,
        children: [
            { path: '', redirectTo: 'view-scheme', pathMatch: 'full' },
            { path: 'view-scheme', component: ViewSchemesComponent },
            { path: 'create-scheme', component: CreateSchemeComponent },
            { path: 'master-data/:units/:id', component: MasterDataComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
