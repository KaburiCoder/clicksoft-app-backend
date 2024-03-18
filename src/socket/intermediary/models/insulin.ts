export class Insulin {
  id: string;
  writeDateShortText: string;
  managerName: string;
  details: InsulinDetail[];
}

export class InsulinDetail {
  timeText: string;
  code: string;
  name: string;
  volume?: string;
  part?: number;
  blood?: string;
  urine?: string;
  memo?: string;
}
