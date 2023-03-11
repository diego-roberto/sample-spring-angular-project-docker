export class ConstructionReportType {
    static readonly DOCUMENTS_CONTROL = 0;
    static readonly CONSTRUCTION_CHECKLIST = 1;

    static values() {
        return [ this.DOCUMENTS_CONTROL, this.CONSTRUCTION_CHECKLIST ];
    }
}
