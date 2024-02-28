import * as dayjs from 'dayjs';
import 'dayjs/locale/ko';

export class SearchDtoBase {
  chart: string;
  startDate: Date;
  endDate: Date;

  private formatDate(date: Date, formatString: string) {
    return dayjs(date).locale('ko').format(formatString);
  }

  get startYmd() {
    return this.formatDate(this.startDate, 'YYYYMMDD');
  }

  get endYmd() {
    return this.formatDate(this.endDate, 'YYYYMMDD');
  }

  get koStartDtString() {
    return this.formatDate(this.startDate, 'YYYY-MM-DD HH:mm:ss');
  }

  get koEndDtString() {
    return this.formatDate(this.endDate, 'YYYY-MM-DD HH:mm:ss');
  }
}
