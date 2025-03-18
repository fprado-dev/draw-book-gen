import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function SideUpgradeForm() {
  const isMobile = useIsMobile()
  console.log({ isMobile })
  return (
    <SidebarMenu className={isMobile ? "opacity-0 overflow-hidden" : ""}>
      <SidebarMenuItem>

        <Card className="shadow-none w-full">
          <form>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-base">Upgrade to Pro Plan</CardTitle>
              <CardDescription className="text-xs">
                Unlock premium features and take your experience to the next level with our Pro plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2.5 p-4">
              <Button
                className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
                size="sm"
              >
                Get Pro Access
              </Button>
            </CardContent>
          </form>
        </Card>
      </SidebarMenuItem>

    </SidebarMenu>
  )
}
