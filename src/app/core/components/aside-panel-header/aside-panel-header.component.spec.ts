import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsidePanelHeaderComponent } from './aside-panel-header.component';

describe('AsidePanelHeaderComponent', () => {
  let component: AsidePanelHeaderComponent;
  let fixture: ComponentFixture<AsidePanelHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsidePanelHeaderComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AsidePanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
