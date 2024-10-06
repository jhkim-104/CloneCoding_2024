import { useEffect, useRef } from "react";

export const useClick = (onClick) => {
  const element = useRef();
  useEffect(() => {
    if (typeof onClick !== "function") {
      return;
    }
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }
    return () => {
      if (element.currnet) {
        element.currnet.removeEventListener("click", onClick);
      }
    };
  }, []);

  return typeof onClick !== "function" ? undefined : element;
};
