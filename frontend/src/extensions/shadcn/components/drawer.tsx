// Import React for JSX and component creation
import * as React from "react";
// Import the Drawer component from the vaul library which provides drawer functionality
import { Drawer as DrawerPrimitive } from "vaul";

// Import utility function for combining class names
import { cn } from "@/lib/utils";

// Define our custom Drawer component that wraps the vaul Drawer
// Sets default behavior for scaling the background when drawer opens
const Drawer = ({
  shouldScaleBackground = true, // Default to true - scales the background content when drawer opens
  ...props // Spread all other props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  // Render the DrawerPrimitive.Root with our default props and any user props
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
// Set a display name for debugging and React DevTools
Drawer.displayName = "Drawer";

// Re-export the Trigger component - used to create the element that opens the drawer
const DrawerTrigger = DrawerPrimitive.Trigger;

// Re-export the Portal component - renders drawer content at the root of the DOM tree
const DrawerPortal = DrawerPrimitive.Portal;

// Re-export the Close component - used to create elements that close the drawer
const DrawerClose = DrawerPrimitive.Close;

// Define our custom DrawerOverlay component with React.forwardRef
// This creates the semi-transparent overlay behind the drawer
const DrawerOverlay = React.forwardRef<
  // Type for the ref - references the DrawerPrimitive.Overlay element
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  // Props type - includes all props from DrawerPrimitive.Overlay
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  // Render the DrawerPrimitive.Overlay with our styles and props
  <DrawerPrimitive.Overlay
    ref={ref} // Pass the ref to the primitive component
    // Apply overlay styles - fixed position, covers the entire screen, high z-index, semi-transparent black
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props} // Spread any remaining props
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
