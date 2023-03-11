export class EmotionalResult {

    angry: number;
    sad: number;
    glad: number;
    excited: number;
    notAnswered: number;

    constructor(
        excited: number,
        angry: number,
        sad: number,
        glad: number,
        notAnswered: number
    ) {
        this.angry = angry;
        this.sad = sad;
        this.glad = glad;
        this.excited = excited;
        this.notAnswered = notAnswered;
    }
}
