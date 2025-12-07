import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsUser } from './tags-user';

describe('TagsUser', () => {
  let component: TagsUser;
  let fixture: ComponentFixture<TagsUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
