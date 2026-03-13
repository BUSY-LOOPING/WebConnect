import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};

const Modal = ({ children, description, title, trigger, className }: Props) => {
  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
