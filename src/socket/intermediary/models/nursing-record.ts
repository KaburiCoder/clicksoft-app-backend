export class NursingRecord {
  /**
   * 작성일자
   */
  writeDateFullText: string;
  nurseName: string;
  details: NursingDetail[];
}

export class NursingDetail {
  title: string;
  detail: string;
}
