import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, BarChart3 } from 'lucide-react'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import ProjectForm from './pages/ProjectForm'

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                {/* Navigation Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2">
                                <FolderKanban className="h-8 w-8 text-primary" />
                                <span className="text-xl font-bold text-gray-900">
                                    Project Invest
                                </span>
                            </Link>

                            {/* Navigation Links */}
                            <nav className="flex items-center gap-6">
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                                <a
                                    href="http://localhost:3001"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                                >
                                    <BarChart3 className="h-5 w-5" />
                                    <span className="hidden sm:inline">Grafana</span>
                                </a>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<ProjectList />} />
                        <Route path="/projects/new" element={<ProjectForm />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/edit/:id" element={<ProjectForm />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <p className="text-center text-sm text-gray-500">
                            Project Investment Management System © {new Date().getFullYear()}
                        </p>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    )
}

export default App
