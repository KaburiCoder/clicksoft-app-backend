export class VitalSign {
  id: string;
  writeDateFullText: string;
  managerName: string;
  details: VitalSignDetail[];
}

export class VitalSignDetail {
  title: string;
  value: string;
}
