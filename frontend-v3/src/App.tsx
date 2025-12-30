import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { TooltipProvider } from "@/components/ui/tooltip"
import Login from "@/pages/Login"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import Dashboard from "@/pages/Dashboard"
import InvestmentTable from "@/pages/InvestmentTable"
import DataKontrak from "@/pages/DataKontrak"
import KontrakByInvestasi from "@/pages/KontrakByInvestasi"
import EditInvestasi from "@/pages/EditInvestasi"
import InvestmentDashboard from "@/pages/InvestmentDashboard"
import InvestmentProject from "@/pages/InvestmentProject"


function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

function AppRoutes() {
    const { isAuthenticated } = useAuth()

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="invest" element={<InvestmentTable />} />
                <Route path="invest/:refIdRoot/edit" element={<EditInvestasi />} />
                <Route path="invest/:idInvestasi/kontrak" element={<KontrakByInvestasi />} />
                <Route path="investment-dashboard" element={<InvestmentDashboard />} />
                <Route path="investment-project" element={<InvestmentProject />} />
                <Route path="kontrak" element={<DataKontrak />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <TooltipProvider>
                    <AppRoutes />
                </TooltipProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
