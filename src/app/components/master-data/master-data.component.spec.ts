import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataComponent } from './master-data.component';

describe('MasterDataComponent', () => {
  let component: MasterDataComponent;
  let fixture: ComponentFixture<MasterDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterDataComponent]
    });
    fixture = TestBed.createComponent(MasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
