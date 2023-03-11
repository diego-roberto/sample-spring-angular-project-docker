export class Profile {
  id: number;
  description: string;

  constructor() {
  }

  public initializeWithJSON(json: any) {
    this.id = json.id;
    this.description = json.description;
    return this;
  }
}
