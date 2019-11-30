import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuoptionsPage } from './menuoptions.page';

describe('MenuoptionsPage', () => {
  let component: MenuoptionsPage;
  let fixture: ComponentFixture<MenuoptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuoptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuoptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
