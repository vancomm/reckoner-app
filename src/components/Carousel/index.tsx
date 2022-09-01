import cn from "classnames";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Customizable } from "../../types/Customizable";
import { Nestable } from "../../types/Nestable";
import styles from "./Carousel.module.css";

interface CarouselContextInterface {
  activeChild?: string;
  setActiveChild: React.Dispatch<React.SetStateAction<string | undefined>>;
  items: string[];
  register: (id: string) => void;
}

const CarouselContext = createContext<CarouselContextInterface>(
  {} as CarouselContextInterface
);

interface CarouselContextProviderProps extends Nestable {}

function CarouselContextProvider({ children }: CarouselContextProviderProps) {
  const [activeChild, setActiveChild] = useState<string>();

  const [items, setItems] = useState<string[]>([]);

  const register = (id: string) =>
    setItems((state) => (state.includes(id) ? state : [...state, id]));

  const value: CarouselContextInterface = useMemo(
    () => ({
      items,
      register,
      activeChild,
      setActiveChild,
    }),
    [items, activeChild]
  );

  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
}

const useCarouselContext = () => useContext(CarouselContext);

interface CarouselProps extends Customizable, Nestable {}

export default function Carousel({
  id,
  className,
  style,
  children,
}: CarouselProps) {
  return (
    <div className={styles.carouselContainer}>
      <CarouselContextProvider>
        <InnerCarousel id={id} className={className} style={style}>
          {children}
        </InnerCarousel>
      </CarouselContextProvider>
    </div>
  );
}

function InnerCarousel({ id, className, style, children }: CarouselProps) {
  const { items, setActiveChild } = useCarouselContext();

  useEffect(() => {
    setActiveChild(items[0]);
  }, [items, setActiveChild]);

  return (
    <div id={id} className={cn(styles.carousel, className)} style={style}>
      {children}
      {items.length > 1 && <CarouselControls />}
    </div>
  );
}

function CarouselControls() {
  const { items, activeChild, setActiveChild } = useCarouselContext();

  const handlePrev = () => {
    setActiveChild((state) => {
      if (!state) return items[0];
      const index = items.indexOf(state) - 1;
      return index >= 0 ? items[index] : items[items.length - 1];
    });
  };

  const handleNext = () => {
    setActiveChild((state) => {
      if (!state) return items[0];
      const index = items.indexOf(state) + 1;
      return index < items.length ? items[index] : items[0];
    });
  };

  return (
    <div className={styles.carouselControls}>
      <button className={styles.carouselControl} onClick={handlePrev}>
        {"<"}
      </button>
      <span>
        {activeChild ? items.indexOf(activeChild) + 1 : "-"}
        {" / "}
        {items.length || "-"}
      </span>
      <button className={styles.carouselControl} onClick={handleNext}>
        {">"}
      </button>
    </div>
  );
}

interface ItemProps extends Nestable, Customizable {
  id: string;
}

function Item({ id, className, style, children }: ItemProps) {
  const { register, activeChild } = useCarouselContext();

  useEffect(() => {
    register(id);
  }, [register, id]);

  return (
    <div
      id={id}
      className={cn(className, styles.carouselItem, {
        [styles.active]: id === activeChild,
      })}
      style={style}
    >
      {children}
    </div>
  );
}

Carousel.Item = Item;
