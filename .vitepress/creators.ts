export interface SocialEntry {
  type: 'github' | 'twitter' | 'email'
  icon: string
  link: string
}

export interface Creator {
  avatar: string
  name: string
  username?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`

export const creators: Creator[] = [
  {
    name: 'breatheCoder',
    avatar: '',
    username: 'breatheCoder',
    title: 'Java 后端开发',
    desc: '一个想要进行更多技术学习的后端开发爱好者',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/breatheCoder' },
    ],
    emailAliases: ['18295991037@163.com'],
  }
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrl(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
