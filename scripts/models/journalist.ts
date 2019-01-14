import {IPerson} from "./person";

export interface IJournalist extends IPerson {}

class Journalist implements IJournalist {
    id: number;
    firstName: string;
    lastName: string;

    print(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    fromJSON(journalist: IJournalist) {
        this.id = journalist.id;
        this.firstName = journalist.firstName;
        this.lastName = journalist.lastName;
    }
}

export default Journalist;