import { DashboardCard } from "../components/dashboard/dashboard-card";
import { Header } from "../components/layout/Header";
import { Layout } from "../components/layout/Layout";

export function Dashboard(){

    return(
        <Layout>
            <Header/>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <DashboardCard/>
        </Layout>
    )
}