"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "cn";
import { XIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@base-ui/react";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
      disablePointerDismissal
    />
  );
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/50 duration-100 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50">
        <ScrollArea.Root className="h-full overscroll-contain in-[data-ending-style]:pointer-events-none">
          <ScrollArea.Viewport className="h-full overscroll-contain px-4 py-10 in-[data-ending-style]:pointer-events-none">
            <ScrollArea.Content className="flex min-h-full items-center justify-center">
              <DialogPrimitive.Popup
                data-slot="dialog-content"
                className={cn(
                  "bg-popover text-popover-foreground ring-foreground/20 sm:max-w-container data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 max-w-[calc(100%-2rem)]ll relative z-50 grid w-full gap-4 rounded-xl p-4 text-sm ring-1 duration-0 outline-none data-nested-dialog-open:opacity-0 data-open:not-data-nested-dialog-open:duration-100",
                  className,
                )}
                {...props}
              >
                {children}
                {showCloseButton && (
                  <DialogPrimitive.Close
                    data-slot="dialog-close"
                    render={
                      <Button
                        variant="ghost"
                        className="absolute top-2 right-2"
                        size="icon-sm"
                      >
                        <XIcon />
                        <span className="sr-only">Close</span>
                      </Button>
                    }
                  />
                )}
              </DialogPrimitive.Popup>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className="hidden w-4 justify-center border-x border-r-neutral-400 border-l-white bg-white pr-px transition-opacity group-data-ending-style/dialog:opacity-0 in-data-nested-dialog-open:opacity-0 in-data-nested-dialog-open:duration-0 [@media(hover:hover)]:block">
            <ScrollArea.Thumb className="w-full rounded-full bg-black/50" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          render={<Button variant="outline">Close</Button>}
        />
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "cn-font-heading text-base leading-snug font-medium",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
