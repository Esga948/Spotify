import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAppComponent } from './login-app.component';

describe('LoginAppComponent', () => {
  let component: LoginAppComponent;
  let fixture: ComponentFixture<LoginAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginAppComponent]
    });
    fixture = TestBed.createComponent(LoginAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
