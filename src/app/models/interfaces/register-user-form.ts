import { FormControl } from '@angular/forms';

export interface RegisterUserForm {
  name: FormControl<string | null>,
  password: FormControl<string | null>,
}
