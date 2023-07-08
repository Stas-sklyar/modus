import { FormControl } from '@angular/forms';
import { PartyTypeEnum } from '../enums/party-type';

export interface EditTimelineEventFrom {
  title: FormControl<string | null>,
  date: FormControl<string | null>,
  time: FormControl<string | null>,
  description: FormControl<string | null>,
  partyType: FormControl<PartyTypeEnum | null>
}
