import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsFormUser } from './tags-form-user';

describe('TagsFormUser', () => {
  let component: TagsFormUser;
  let fixture: ComponentFixture<TagsFormUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsFormUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsFormUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
