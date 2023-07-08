import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableRowComponent } from './expandable-row.component';

describe('ExpandableRowComponent', () => {
  let component: ExpandableRowComponent;
  let fixture: ComponentFixture<ExpandableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ExpandableRowComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExpandableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
