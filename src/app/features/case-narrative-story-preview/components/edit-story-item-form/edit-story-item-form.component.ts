import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NarrativeStoryItemType } from '../../../../models/enums/narrative-story-item-type';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { EditingStoryItem } from '../../../../models/interfaces/editing-story-item';
import { EditStoryItemForm } from '../../../../models/interfaces/edit-story-item-form';
import { TrialCaseNarrativeStoryItem } from '../../../../models/interfaces/trial-case-narrative-story-item';
import { Document } from '../../../../models/interfaces/document';

@Component({
  selector: 'lr-edit-story-item-form',
  templateUrl: './edit-story-item-form.component.html',
  styleUrls: ['./edit-story-item-form.component.scss'],
})
export class EditStoryItemFormComponent implements OnInit {
  @Output() hideFormEvent = new EventEmitter();
  @Output() editStoryItemEvent = new EventEmitter<EditingStoryItem>();

  @Input() storyItem!: TrialCaseNarrativeStoryItem;
  @Input() parentStoryItems!: TrialCaseNarrativeStoryItem[];
  private _subscription = new Subscription();
  participants$ = this.trialCasePeopleService.people$;

  form = new FormGroup<EditStoryItemForm>({
    storyItemType: new FormControl(null, Validators.required),
    title: new FormControl('', Validators.required),
    parentStoryItemId: new FormControl(null),
    description: new FormControl(''),
  });

  constructor(
    private trialCasePeopleService: TrialCasePeopleService,
  ) {}

  ngOnInit(): void {
    this.setInitialFormState();
    this.loadParticipants();
  }

  setInitialFormState(): void {
    let storyItemType: NarrativeStoryItemType = this.calcStoryItemType();

    this.form.get('storyItemType')?.setValue(storyItemType);
    this.form.get('title')?.setValue(this.storyItem.title);
    this.form.get('description')?.setValue(this.storyItem.description);
    this.form.get('parentStoryItemId')?.setValue(this.storyItem.trialCaseNarrativeStoryItemId);
  }

  loadParticipants(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople().subscribe(),
    );
  }

  calcStoryItemType(): NarrativeStoryItemType {
    switch (this.storyItem.type) {
      case 'fact': {
        return NarrativeStoryItemType.FACT;
      }

      case 'note': {
        return NarrativeStoryItemType.NOTE;
      }

      case 'allegation': {
        return NarrativeStoryItemType.ALLEGATION;
      }

      default: {
        return NarrativeStoryItemType.NOTE;
      }
    }
  }
  closeForm(): void {
    this.hideFormEvent.emit();
  }

  updateStoryItem(): void {
    this.editStoryItemEvent.emit({
      id: this.storyItem.id,
      storyItemType: this.form.value.storyItemType || NarrativeStoryItemType.NOTE,
      title: this.form.value.title || '',
      parentStoryItemId: this.form.value.parentStoryItemId || null,
      description: this.form.value.description || '',
    });
  }

  getRelatedStoryItemDocuments(storyItem: TrialCaseNarrativeStoryItem): Document[] | null {
    return storyItem.documents?.map((item: any) => item.document) || null;
  }
}
