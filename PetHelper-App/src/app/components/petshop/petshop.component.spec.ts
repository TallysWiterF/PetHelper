/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PetshopComponent } from './petshop.component';

describe('PetshopComponent', () => {
  let component: PetshopComponent;
  let fixture: ComponentFixture<PetshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
