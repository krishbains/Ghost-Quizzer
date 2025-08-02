import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, World, Bodies, Body } from 'matter-js';
import { motion, useMotionValue } from 'framer-motion';
import clsx from 'clsx';
import { demoTopics } from '@/data/demoTopics';

const TAILWIND_COLORS = [
  'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500',
  'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-orange-500',
  'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500',
  'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500',
  'bg-teal-200', 'bg-teal-300', 'bg-teal-400', 'bg-teal-500',
  'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500',
  'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-400', 'bg-indigo-500',
  'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500',
  'bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-pink-500',
  'bg-rose-200', 'bg-rose-300', 'bg-rose-400', 'bg-rose-500',
  'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500',
  'bg-cyan-200', 'bg-cyan-300', 'bg-cyan-400', 'bg-cyan-500',
  'bg-sky-200', 'bg-sky-300', 'bg-sky-400', 'bg-sky-500',
  'bg-violet-200', 'bg-violet-300', 'bg-violet-400', 'bg-violet-500',
  'bg-fuchsia-200', 'bg-fuchsia-300', 'bg-fuchsia-400', 'bg-fuchsia-500',
  'bg-lime-200', 'bg-lime-300', 'bg-lime-400', 'bg-lime-500',
  'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500'
];

const getRandomColor = () => TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)];

interface BubbleData {
  id: number;
  topic: string;
  radius: number;
  color: string;
}

interface BubbleProps {
  bodyId: number;
  topic: string;
  radius: number;
  color: string;
  isSelected: boolean;
  onSelect: () => void;
  bodiesRef: React.MutableRefObject<Record<number, Matter.Body>>;
}

interface TopicBubbleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  isHost: boolean;
  isDemo?: boolean;
}

const FPS_LIMIT = 120;

const Bubble = ({ bodyId, topic, radius, color, isSelected, onSelect, bodiesRef }: BubbleProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const body = bodiesRef.current[bodyId];
    if (body) {
      x.set(body.position.x - radius);
      y.set(body.position.y - radius);
    }
  }, [bodyId, radius, bodiesRef, x, y]);

  useEffect(() => {
    let lastUpdate = performance.now();

    const updatePosition = (now: number) => {
      const delta = now - lastUpdate;
      if (delta >= 1000 / FPS_LIMIT) {
        const body = bodiesRef.current[bodyId];
        if (body) {
          x.set(body.position.x - radius);
          y.set(body.position.y - radius);
        }
        lastUpdate = now;
      }
      requestAnimationFrame(updatePosition);
    };

    requestAnimationFrame(updatePosition);
    return () => {};
  }, [bodyId, radius, bodiesRef, x, y]);

  return (
    <motion.div
      className={clsx(
        'absolute rounded-full flex items-center justify-center text-center shadow-md cursor-pointer select-none',
        color,
        isSelected ? 'ring-4 ring-blue-400' : '',
        'hover:scale-105'
      )}
      style={{
        width: `${2 * radius}px`,
        height: `${2 * radius}px`,
        fontSize: '16px',
        color: 'black',
        left: x,
        top: y
      }}
      animate={{ rotate: [0, 2, 4, -4, 4, -4, -2, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
      whileTap={{ scale: 1.1 }}
      onClick={onSelect}
    >
      {topic}
    </motion.div>
  );
};

export default function TopicBubbleSelector({ isOpen, onClose, isHost, isDemo }: TopicBubbleSelectorProps) {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedBubbleId, setSelectedBubbleId] = useState<number | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const bodiesRef = useRef<Record<number, Matter.Body>>({});
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const demoTopicIndexRef = useRef(0);

  const baseWidth = 800;
  const baseHeight = 600;
  const scale = isDemo ? 0.75 : 1; // Scaling factor only for demo mode
  const scaledWidth = baseWidth * scale;
  const scaledHeight = baseHeight * scale;

  useEffect(() => {
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 0;

    const wallOptions = { isStatic: true, label: 'wall' };
    World.add(engine.world, [
      Bodies.rectangle(baseWidth / 2 * scale, -5, baseWidth * scale, 10, wallOptions),
      Bodies.rectangle(baseWidth / 2 * scale, (baseHeight + 5) * scale, baseWidth * scale, 10, wallOptions),
      Bodies.rectangle(-5, baseHeight / 2 * scale, 10, baseHeight * scale, wallOptions),
      Bodies.rectangle((baseWidth + 5) * scale, baseHeight / 2 * scale, 10, baseHeight * scale, wallOptions)
    ]);

    engineRef.current = engine;

    const run = () => {
      Object.values(bodiesRef.current).forEach(body => {
        if (body.label !== 'wall') {
          body.velocity.x *= 0.99;
          body.velocity.y *= 0.99;
        }
      });

      Engine.update(engine, 1000 / 60);
      requestAnimationFrame(run);
    };
    requestAnimationFrame(run);

    return () => {
      Matter.Engine.clear(engine);
    };
  }, [scale]);

  useEffect(() => {
    if (isDemo && isOpen) {
      const addDemoBubble = () => {
        if (demoTopicIndexRef.current < demoTopics.length) {
          addBubbleWithTopic(demoTopics[demoTopicIndexRef.current]);
          demoTopicIndexRef.current++;
        } else {
          demoTopicIndexRef.current = 0;
          setBubbles([]);
          if (engineRef.current) {
            Object.values(bodiesRef.current).forEach(body => {
              if (body.label !== 'wall') {
                World.remove(engineRef.current!.world, body);
              }
            });
            bodiesRef.current = {};
          }
        }
      };
      addDemoBubble();
      demoIntervalRef.current = setInterval(addDemoBubble, 1500);
      return () => clearInterval(demoIntervalRef.current!);
    }
  }, [isDemo, isOpen]);

  const addBubbleWithTopic = (topic: string) => {
    if (!engineRef.current) return;
    const radius = Math.max(20, Math.min(100, 20 + 5 * topic.length)) * scale;

    const centerX = (baseWidth / 2) * scale + (Math.random() - 0.5) * 50 * scale;
    const centerY = (baseHeight / 2) * scale + (Math.random() - 0.5) * 50 * scale;

    const body = Bodies.circle(centerX, centerY, radius, {
      frictionAir: 0.02,
      restitution: 0.5
    });

    const angle = Math.random() * 2 * Math.PI;
    const speed = (5 + Math.random() * 2) * scale;
    Body.setVelocity(body, {
      x: speed * Math.cos(angle),
      y: speed * Math.sin(angle)
    });

    World.add(engineRef.current.world, body);
    bodiesRef.current[body.id] = body;

    setBubbles(prev => [...prev, { id: body.id, topic, radius, color: getRandomColor() }]);
  };

  const addBubble = () => {
    if (inputValue.trim() === '') return;
    addBubbleWithTopic(inputValue.trim());
    setInputValue('');
  };

  const handleSelect = (id: number) => {
    setSelectedBubbleId(id);
  };

  if (!isOpen) return null;

  // Demo mode: Render inline without modal
  if (isDemo) {
    return (
      <div className="w-full flex flex-col items-center">
        <div
          className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`
          }}
        >
          {bubbles.map(bubble => (
            <Bubble
              key={bubble.id}
              bodyId={bubble.id}
              topic={bubble.topic}
              radius={bubble.radius}
              color={bubble.color}
              isSelected={selectedBubbleId === bubble.id}
              onSelect={() => handleSelect(bubble.id)}
              bodiesRef={bodiesRef}
            />
          ))}
        </div>
      </div>
    );
  }

  // Regular mode: Render content only (modal wrapper handled by parent)
  return (
    <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-3xl rounded-3xl p-8 max-w-4xl max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl">
      {isHost && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold z-10 hover:scale-110 transition-transform"
        >
          ×
        </button>
      )}
      
      <div className="w-full flex flex-col items-center">
        <div
          className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          style={{
            width: `${baseWidth}px`,
            height: `${baseHeight}px`
          }}
        >
          {bubbles.map(bubble => (
            <Bubble
              key={bubble.id}
              bodyId={bubble.id}
              topic={bubble.topic}
              radius={bubble.radius}
              color={bubble.color}
              isSelected={selectedBubbleId === bubble.id}
              onSelect={() => handleSelect(bubble.id)}
              bodiesRef={bodiesRef}
            />
          ))}
        </div>
        {!isDemo && (
          <div className="flex gap-3 mt-5" style={{ width: `${baseWidth}px` }}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addBubble()}
              placeholder="Enter a topic"
              className="flex-grow px-4 py-2 text-base bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={addBubble}
              className="px-5 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 text-white rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
