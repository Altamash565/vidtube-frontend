declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react'
  
  export type IconProps = SVGProps<SVGSVGElement> & {
    size?: number | string
    color?: string
    stroke?: number | string
    absoluteStrokeWidth?: boolean
    className?: string
    fill?: string | boolean
  }

  export const ArrowLeft: FC<IconProps>
  export const ThumbsUp: FC<IconProps>
  export const ThumbsDown: FC<IconProps>
  export const Share2: FC<IconProps>
  export const Download: FC<IconProps>
  export const MoreHorizontal: FC<IconProps>
  export const Play: FC<IconProps>
  export const Send: FC<IconProps>
  export const Plus: FC<IconProps>
  export const X: FC<IconProps>
  export const Edit3: FC<IconProps>
  export const Film: FC<IconProps>
  export const FolderHeart: FC<IconProps>
  export const FolderPlus: FC<IconProps>
  export const Trash2: FC<IconProps>
  export const ListVideo: FC<IconProps>
  export const Users: FC<IconProps>
  export const Search: FC<IconProps>
  export const Bell: FC<IconProps>
  export const BellOff: FC<IconProps>
  export const LayoutGrid: FC<IconProps>
  export const List: FC<IconProps>
}
