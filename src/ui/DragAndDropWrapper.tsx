import { closestCenter, DndContext, DragOverlay, Modifier, MouseSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { useEffect, useRef, useState } from "react"
import { useBuilder } from "../contexts/BuilderContext"
import Loader from "./Loader"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"



const SortableItem = ({ id, children}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id}) 

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grab' : 'pointer',
    opacity: isDragging ? 0 : 1,
    listStyle: isDragging ? 'none' : '',
    backgroundColor: 'white',
    justifySelf: 'center'
  }

  return <div ref={setNodeRef} style={style} {...attributes}
  
  >
    {children(listeners)}
  </div>

}



const limitHorizontalRange = (maxWidth) => {
  return ({ transform }) => {
    const minX = -maxWidth;
    const maxX = maxWidth;
    console.log(maxWidth)
    return {
      ...transform,
      x: Math.min(Math.max(transform.x, minX), maxX),
      y: 0,
    };
  };
};

export default function DragAndDropWrapper({
  collection,
  dispatchAction,
  ItemComponent, 
  additionalContainerStyles,
  orientation,
  controlBtns
}) {

  const { isLoading, curQuestion, dispatch } = useBuilder();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
  const containerRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);
  const [activeId, setActiveId] = useState(null)


  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setParentWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);


  function handleDragStart(e) {
  
    setActiveId(e.active.id)
    console.log(activeId)
  }

  function handleDragEnd(e) {
    const { active, over } = e;


    console.log(activeId);
    setActiveId(null);
    if (!over || active.id === over?.id) return;

    const oldIndex = collection.findIndex((item) => item.id === active.id);
    const newIndex = collection.findIndex((item) => item.id === over?.id);

    // Prevent reorder if index didn't change
    if (oldIndex === newIndex) return
  

    // Specific payload for reordering the answers
    if (dispatchAction === "reorderAnswers") {

        dispatch({
          type: dispatchAction,
          payload: {
            questionId: curQuestion.id,
            newArray: arrayMove(collection, oldIndex, newIndex),
          },
        });
    } else {
   
        dispatch({
          type: dispatchAction,
          payload: arrayMove(collection, oldIndex, newIndex),
        });
    }
  }


  if (collection === undefined) return <div>
                                Nenhuma coleção encontrada
                                     </div>

  if (isLoading) return <Loader />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}

      // modifiers={[restrictToHorizontalAxis,
      // //   // limitHorizontalRange(parentWidth)
      // ]}
    >
      <Carousel  
        opts={{align: "start"}} 
        className="max-w-full"
        orientation={orientation}
      >
        <SortableContext
          items={collection?.map((item) => item.id)}
          // strategy={horizontalListSortingStrategy}
          >
    
          <CarouselContent>
            {collection.map((item) => (
                <CarouselItem key={item.id}  className={` self-start ${orientation === 'vertical' ? 'basis-2' : 'basis-36'}`}>
                <SortableItem id={item.id}>
                  {(listeners) => (
                    <ItemComponent item={item} listeners={listeners} />
                  )}
                </SortableItem>
                  </CarouselItem>
            ))}
          </CarouselContent>
          {
            controlBtns && <>
            <CarouselPrevious/>
            <CarouselNext/>
            </>
        }
        </SortableContext>
      </Carousel>
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <ItemComponent
            item={collection.find((item) => item.id === activeId)}
            active={activeId}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
  