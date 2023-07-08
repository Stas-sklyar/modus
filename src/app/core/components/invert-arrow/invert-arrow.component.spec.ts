import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvertArrowComponent } from './invert-arrow.component';

describe('InvertArrowComponent', () => {
  let component: InvertArrowComponent;
  let fixture: ComponentFixture<InvertArrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvertArrowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvertArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
