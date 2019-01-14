export enum ReportCategory {
    Clickbait = "Clickbait",
    FakeNews = "Fake news"
}

export interface IReportCategory {
    category: ReportCategory,
    id: number
}