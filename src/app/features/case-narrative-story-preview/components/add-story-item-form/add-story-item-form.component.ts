import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateStoryItemForm } from '../../../../models/interfaces/create-story-item-form';
import { NarrativeStoryItemType } from '../../../../models/enums/narrative-story-item-type';
import { Subscription } from 'rxjs';
import { NewStoryItem } from '../../../../models/interfaces/new-story-item';
import { TrialCaseNarrativeStoryItem } from '../../../../models/interfaces/trial-case-narrative-story-item';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';

@Component({
  selector: 'lr-add-story-item-form',
  templateUrl: './add-story-item-form.component.html',
  styleUrls: ['./add-story-item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddStoryItemFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() addParentStoryItem!: boolean;
  @Input() order!: number;
  @Input() storyItemType!: NarrativeStoryItemType | null;
  @Input() parentStoryItems: TrialCaseNarrativeStoryItem[] = [];

  @Output() changeVisibilityFormEvent = new EventEmitter<'cancel' | 'confirm'>();
  @Output() clickAddAddStoryTypeBtnEvent = new EventEmitter<NewStoryItem>();
  form = new FormGroup<CreateStoryItemForm>({
    parentStoryItemId: new FormControl(null),
    storyItemType: new FormControl(null, Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  private _subscription = new Subscription();
  participants$ = this.trialCasePeopleService.people$;

  constructor(
    private trialCasePeopleService: TrialCasePeopleService,
    private caseNarrativeEntitiesService: CaseNarrativeEntitiesService,
  ) {
  }

  ngOnInit(): void {
    this.setStoryItemType();
    this.loadParticipants();
  }

  ngOnChanges(): void {
    this.form.get('storyItemType')?.setValue(this.storyItemType);
  }

  loadParticipants(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople().subscribe(),
    );
  }

  setStoryItemType(): void {
    if (this.storyItemType) {
      this.form.get('storyItemType')?.setValue(this.storyItemType);
    } else {
      this.form.get('storyItemType')?.setValue(null);
    }
  }

  closeForm(btnTypePressed: 'cancel' | 'confirm'): void {
    this.caseNarrativeEntitiesService.typeOfOpenAddStoryItemForm = null;
    this.changeVisibilityFormEvent.emit(btnTypePressed);
  }

  onClickAddStoryItemBtn(): void {
    let order: number = 0;
    const parentStoryItemId = this.form.get('parentStoryItemId')?.value;

    if (parentStoryItemId) {
      const parentStoryItem = this.parentStoryItems.find(storyItem => storyItem.id === parentStoryItemId);
      order = parentStoryItem?.items.length || 0;
    } else {
      order = this.order;
    }

    this.clickAddAddStoryTypeBtnEvent.emit({
      parentStoryItemId: this.form.value.parentStoryItemId,
      storyItemType: this.form.value.storyItemType || NarrativeStoryItemType.FACT,
      title: this.form.value.title,
      description: this.form.value.description,
      order,
    });

    this.form.reset();
    this.closeForm('confirm');
  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
