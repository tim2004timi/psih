// SelectionArea.js
import React, { useState, useEffect, useRef } from 'react';

const SelectionArea = ({ children }) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
    const selectionRef = useRef(null);

    useEffect(() => {
        const handleMouseDown = (e) => {
            // if (selectionRef.current && !selectionRef.current.contains(e.target)) return;
            setIsSelecting(true);
            setStartPosition({ x: e.clientX, y: e.clientY });
            // console.log(startPosition)
            setEndPosition({ x: e.clientX, y: e.clientY });
            console.log(`Mouse down at: (${e.clientX}, ${e.clientY})`);
        };

        const handleMouseMove = (e) => {
            if (!isSelecting) return;
            setEndPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            setIsSelecting(false);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isSelecting]);

    const getSelectionStyle = () => {
        const left = Math.min(startPosition.x, endPosition.x);
        const top = Math.min(startPosition.y, endPosition.y);
        // console.log(top)
        const width = Math.abs(endPosition.x - startPosition.x);
        const height = Math.abs(endPosition.y - startPosition.y);

        return {
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            border: '1px dashed #000',
            background: 'rgba(0, 0, 0, 0.1)',
            display: isSelecting ? 'block' : 'none',
        };
    };

    return (
        <div ref={selectionRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            {children}
            <div style={getSelectionStyle()}></div>
        </div>
    );
};

export default SelectionArea;