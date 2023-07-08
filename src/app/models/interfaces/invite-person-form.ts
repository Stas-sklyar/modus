import { FormControl } from '@angular/forms';
import { UserRole } from '../aliases/user-role';

export interface InvitePersonForm {
  email: FormControl<string | null>,
  title: FormControl<string | null>,
  role: FormControl<UserRole | null>,
}
