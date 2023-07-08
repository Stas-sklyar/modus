import { FormControl } from '@angular/forms';

export interface ConfirmNewPasswordForm {
  newPassword: FormControl<string | null>,
  confirmPassword: FormControl<string | null>,
}
