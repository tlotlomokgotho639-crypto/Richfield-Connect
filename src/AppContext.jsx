import { createContext, useEffect, useReducer, useContext } from 'react'

export const AppContext = createContext(null)

const starterPosts = [
  { id: 'welcome-post', username: 'Richfield Connect', timestamp: 'Welcome week', content: 'Welcome to the new Richfield Connect community. Share your latest project, find a study partner, and make your next academic connection count.', likes: 12, liked: false, comments: [{ id: 'welcome-comment', username: 'Anele M.', content: 'Looking forward to connecting with everyone!' }] },
  { id: 'study-post', username: 'Thabo K.', timestamp: 'Yesterday at 14:20', content: 'Our UX research group is looking for one more person who enjoys turning interviews into useful product insights. Anyone interested?', likes: 8, liked: false, comments: [] },
]

const initialState = { user: null, posts: starterPosts, isAuthenticated: false }

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': return { ...state, ...action.payload }
    case 'REGISTER_USER': return { ...state, user: action.payload, isAuthenticated: true }
    case 'LOGIN_USER': return { ...state, isAuthenticated: true }
    case 'LOGOUT_USER': return { ...state, isAuthenticated: false }
    case 'ADD_POST': return { ...state, posts: [action.payload, ...state.posts] }
    case 'TOGGLE_LIKE': return { ...state, posts: state.posts.map((post) => post.id === action.payload ? { ...post, liked: !post.liked, likes: post.liked ? Math.max(0, post.likes - 1) : post.likes + 1 } : post) }
    case 'ADD_COMMENT': return { ...state, posts: state.posts.map((post) => post.id === action.payload.postId ? { ...post, comments: [...(post.comments || []), action.payload.comment] } : post) }
    case 'EDIT_POST': return { ...state, posts: state.posts.map((post) => post.id === action.payload.id ? { ...post, content: action.payload.content, edited: true } : post) }
    case 'DELETE_POST': return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) }
    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const savedUser = localStorage.getItem('richfield-user')
    const savedPosts = localStorage.getItem('richfield-posts')
    dispatch({ type: 'HYDRATE', payload: { user: savedUser ? JSON.parse(savedUser) : null, posts: savedPosts ? JSON.parse(savedPosts) : starterPosts, isAuthenticated: localStorage.getItem('richfield-session') === 'true' } })
  }, [])

  useEffect(() => {
    if (state.user) localStorage.setItem('richfield-user', JSON.stringify(state.user))
    localStorage.setItem('richfield-posts', JSON.stringify(state.posts))
    localStorage.setItem('richfield-session', String(state.isAuthenticated))
  }, [state.user, state.posts, state.isAuthenticated])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
