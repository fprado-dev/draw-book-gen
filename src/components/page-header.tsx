import { PlusIcon } from 'lucide-react';
import { Button } from './ui/button';

type PageHeaderProps = {
  icon?: React.ReactNode;
  button_text?: string;
  titleText: string;
  description: string;
  onClick?: () => void;
};
export function PageHeader({
  button_text,
  titleText,
  description,
  icon = <PlusIcon className="h-4 w-4" />,
  ...props
}: PageHeaderProps) {
  return (
    <div className="flex items-start  @max-lg:flex-col flex-row justify-between gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-primary font-bold text-2xl">{titleText}</h1>
        <p className="text-muted-foreground" >{description}</p>
      </div>
      {button_text && (
        <Button
          {...props}
          variant="secondary"
          className="from-primary to-primary/80 text-primary-foreground cursor-pointer bg-gradient-to-r hover:opacity-90"
        >
          {icon}
          {button_text}
        </Button>
      )}
    </div>
  );
}
