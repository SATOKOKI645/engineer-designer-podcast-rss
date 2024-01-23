import { Feed, FeedOptions } from 'feed';
import { CustomRssParserItem, OgsResultMap } from './feed-crawler';
import { escapeTextForXml, textToMd5Hash, textTruncate } from './common-util';
import { logger } from './logger';
import * as constants from '../../common/constants';

export interface OutputFeedSet {
  atom: string;
  rss: string;
  json: string;
}

export class FeedGenerator {
  createFeed(
    feedItems: CustomRssParserItem[],
    feedItemOgsResultMap: OgsResultMap,
    maxFeedDescriptionLength: number,
    maxFeedContentLength: number,
  ): Feed {
    const outputFeed = new Feed({
      title: constants.feedTitle,
      description: constants.feedDescription,
      language: constants.feedLanguage,
      id: `${constants.siteUrlStem}/`,
      link: `${constants.siteUrlStem}/`,
      feedLinks: constants.feedUrls,
      image: `${constants.siteUrlStem}/images/icon.png`,
      favicon: `${constants.siteUrlStem}/images/favicon.ico`,
      copyright: constants.feedCopyright,
      generator: constants.feedGenerator,
      updated: new Date(),
    } as FeedOptions);

    for (const feedItem of feedItems) {
      // ポッドキャストはブログと違って音声がないと意味がないので、音声がないものは入れない
      if (feedItem.enclosure?.url === undefined) {
        logger.warn('[feed-item] フィードのurlがありません。', feedItem.enclosure?.url, feedItem.title);
        continue;
      }
      logger.info('[create-feed-item]', feedItem.isoDate, feedItem.title);

      const feedItemId = feedItem.guid || feedItem.link;
      const feedItemContent = (feedItem.summary || feedItem.contentSnippet || '').replace(/(\n|\t+|\s+)/g, ' ');

      const ogsResult = feedItemOgsResultMap.get(feedItem.enclosure.url);
      const ogImage = ogsResult?.ogImage;

      // 日付がないものは入れない
      if (!feedItem.isoDate) {
        logger.warn('[feed-item] フィードの日付がありません。', feedItem.isoDate, feedItem.title);
        continue;
      }

      outputFeed.addItem({
        id: feedItemId,
        guid: feedItemId,
        // 「記事タイトル | ブログ名」の形にする。タイトルだけでどの企業かわかるように
        title: `${feedItem.title} | ${feedItem.blogTitle}`,
        description: textTruncate(feedItemContent, maxFeedDescriptionLength),
        content: textTruncate(feedItemContent, maxFeedContentLength),
        link: feedItem.link || feedItem.audioUrl,
        category: (feedItem.categories || []).map((category) => {
          return {
            name: category,
          };
        }),
        author:
          feedItem.creator && typeof feedItem.creator === 'string'
            ? [
                {
                  name: feedItem.creator,
                },
              ]
            : undefined,
        image:
          ogImage && ogImage.url
            ? {
                type: ogImage.type,
                url: ogImage.url,
              }
            : undefined,
        published: new Date(feedItem.isoDate),
        date: new Date(feedItem.isoDate),
        extensions: [
          {
            name: '_custom',
            objects: {
              originalTitle: feedItem.title,
              blogTitle: feedItem.blogTitle,
              blogLink: feedItem.blogLink,
              blogLinkMd5Hash: textToMd5Hash(feedItem.blogLink),
            },
          },
        ],
      });
    }

    logger.info('[create-feed] finished');

    return outputFeed;
  }

  public generateOutputFeedSet(feed: Feed): OutputFeedSet {
    return {
      // 出力されているXMLで & がエスケープされていないのでパッチ対応
      atom: escapeTextForXml(feed.atom1()),
      rss: escapeTextForXml(feed.rss2()),
      json: feed.json1(),
    };
  }
}
