import { FormControl } from '@angular/forms';

export interface EditPersonForm {
  name: FormControl<string | null>,
  userType: FormControl<string | null>,
  email: FormControl<string | null>,
  phoneNumber: FormControl<string | null>,
  address: FormControl<string | null>,
  description: FormControl<string | null>,
}
