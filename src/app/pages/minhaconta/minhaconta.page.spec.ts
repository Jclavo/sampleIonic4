import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhacontaPage } from './Minhaconta.page';

describe('MinhacontaPage', () => {
  let component: MinhacontaPage;
  let fixture: ComponentFixture<MinhacontaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinhacontaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhacontaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
