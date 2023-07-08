import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcBtnComponent } from './ic-btn.component';

describe('IcBtnComponent', () => {
  let component: IcBtnComponent;
  let fixture: ComponentFixture<IcBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
