import React, { useEffect, useState } from 'react'

function Cursor() {
    const [position,setPosition] = useState({x: 0, y: 0})

    useEffect(()=>{
        const handleMouseMove = (e) => {
            setPosition({x: e.clientX, y: e.clientY})
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    },[])
  return (
    <div
     className='fixed w-4 h-4  text-white flex items-end justify-center bg-zinc-800 rounded-full z-[99] pointer-events-none transform -translate-x-[50%] -translate-y-[50%] transition-all duration-400 ease-out'
     style={{top: position.y - 3, left: position.x - 3}}  // Subtract 3 to center the cursor relative to the mouse position
    ></div>
  )
}

export default Cursor
