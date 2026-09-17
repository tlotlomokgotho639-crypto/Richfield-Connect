import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from './AppContext'

export function Navbar() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const initials = state.user?.fullName?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'RC'
  function logout() { dispatch({ type: 'LOGOUT_USER' }); navigate('/') }
  return <header className="site-header"><div className="nav-shell"><Link to="/" className="brand" aria-label="Richfield Connect home"><span className="brand-mark">R</span><span><strong>Richfield</strong><small>CONNECT</small></span></Link><nav className="primary-nav" aria-label="Main navigation"><NavLink to="/" end>Home</NavLink><NavLink to="/about">About</NavLink>{state.isAuthenticated && <NavLink to="/feed">Community</NavLink>}</nav><div className="nav-actions">{state.isAuthenticated ? <><Link to="/profile" className="profile-chip"><span className="mini-avatar">{initials}</span><span className="profile-chip-name">{state.user?.fullName?.split(' ')[0]}</span></Link><button className="ghost-button compact" type="button" onClick={logout}>Sign out</button></> : <><Link to="/login" className="login-link">Log in</Link><Link to="/signup" className="button primary small">Join community</Link></>}</div></div></header>
}

export function Footer() {
  return <footer className="site-footer"><div><span className="footer-brand">Richfield Connect</span><p>A focused space for students to learn, share and move forward together.</p></div><div className="footer-links"><Link to="/about">About</Link><Link to="/signup">Create profile</Link><a href="mailto:connect@richfield.ac.za">Contact</a></div><small>© 2026 Richfield Graduate Institute of Technology</small></footer>
}

export function ProfilePreview({ form }) {
  const initials = form.fullName ? form.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2) : 'RC'
  return <aside className="preview-panel"><div className="eyebrow">Live preview</div><div className="preview-avatar">{initials}</div><h3>{form.fullName || 'Your name here'}</h3><p className="preview-campus">{form.campus || 'Choose your campus'}</p><p className="preview-bio">{form.bio || 'Your short bio will appear here as you write it.'}</p><div className="tag-list">{form.interests.length ? form.interests.map((interest) => <span className="tag" key={interest}>{interest}</span>) : <span className="muted">Your interests will appear here</span>}</div><div className="preview-footer"><span>Student profile</span><span>●</span></div></aside>
}

export function CreatePost() {
  const { state, dispatch } = useApp()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  function submitPost(event) { event.preventDefault(); if (!content.trim()) { setError('Write something before posting.'); return } dispatch({ type: 'ADD_POST', payload: { id: crypto.randomUUID(), username: state.user?.fullName || 'Richfield student', timestamp: 'Just now', content: content.trim(), likes: 0, liked: false, comments: [] } }); setContent(''); setError('') }
  return <form className="create-post" onSubmit={submitPost}><div className="composer-avatar">{state.user?.fullName?.slice(0, 1) || 'R'}</div><div className="composer-body"><textarea value={content} onChange={(event) => { setContent(event.target.value); if (event.target.value.trim()) setError('') }} placeholder="Share a thought, question or useful resource..." aria-label="Create a post" rows="3" />{error && <span className="field-error">{error}</span>}<div className="composer-footer"><span className="composer-hint">Keep it useful. Keep it kind.</span><button className="button primary small" type="submit">Publish post <span>↗</span></button></div></div></form>
}

export function Post({ post }) {
  const { state, dispatch } = useApp()
  const [comment, setComment] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(post.content)
  const initials = post.username.split(' ').map((part) => part[0]).join('').slice(0, 2)
  function addComment(event) { event.preventDefault(); if (!comment.trim()) return; dispatch({ type: 'ADD_COMMENT', payload: { postId: post.id, comment: { id: crypto.randomUUID(), username: state.user?.fullName || 'Student', content: comment.trim() } } }); setComment('') }
  function saveEdit() { if (draft.trim()) dispatch({ type: 'EDIT_POST', payload: { id: post.id, content: draft.trim() } }); setEditing(false) }
  function deletePost() { if (window.confirm('Delete this post? This cannot be undone.')) dispatch({ type: 'DELETE_POST', payload: post.id }) }
  return <article className="post-card"><div className="post-head"><div className="post-avatar">{initials}</div><div className="post-meta"><strong>{post.username}</strong><span>{post.timestamp}{post.edited && ' · edited'}</span></div>{post.username === state.user?.fullName && <div className="post-menu"><button type="button" className="icon-button" onClick={() => setEditing(!editing)} aria-label="Edit post">✎</button><button type="button" className="icon-button danger" onClick={deletePost} aria-label="Delete post">×</button></div>}</div>{editing ? <div className="edit-area"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows="3" /><div><button type="button" className="ghost-button" onClick={() => setEditing(false)}>Cancel</button><button type="button" className="button primary small" onClick={saveEdit}>Save edit</button></div></div> : <p className="post-content">{post.content}</p>}<div className="post-actions"><button type="button" className={`post-action ${post.liked ? 'liked' : ''}`} onClick={() => dispatch({ type: 'TOGGLE_LIKE', payload: post.id })}><span>{post.liked ? '♥' : '♡'}</span> {post.likes} {post.likes === 1 ? 'like' : 'likes'}</button><span className="comment-count">{post.comments?.length || 0} comments</span></div>{post.comments?.length > 0 && <div className="comments">{post.comments.map((item) => <div className="comment" key={item.id}><strong>{item.username}</strong><span>{item.content}</span></div>)}</div>}<form className="comment-form" onSubmit={addComment}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a thoughtful reply..." aria-label="Add a comment" /><button type="submit" aria-label="Post comment">↗</button></form></article>
}
