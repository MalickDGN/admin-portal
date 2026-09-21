import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import "./Accordion.css";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
}

export function Accordion({ items, allowMultiple = false, defaultOpenIds = [] }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenIds));

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        if (allowMultiple) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className="accordion__item">
            <button type="button" className="accordion__trigger" onClick={() => toggle(item.id)} aria-expanded={isOpen}>
              <span>{item.title}</span>
              <ChevronDown size={16} className={clsx("accordion__chevron", isOpen && "accordion__chevron--open")} />
            </button>
            {isOpen && <div className="accordion__content">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
