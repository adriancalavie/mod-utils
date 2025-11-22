import { toast as sonnerToast } from "sonner";
import { Button } from "./button";

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button: {
    label: string;
    onClick: () => void;
  };
}

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      button={{
        label: toast.button.label,
        onClick: () => console.log("Button clicked"),
      }}
    />
  ));
}

function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div className="bg-primary-foreground text-primary ring-border ring-offset-background flex w-full items-center gap-4 p-4 font-[minecraft] text-lg shadow-lg ring-3 md:max-w-[364px]">
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm opacity-90">{description}</p>
      </div>
      <Button
        size="sm"
        onClick={() => {
          button.onClick();
          sonnerToast.dismiss(id);
        }}
      >
        {button.label}
      </Button>
    </div>
  );
}

// export { Toaster };
