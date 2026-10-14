import { OfficialCommitteeData } from '../types/committeeTypes';
import { CommitteePrintPageScope } from '../components/committee/CommitteePrintBooklet';

export function printIsolatedCommitteeBooklet(
  data: OfficialCommitteeData,
  scope: CommitteePrintPageScope = 'all'
): void {
  window.print();
}
