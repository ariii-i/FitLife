import { Header } from "../components/layout/Header";
import { Layout } from "../components/layout/Layout";

export function Dashboard(){
    return(
        <Layout>
            <Header/>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-2 text-teal-600">
                Welcome to fitness dashboard
            </p>
        </Layout>
    )
}