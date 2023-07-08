import { FormControl } from '@angular/forms';

export interface EditParticipantForm {
  name: FormControl<string | null>,
  title: FormControl<string | null>
  email: FormControl<string | null>,
  phone: FormControl<string | null>,
  address: FormControl<string | null>,
  companyName: FormControl<string | null>,
  description: FormControl<string | null>,
}
