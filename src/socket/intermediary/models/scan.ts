export class Scan {
  id: string;
  /** 작성일자 */
  writeDateFullText: string;
  code: string;
  name: string;
  details?: ScanDetail;
}

export class ScanDetail {
  id: string;
  image: Buffer;
}
