export interface BlogCategory {
  slug: string
  title: string
  description: string
  icon: string
  order: number
}

export const blogCategories: BlogCategory[] = [
  {
    slug: 'edinoe-posobie',
    title: 'Единое пособие',
    description: 'Всё о едином пособии для семей с детьми и беременных женщин',
    icon: '👶',
    order: 1
  },
  {
    slug: 'dekretnye',
    title: 'Декретные выплаты',
    description: 'Расчёт и получение декретных выплат',
    icon: '🤰',
    order: 2
  },
  {
    slug: 'semejnaya-ipoteka',
    title: 'Семейная ипотека',
    description: 'Условия и оформление семейной ипотеки',
    icon: '🏠',
    order: 3
  },
  {
    slug: 'detskie-posobiya',
    title: 'Детские пособия',
    description: 'Различные пособия и выплаты на детей',
    icon: '💰',
    order: 4
  }
]

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogCategories.find(cat => cat.slug === slug)
}