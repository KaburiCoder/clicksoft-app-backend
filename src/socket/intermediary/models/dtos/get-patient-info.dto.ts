export class GetPatientInfoDto {
  weib: Weib;
}

export enum Weib {
  전체 = 0,
  입원 = 1,
  외래 = 2,
}
