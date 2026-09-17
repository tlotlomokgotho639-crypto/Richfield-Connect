import { Link } from 'react-router-dom'
import { useApp } from '../AppContext'

export default function Profile() {
  const { state } = useApp()
  if (!state.user) return <main className="page empty-page"><div className="empty-icon">R</div><h1>Your profile is waiting.</h1><p>Register to create your academic identity and join the community.</p><Link to="/signup" className="button primary">Create profile <span>↗</span></Link></main>
  const { user } = state
  const initials = user.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2)
  const ownPosts = state.posts.filter((post) => post.username === user.fullName).length
  return <main className="page profile-page"><div className="profile-banner"><div className="banner-pattern"></div><div className="profile-avatar">{initials}</div></div><section className="profile-details"><div className="profile-title"><div><div className="eyebrow">Student profile</div><h1>{user.fullName}</h1><p className="profile-location">{user.campus} campus · {user.studentNumber}</p></div><Link to="/feed" className="button outline">Go to community <span>↗</span></Link></div><div className="profile-content"><div className="profile-main"><p className="profile-bio">{user.bio}</p><div className="profile-section"><div className="eyebrow">Areas of interest</div><div className="tag-list">{user.interests.map((interest) => <span className="tag" key={interest}>{interest}</span>)}</div></div></div><aside className="profile-aside"><div className="profile-stat"><strong>{ownPosts}</strong><span>Posts</span></div><div className="profile-stat"><strong>24</strong><span>Connections</span></div><div className="profile-stat"><strong>3</strong><span>Groups</span></div><div className="profile-contact"><span className="eyebrow">Contact</span><a href={`mailto:${user.email}`}>{user.email}</a></div></aside></div></section></main>
}
