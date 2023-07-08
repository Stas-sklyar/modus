import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lr-upload-file-control',
  templateUrl: './upload-file-control.component.html',
  styleUrls: ['./upload-file-control.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UploadFileControlComponent {
  @Output() fileWasUploaded: EventEmitter<File[]> = new EventEmitter();

  onUploadFile(target: any): void {
    const files: File[] = target.files;
    this.fileWasUploaded.emit(files);
  }
}
