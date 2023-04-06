import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { gfmTable } from 'micromark-extension-gfm-table'
import { gfmTableFromMarkdown, gfmTableToMarkdown } from 'mdast-util-gfm-table'
import { gfmFootnote } from 'micromark-extension-gfm-footnote'
import { gfmFootnoteFromMarkdown, gfmFootnoteToMarkdown } from 'mdast-util-gfm-footnote'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmStrikethroughFromMarkdown, gfmStrikethroughToMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTaskListItem } from 'micromark-extension-gfm-task-list-item'
import { gfmTaskListItemFromMarkdown, gfmTaskListItemToMarkdown } from 'mdast-util-gfm-task-list-item'

/**
 * @param {string} md
 */
export function parseMarkdown (md) {
  return fromMarkdown(md, {
    extensions: [
      gfm(),
      gfmTable,
      gfmFootnote(),
      gfmStrikethrough(),
      gfmTaskListItem
    ],
    mdastExtensions: [
      gfmFromMarkdown(),
      gfmTableFromMarkdown,
      gfmFootnoteFromMarkdown(),
      gfmStrikethroughFromMarkdown,
      gfmTaskListItemFromMarkdown
    ]
  })
}

/**
 *
 * @param {import('mdast').Root | import('mdast').Content} tree
 */
export function writeMarkdown (tree) {
  return toMarkdown(tree, {
    extensions: [
      gfmToMarkdown(),
      gfmTableToMarkdown(),
      gfmFootnoteToMarkdown(),
      gfmStrikethroughToMarkdown,
      gfmTaskListItemToMarkdown
    ],
    bullet: '-',
    listItemIndent: 'one'
  })
}
