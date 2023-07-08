import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Observable, Subscription, take } from 'rxjs';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import 'quill-mention';
import { TrialCasePerson } from '../../../models/interfaces/trial-case-person';


@Component({
  selector: 'lr-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TextEditorComponent,
    multi: true,
  }],
})
export class TextEditorComponent implements OnDestroy, ControlValueAccessor {
  @Input() placeholder = '';
  @Input() name = 'textEditor';
  @Input() participants$?: Observable<TrialCasePerson[] | null>;
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
    ],
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      onSelect: (item: any, insertItem: any) => {
        const editor = this.editor.quillEditor;
        insertItem(item);
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, '', 'user');
      },
      source: (searchTerm: string, renderList: any) => {
        this._subscription.add(
          this.participants$?.pipe(take(1)).subscribe(
            participants => {
              const suggestions = participants?.filter(participant => participant.name.toLowerCase()
                .includes(searchTerm.toLowerCase()))
                .map(item => ({
                  name: item.name,
                  value: item.name,
                  id: item.id,
                })) || [];

              if (searchTerm.length) {
                renderList(suggestions, searchTerm);
              }
            },
          ),
        );
      },
    },
  };

  private _value = '';
  get value(): string {
    return this._value;
  }
  set value(val: string) {
    this._value = val;
  }
  disabled = false;
  onChange!: (val: string) => void;
  onTouched!: () => void;
  private _subscription = new Subscription();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  setValue(val: string): void {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  writeValue(val: string): void {
    this.value = val;
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
