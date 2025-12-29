export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-2">Welcome to the Investment Monitoring Dashboard.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Investment</h3>
                    </div>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </div>
                {/* Add more cards as needed */}
            </div>
        </div>
    );
}
