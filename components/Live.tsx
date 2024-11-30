import { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "@liveblocks/react/suspense";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, Reaction , CursorState, ReactionEvent } from "@/types/type";
import ReactionSelector from "./reaction/ReactionButton";
import FlyingReaction from "./reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";

type Props = {
  canvasRef : React.MutableRefObject<HTMLCanvasElement | null>
}

const Live = ({canvasRef} : Props) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  const [reaction, setReaction] = useState<Reaction[]>([]);

  const broadCast = useBroadcastEvent()

  useInterval(()=>{
      setReaction((reaction)=>reaction.filter((r)=>r.timestamp > Date.now() - 5000))
  }, 1000)


  useInterval(()=>{ ///this is a custom hook
    if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor){
      setReaction((reactions)=>reactions.concat([{
        point : {x : cursor.x , y : cursor.y},
        value : cursorState.reaction,
        timestamp : Date.now()
      }]))

      broadCast({
        x : cursor.x,
        y : cursor.y,
        value : cursorState.reaction
      })
    }
  }, 200)

  useEventListener((eventData)=>{
    const event = eventData.event as ReactionEvent

    setReaction((reactions)=>reactions.concat([{
      point : {x : event.x , y : event.y},
      value : event.value,
      timestamp : Date.now()
    }]))
  })


  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();

    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
      const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
      //
      const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
      //

      updateMyPresence({
        cursor: { x, y },
      });
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setCursorState({
      mode: CursorMode.Hidden,
    });

    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
    const y = e.clientY - e.currentTarget.getBoundingClientRect().y;

    updateMyPresence({
      cursor: { x, y },
    });

    setCursorState((state : CursorState)=>cursorState.mode === CursorMode.Reaction ? {...state, isPressed : true} : state);
  }, [cursorState.mode ,setCursorState]);

  const handlePointerUp = useCallback(() => {
    setCursorState((state : CursorState)=>cursorState.mode === CursorMode.Reaction ? {...state, isPressed : true} : state);
  }, [cursorState.mode ,setCursorState]);


//keboard events like '/' for comment and 'e' for reaction
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({
          message: "",
        });
        setCursorState({
          mode: CursorMode.Hidden,
        });
      } else if (e.key === "e") {
        setCursorState({
          mode: CursorMode.ReactionSelector,
        });
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [updateMyPresence]);

  const setReactions = useCallback((reaction : string)=>{
    setCursorState({mode : CursorMode.Reaction , reaction, isPressed : false})
  }, [])

  return (
    <div
      key = {cursorState.mode}
      id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative flex h-[100vh] w-full flex-1 items-center justify-center"
    >
      <canvas ref = {canvasRef} width="100% "height="100%"/>

      {reaction.map((r)=>(
        <>
          <FlyingReaction key = {r.timestamp.toString()}
            x = {r.point.x}
            y= {r.point.y}
            timestamp={r.timestamp}
            value={r.value}
          />
        </>
      ))}


      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector && (
        <>
          <ReactionSelector
              setReaction = {setReactions}
           />
        </>
      )}
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
