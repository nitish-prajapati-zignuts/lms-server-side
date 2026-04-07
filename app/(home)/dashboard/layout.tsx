import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarComponent } from "./_Components/SidebarComponent";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        // <SidebarProvider>
        //     <div className="flex h-screen overflow-hidden">
        //         <SidebarComponent />
        //         <div className="flex-1 overflow-auto">
        //             {children}
        //         </div>
        //     </div>
        // </SidebarProvider>
        <div>
            {children}
        </div>
    )
}