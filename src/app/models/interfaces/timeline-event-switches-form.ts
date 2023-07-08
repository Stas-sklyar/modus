import { FormControl } from '@angular/forms';

export interface TimelineEventSwitchesForm {
  defenceSwitch: FormControl<boolean | null>
  plaintiffSwitch: FormControl<boolean | null>
  otherSwitch: FormControl<boolean | null>
}
