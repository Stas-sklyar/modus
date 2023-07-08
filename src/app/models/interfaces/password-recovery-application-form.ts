import { FormControl } from '@angular/forms';

export interface PasswordRecoveryApplicationForm {
  email: FormControl<string | null>;
}
