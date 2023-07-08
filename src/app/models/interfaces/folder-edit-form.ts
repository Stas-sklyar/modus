import { FormControl } from '@angular/forms';
import { CASE_FOLDER_ACCESS_LEVEL } from '../aliases/case-folder-access-level.type';

export interface FolderEditForm {
  name: FormControl<string | null>,
  description: FormControl<string | null>,
  accessLevel: FormControl<CASE_FOLDER_ACCESS_LEVEL | null>
}
