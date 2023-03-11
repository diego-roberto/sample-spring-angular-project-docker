export class WorkersReportType {
  static readonly BY_CONSTRUCTION = 0;
  static readonly EPI_HISTORY = 1;


  static values() {
    return [this.BY_CONSTRUCTION, this.EPI_HISTORY];
  }
}
