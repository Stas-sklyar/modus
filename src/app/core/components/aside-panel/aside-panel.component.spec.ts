import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsidePanelComponent } from './aside-panel.component';

describe('OffcanvasComponent', () => {
  let component: AsidePanelComponent;
  let fixture: ComponentFixture<AsidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AsidePanelComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AsidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
