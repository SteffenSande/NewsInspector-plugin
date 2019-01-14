import {IReportCategory} from "./reportCategory";
import {IUserReport} from "./user Report";

export interface IHeadlineReport {
    category: IReportCategory,
    reports: IUserReport[]
}