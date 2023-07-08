import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lr-documents-folder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents-folder.component.html',
  styleUrls: ['./documents-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsFolderComponent {
  @Input() title = 'Folder';
  @Input() filesAmount: number | null = null;
  @Input() selected = false;
}
