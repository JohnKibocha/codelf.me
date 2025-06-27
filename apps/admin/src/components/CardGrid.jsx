import OverviewCard from './OverviewCard'
import {
    LayoutGrid,
    FileText,
    Star,
    Mail,
    User,
    FilePlus
} from 'lucide-react'

const metrics = [
    { title: 'Total Projects', count: 0, to: '/projects', icon: LayoutGrid },
    { title: 'Published Blogs', count: 0, to: '/blogs', icon: FileText },
    { title: 'Pending Reviews', count: 0, to: '/reviews', icon: Star },
    { title: 'Messages', count: 0, to: '/messages', icon: Mail },
    { title: 'Drafts', count: 0, to: '/drafts', icon: FilePlus },
    { title: 'Total Views', count: 0, to: '/analytics', icon: User },
]

export default function CardGrid({ data = metrics }) {
    return (
        <div className="card-grid mt-4">
            {data.map((card) => (
                <OverviewCard key={card.title} {...card} />
            ))}
        </div>
    )
}
