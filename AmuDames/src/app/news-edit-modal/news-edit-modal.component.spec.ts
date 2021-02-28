import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsEditModalComponent } from './news-edit-modal.component';

describe('NewsEditModalComponent', () => {
  let component: NewsEditModalComponent;
  let fixture: ComponentFixture<NewsEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
