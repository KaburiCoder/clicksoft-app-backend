export class ObservationChart {
  id: string;
  shortDateText: string;
  ibTerm: string;
  vsList?: ObservationVs[];
  bstList?: ObservationBst[];
  insulinList?: ObservationInsulin[];
  intake?: ObservationIntake;
  output?: ObservationOutput;
  fluidList?: string[];
  sideMixedList?: string[];
  food?: ObservationFood;
  respiration?: ObservationRespiration;
  ekg?: ObservationEkg;
  intubation?: { [key: string]: string };
  foleyList?: string[];
  emergencyOrderList?: string[];

  get isEmpty() {
    return (
      !this.vsList &&
      !this.bstList &&
      !this.insulinList &&
      !this.intake &&
      !this.output &&
      !this.fluidList &&
      !this.sideMixedList &&
      !this.food &&
      !this.respiration &&
      !this.ekg &&
      !this.intubation &&
      !this.foleyList &&
      !this.emergencyOrderList
    );
  }
}

export interface ObservationEkg extends StartEnd {
  SPO2?: string;
}

export interface ObservationRespiration {
  cprTime?: StartEnd;
  oxygen?: Oxygen;
  AV?: StartEnd;
}

export interface ObservationFood {
  breakfast?: FoodData;
  lunch?: FoodData;
  dinner?: FoodData;
}

export interface FoodData {
  diet?: string;
  volume?: string;
  note?: string;
}
export class ObservationVs {
  /** 혈압(고) */
  highBP?: string;
  /** 혈압(저) */
  lowBP?: string;
  /** 맥박 */
  pulse?: string;
  /** 호흡 */
  respiration?: string;
  /** 체온 */
  temperature?: string;
  /** 측정시간 */
  measurementTime?: string;
}

export interface ObservationBst {
  time: string;
  value: string;
}

export interface ObservationInsulin {
  time?: string;
  name?: string;
  /** 용량 */
  dosage?: string;
  /** 혈당 */
  bloodSugar?: string;
}

export interface ObservationIntake {
  D?: IntakeData;
  E?: IntakeData;
  N?: IntakeData;
  totalIntake?: string;
}

export interface ObservationOutput {
  D?: OutputData;
  E?: OutputData;
  N?: OutputData;
  /** 총 배설량 */
  totalExcretion?: string;
}

interface IntakeData {
  oral?: string;
  parenteral?: string;
}

interface OutputData {
  urine?: string;
  stool?: {
    /** 용량 */
    amount?: string;
    /** 횟수 */
    frequency?: string;
  };
  drainage?: string;
}

interface StartEnd {
  start?: string;
  end?: string;
}

interface Oxygen {
  amount: StartEnd;
  totalAmount: string;
}
