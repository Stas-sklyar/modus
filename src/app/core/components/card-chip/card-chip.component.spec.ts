import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardChipComponent } from './card-chip.component';

describe('CardChipComponent', () => {
  let component: CardChipComponent;
  let fixture: ComponentFixture<CardChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardChipComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
