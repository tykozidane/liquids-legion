import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger
} from "@/components/ui/sidebar"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AddTransaction from "./AddTransaction";
// import TransactionPage from "./TransactionPage";




export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb >
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="https://liquidslegion.tykozidane.com/dashboard/transaction">
                  <BreadcrumbPage>Transaction</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  <BreadcrumbPage>Input Transaction</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AddTransaction session={session} />
        </div>
    </>
  )
}
