import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAppComponent } from './register-app.component';

describe('RegisterAppComponent', () => {
  let component: RegisterAppComponent;
  let fixture: ComponentFixture<RegisterAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterAppComponent]
    });
    fixture = TestBed.createComponent(RegisterAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
