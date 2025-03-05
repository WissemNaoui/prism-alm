import React from "react";
import { cn } from "../utils/cn";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export function Form({ className, ...props }: FormProps) {
  return (
    <form
      className={cn("space-y-6", className)}
      {...props}
    />
  );
}

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

Form.Section = function FormSection({ className, ...props }: FormSectionProps) {
  return (
    <div
      className={cn("space-y-4", className)}
      {...props}
    />
  );
};

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

Form.Label = function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-gray-700", className)}
      {...props}
    />
  );
};

interface FormDescriptionProps extends React.ParamHTMLAttributes<HTMLParagraphElement> {}

Form.Description = function FormDescription({ className, ...props }: FormDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
};

interface FormErrorProps extends React.ParamHTMLAttributes<HTMLParagraphElement> {}

Form.Error = function FormError({ className, children, ...props }: FormErrorProps) {
  if (!children) {
    return null;
  }

  return (
    <p
      className={cn("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {children}
    </p>
  );
};
