export class Expense {
    constructor(
        public Identifier: string,
        public Name: string,
        public Value: number,
        public Date: Date,
        public Category: string,
    ) { }
}
