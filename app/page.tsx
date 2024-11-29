"use client";
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSideBar";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";

export default function Page() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);

  useEffect(()=>{
    const canvas  = initializeFabric({canvasRef,fabricRef});
    
    
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef
      })
    })

    window.addEventListener("resize", () => {
      handleResize({ canvas: fabricRef.current });
    })
  }, [])
  return (
    <main className="h-screen overflow-hidden">
      <Navbar/>
      <section className="h-full flex flex-row">
      <LeftSidebar/>
      <Live canvasRef={canvasRef}/>
      <RightSideBar/>

      
      </section>
     
    </main>
  );
}
