import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSpotyComponent } from './login-spoty.component';

describe('LoginSpotyComponent', () => {
  let component: LoginSpotyComponent;
  let fixture: ComponentFixture<LoginSpotyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginSpotyComponent]
    });
    fixture = TestBed.createComponent(LoginSpotyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
