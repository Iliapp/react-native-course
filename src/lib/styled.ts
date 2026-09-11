import { cssInterop } from "nativewind";
import type { ComponentType } from "react";

type StyledProps<P> = P & {
  className?: string;
};

export function styled<P>(Component: ComponentType<P>): ComponentType<StyledProps<P>> {
  cssInterop(Component, { className: "style" } as Parameters<typeof cssInterop>[1]);
  return Component as ComponentType<StyledProps<P>>;
}
