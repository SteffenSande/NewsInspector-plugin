export interface IArticleTemplate {
    id: number,
    name: string,
    journalist: string,
    title: string,
    sub_title: string,
    content: string,
    selector: string,
    published: string,
    updated: string,
    datetime_attribute: string,
    timezone: string,
    image_attribute: string,
    image_text: string,
    image_photographer: string,
    image_element: string,
    photographer_delimiter: string[],
    photograph_ignore_text: string[],
    ignore_content_tag: string,
    subscription: string,
    video: string,
}