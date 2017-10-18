import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGainsComponent } from './new-gains.component';

describe('NewGainsComponent', () => {
  let component: NewGainsComponent;
  let fixture: ComponentFixture<NewGainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
