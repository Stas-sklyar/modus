import { FormControl } from '@angular/forms';

export interface UserCreateForm {
  login: FormControl<string | null>,
  password: FormControl<string | null>,
  company: FormControl<string | null>,
}
