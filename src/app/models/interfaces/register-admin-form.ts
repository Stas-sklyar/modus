import { FormControl } from '@angular/forms';

export interface RegisterAdminForm {
  name: FormControl<string | null>,
  email: FormControl<string | null>,
  password: FormControl<string | null>,
  companyName: FormControl<string | null>,
}
