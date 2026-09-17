import { Link, Navigate } from 'react-router-dom'
import { CreatePost, Post } from '../components'
import { useApp } from '../AppContext'

export default function Feed() {
  const { state } = useApp()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  return <main className="page feed-page"><div className="feed-heading"><div><div className="eyebrow">The student community</div><h1>What’s happening<br /><em>around campus.</em></h1></div><div className="feed-intro"><span className="live-dot"></span><p>Live from Richfield<br /><small>A space for useful conversations</small></p></div></div><div className="feed-layout"><section><CreatePost /><div className="feed-filter"><span>Latest conversations</span><span className="filter-line"></span><button type="button">Newest ↓</button></div>{state.posts.map((post) => <Post key={post.id} post={post} />)}</section><aside className="feed-sidebar"><div className="sidebar-block"><div className="eyebrow">Your profile</div><div className="sidebar-profile"><div className="post-avatar">{state.user?.fullName?.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><strong>{state.user?.fullName}</strong><span>{state.user?.campus} campus</span></div></div><Link to="/profile" className="sidebar-link">View profile <span>↗</span></Link></div><div className="sidebar-block topics"><div className="eyebrow">Popular this week</div><span>#webtechnology</span><span>#studygroups</span><span>#studentprojects</span><span>#careerdevelopment</span></div><div className="sidebar-quote">“Ask the question.<br /><em>Someone is listening.</em>”</div></aside></div></main>
}
