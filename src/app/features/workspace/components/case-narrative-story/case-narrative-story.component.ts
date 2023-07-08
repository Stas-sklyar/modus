import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrialCaseNarrativeStory } from '../../../../models/interfaces/trial-case-narrative-story';

@Component({
  selector: 'lr-case-narrative-story',
  templateUrl: './case-narrative-story.component.html',
  styleUrls: ['./case-narrative-story.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseNarrativeStoryComponent implements OnInit {
  @Input() story!: TrialCaseNarrativeStory;
  arrayOfOpenParentStoryItemIndexes: number[] = [];

  // TODO: fix property type
  childStoryItemVisibility: any = {};
  expandAllBtnIsVisible = true;
  collapseAllBtnIsVisible = false;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.setStoryItemsVisibility();
  }
  openNarrativeStoryPreviewModal(narrativeStoryId: string): void {
    this.router.navigate([], { queryParams: {
      narrativeStoryId,
    } });
  }

  toggleExpandParentStoryItem(index: number): void {
    const indexOfParentStoryItem = this.arrayOfOpenParentStoryItemIndexes.findIndex((item: number) => item === index);

    if (indexOfParentStoryItem !== -1) {
      this.arrayOfOpenParentStoryItemIndexes.splice(indexOfParentStoryItem, 1);
    } else {
      this.arrayOfOpenParentStoryItemIndexes.push(index);
    }
  }

  parentStoryItemIsOpen(parentStoryItemIndex: number): boolean {
    return this.arrayOfOpenParentStoryItemIndexes.find((item: number) => item === parentStoryItemIndex) !== undefined;
  }

  // TODO: REFACTOR METHOD
  toggleExpandChildStoryItem(parentStoryItemIndex: number, childStoryItemIndex: number): void {
    let indexOfChildStoryItem;

    if (this.childStoryItemVisibility[parentStoryItemIndex]) {
      indexOfChildStoryItem = this.childStoryItemVisibility[parentStoryItemIndex].findIndex((item: number) => item === childStoryItemIndex);
    } else {
      indexOfChildStoryItem = -1;
    }

    if (indexOfChildStoryItem !== -1) {
      this.childStoryItemVisibility[parentStoryItemIndex].splice(indexOfChildStoryItem, 1);
    } else {
      if (!this.childStoryItemVisibility[parentStoryItemIndex]) {
        this.childStoryItemVisibility[parentStoryItemIndex] = [];
      }

      this.childStoryItemVisibility[parentStoryItemIndex] = this.childStoryItemVisibility[parentStoryItemIndex].concat([childStoryItemIndex]);
    }
  }

  childStoryItemIsOpen(parentStoryItemIndex: number, childStoryItemIndex: number): boolean {
    if (!this.childStoryItemVisibility[parentStoryItemIndex]) return false;
    return this.childStoryItemVisibility[parentStoryItemIndex].find((item: number) => item === childStoryItemIndex) !== undefined;
  }

  expandAll(): void {
    this.expandAllBtnIsVisible = false;
    this.collapseAllBtnIsVisible = true;

    this.expandAllParentStoryItems();
    this.expandAllChildStoryItems();
  }

  collapseAll(): void {
    this.expandAllBtnIsVisible = true;
    this.collapseAllBtnIsVisible = false;

    this.collapseAllParentStoryItems();
    this.collapseAllChildStoryItems();
  }

  setStoryItemsVisibility(): void {
    for (let i = 0; i < this.story.trialCaseNarrativeStoryItems.length; i++) {
      this.childStoryItemVisibility[i + ''] = [];
    }
  }

  expandAllParentStoryItems(): void {
    for (let i = 0; i < this.story.trialCaseNarrativeStoryItems.length; i++) {
      this.arrayOfOpenParentStoryItemIndexes.push(i);
    }
  }

  expandAllChildStoryItems(): void {
    for (let i = 0; i < this.story.trialCaseNarrativeStoryItems.length; i++) {
      for (let j = 0; j < this.story.trialCaseNarrativeStoryItems[i].items.length; j++) {
        this.childStoryItemVisibility[i].push(j);
      }
    }
  }

  collapseAllParentStoryItems(): void {
    this.arrayOfOpenParentStoryItemIndexes = [];
  }
  collapseAllChildStoryItems(): void {
    for (let i = 0; i <  this.story.trialCaseNarrativeStoryItems.length; i++) {
      this.childStoryItemVisibility[i] = [];
    }
  }
}
