import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";


type PageHeaderProps = {
  icon?: React.ReactNode;
  button_text?: string
  titleText: string
  description: string
  onClick?: () => void
};
export function PageHeader({ button_text, titleText, description, icon = <PlusIcon className="h-4 w-4" />, ...props }: PageHeaderProps) {
  return (
    <div className="flex gap-4 py-4 md:gap-6 md:py-6 justify-between items-start">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-primary">{titleText}</h1>
        <p className="text-muted-foreground">{description}
        </p>
      </div>
      {button_text && <Button {...props} variant="secondary" className="cursor-pointer hover:opacity-90 bg-gradient-to-r from-primary  to-primary/80 text-white">
        {icon}
        {button_text}
      </Button>}
    </div>
  );
}