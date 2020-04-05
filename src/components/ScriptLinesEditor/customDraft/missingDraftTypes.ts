import { ContentState, DraftInlineStyle } from "draft-js"
import { ReactElement, ReactNode } from "react"

export interface CharacterMetadataConfig {
  style?: DraftInlineStyle
  entity?: string
}

export type DraftDecoratorComponentProps = {
  blockKey: string
  children?: ReactElement[] //Array<ReactNode>
  contentState: ContentState
  decoratedText: string
  dir?: any //HTMLDir,
  end: number
  // Many folks mistakenly assume that there will always be an 'entityKey'
  // passed to a DecoratorComponent.
  // To find the `entityKey`, Draft calls
  // `contentBlock.getEntityKeyAt(leafNode)` and in many cases the leafNode does
  // not have an entityKey. In those cases the entityKey will be null or
  // undefined. That's why `getEntityKeyAt()` is typed to return `?string`.
  // See https://github.com/facebook/draft-js/blob/2da3dcb1c4c106d1b2a0f07b3d0275b8d724e777/src/model/immutable/BlockNode.js#L51
  entityKey?: string
  offsetKey: string
  start: number
}
