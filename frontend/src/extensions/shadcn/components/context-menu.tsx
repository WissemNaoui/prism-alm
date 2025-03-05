// Import React for JSX and component creation
import * as React from "react";
// Import Radix UI's context menu components for accessible UI
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
// Import icons from Radix UI's icon set
import {
  CheckIcon,          // Checkmark icon for selected items
  ChevronRightIcon,   // Right-pointing chevron for submenus
  DotFilledIcon,      // Dot icon for radio items
} from "@radix-ui/react-icons";

// Import utility function for combining class names
import { cn } from "@/lib/utils";

// Re-export the base context menu components from Radix UI
// Root component that contains the entire context menu
const ContextMenu = ContextMenuPrimitive.Root;

// Component that defines what triggers the context menu to appear
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

// Component for grouping related menu items
const ContextMenuGroup = ContextMenuPrimitive.Group;

// Component for creating a portal that renders content outside the DOM hierarchy
const ContextMenuPortal = ContextMenuPrimitive.Portal;

// Component for creating submenu structures
const ContextMenuSub = ContextMenuPrimitive.Sub;

// Component for grouping radio items that can only have one selected option
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

// Define the SubTrigger component for submenu triggers with React.forwardRef to handle refs properly
const ContextMenuSubTrigger = React.forwardRef<
  // Type for the ref - references the Radix UI SubTrigger element
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  // Props type - includes all props from Radix UI SubTrigger plus our custom 'inset' prop
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean; // Optional prop for indentation
  }
>(({ className, inset, children, ...props }, ref) => (
  // Render the Radix UI SubTrigger with our styles and props
  <ContextMenuPrimitive.SubTrigger
    ref={ref} // Pass the ref to the Radix UI component
    // Combine default styles with conditional and user-provided classes
    className={cn(
      // Base styles for all subtriggers
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8", // Add left padding if inset prop is true
      className, // Add any user-provided classes
    )}
    {...props} // Spread any remaining props
  >
    {children} {/* Render the child elements */}
    {/* Add a chevron icon to indicate this triggers a submenu */}
    <ChevronRightIcon className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

// Define the SubContent component for displaying submenu content with React.forwardRef
const ContextMenuSubContent = React.forwardRef<
  // Type for the ref - references the Radix UI SubContent element
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  // Props type - includes all props from Radix UI SubContent
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  // Render the Radix UI SubContent with our styles and props
  <ContextMenuPrimitive.SubContent
    ref={ref} // Pass the ref to the Radix UI component
    // Combine default styles with user-provided classes
    className={cn(
      // Base styles for submenu content with lots of animation and positioning variants:
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className, // Add any user-provided classes
    )}
    {...props} // Spread any remaining props
  />
));
// Set a display name for debugging and React DevTools
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

// Define the Content component for the main context menu with React.forwardRef
const ContextMenuContent = React.forwardRef<
  // Type for the ref - references the Radix UI Content element
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  // Props type - includes all props from Radix UI Content
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  // Wrap in Portal to ensure the menu renders outside the DOM hierarchy to avoid clipping
  <ContextMenuPrimitive.Portal>
    {/* Render the Radix UI Content with our styles and props */}
    <ContextMenuPrimitive.Content
      ref={ref} // Pass the ref to the Radix UI component
      // Combine default styles with user-provided classes
      className={cn(
        // Base styles for the main context menu with animations and positioning variants:
        // - z-50 ensures high stacking order
        // - min-width and overflow handling
        // - styling for borders, background, shadows
        // - data attributes for animation states (open/closed)
        // - positioning animations based on which side the menu appears
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className, // Add any user-provided classes
      )}
      {...props} // Spread any remaining props
    />
  </ContextMenuPrimitive.Portal>
));
// Set a display name for debugging and React DevTools
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="h-4 w-4 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
