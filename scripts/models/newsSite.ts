import {IHeadline} from "./headline";
import {IArticleTemplate} from "./articleTemplate";
import {IArticleUrlTemplates} from "./ArticleUrlTemplates";
export interface INewsSite {
    id: number,
    name: string,
    abbreviation: string,
    base_url: string,
    current_headline_count_on_front_page: number,
    max_headlines_count: number,
    articleTemplate: IArticleTemplate,
    headlineTemplate: IHeadlineTemplate,
    headlines: IHeadline[],
    urlTemplates: IArticleUrlTemplates[],
    word_cloud: string
}

interface IHeadlineTemplate {
    headline: string
    url: string,
    list: string[]
}
