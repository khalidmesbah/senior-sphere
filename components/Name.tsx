"use client";

import { useEffect, useRef } from "react";

const name = "Khalid Mesbah";

function getRandomInt(minimum: number, maximum: number) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function clearAllIntervals() {
  const interval_id = window.setInterval(
    function () {},
    Number.MAX_SAFE_INTEGER,
  );

  for (let i = 1; i < interval_id; i++) {
    window.clearInterval(i);
  }
}
export default function Name() {
  const spanRef = useRef<HTMLSpanElement>(null);

  const mouseOverHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    clearAllIntervals();
    let counter = 0;
    const interval = setInterval(() => {
      target.innerText = name
        .split("")
        .map((l, i) =>
          i < counter ? l : String.fromCharCode(getRandomInt(48, 122)),
        )
        .join("");
      counter += 1 / 3;
      if (counter > name.length) clearInterval(interval);
    }, 50);
  };

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    clearAllIntervals();
    let counter = 0;
    const interval = setInterval(() => {
      span.innerText = name
        .split("")
        .map((l, i) =>
          i < counter ? l : String.fromCharCode(getRandomInt(48, 122)),
        )
        .join("");
      counter += 1 / 3;
      if (counter > name.length) clearInterval(interval);
    }, 50);

    span.addEventListener("mouseover", mouseOverHandler);
    return () => span.removeEventListener("mouseover", mouseOverHandler);
  }, []);

  return (
    <span
      ref={spanRef}
      className="text-primary inline-flex w-[13ch] py-1 overflow-x-hidden cursor-default opacity-90 duration-200 hover:opacity-100 font-bold underline decoration-wavy underline-offset-4 break-keep whitespace-nowrap justify-center"
    >
      {name}
    </span>
  );
}
