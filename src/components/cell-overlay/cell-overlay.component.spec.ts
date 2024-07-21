import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellOverlayComponent } from './cell-overlay.component';

describe('CellOverlayComponent', () => {
  let component: CellOverlayComponent;
  let fixture: ComponentFixture<CellOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
