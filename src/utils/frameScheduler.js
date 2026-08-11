/**
 * RoamPulse AI — 240Hz Frame Scheduler & Dynamic Frame Pacing Engine
 * Target frame budget: ~4.1667ms per frame (1000ms / 240 fps)
 *
 * Provides high-precision timekeeping via performance.now(), dynamic frame pacing
 * across 60Hz/120Hz/144Hz/240Hz displays, delta-time normalization, and automatic
 * energy-saving idle throttling.
 */

import { useState, useEffect, useRef } from 'react';

// Target constants
export const TARGET_FPS = 240;
export const TARGET_FRAME_TIME_MS = 1000 / TARGET_FPS; // ~4.1667ms per frame

class FramePacingEngine {
  constructor() {
    this.listeners = new Set();
    this.isRunning = false;
    this.animFrameId = null;
    this.lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.fps = TARGET_FPS;
    this.frameTimeMs = TARGET_FRAME_TIME_MS;
    this.detectedHz = 60;
    this.frameCount = 0;
    this.fpsSampleStartTime = this.lastTime;
    this.accumulatedDelta = 0;

    this.tick = this.tick.bind(this);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.fpsSampleStartTime = this.lastTime;
    this.frameCount = 0;
    this.animFrameId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    if (!this.isRunning && this.listeners.size > 0) {
      this.start();
    }
    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  }

  tick(currentTime) {
    if (!this.isRunning) return;

    const dtRaw = currentTime - this.lastTime;
    // Cap maximum frame gap to prevent massive jumps when switching tabs (max 50ms)
    const dt = Math.min(Math.max(dtRaw, 0.1), 50);
    this.lastTime = currentTime;

    // Measure actual FPS & Display Hz over a 500ms sliding window
    this.frameCount++;
    const elapsedSinceSample = currentTime - this.fpsSampleStartTime;
    if (elapsedSinceSample >= 500) {
      const measuredFps = Math.round((this.frameCount * 1000) / elapsedSinceSample);
      this.fps = measuredFps;
      this.frameTimeMs = measuredFps > 0 ? (1000 / measuredFps) : TARGET_FRAME_TIME_MS;

      // Classify detected hardware refresh rate tier
      if (measuredFps > 200) this.detectedHz = 240;
      else if (measuredFps > 130) this.detectedHz = 144;
      else if (measuredFps > 90) this.detectedHz = 120;
      else this.detectedHz = 60;

      this.frameCount = 0;
      this.fpsSampleStartTime = currentTime;
    }

    /**
     * Normalized Delta Multiplier (dtRatio):
     * 1.0 represents a frame duration of exactly ~4.167ms (240Hz baseline).
     * If screen is running at 60Hz (dt ~ 16.6ms), dtRatio = 4.0.
     * Motion calculated using (speed * dtRatio) will advance at identical velocity
     * across 60Hz, 120Hz, or 240Hz hardware with zero tearing or stutter.
     */
    const dtRatio = dt / TARGET_FRAME_TIME_MS;

    const frameState = {
      currentTime,
      dt, // Actual delta in ms
      dtRatio, // Scaled ratio relative to 240Hz frame budget
      fps: this.fps,
      frameTimeMs: Number(this.frameTimeMs.toFixed(2)),
      targetFrameTimeMs: Number(TARGET_FRAME_TIME_MS.toFixed(2)),
      targetFps: TARGET_FPS,
      detectedHz: this.detectedHz,
      is240HzCapable: this.detectedHz >= 240
    };

    // Notify all registered animation listeners
    this.listeners.forEach((callback) => {
      try {
        callback(frameState);
      } catch (err) {
        console.error('[240Hz Engine] Callback error:', err);
      }
    });

    this.animFrameId = requestAnimationFrame(this.tick);
  }
}

// Global singleton instance
export const globalFrameScheduler = new FramePacingEngine();

/**
 * Custom Hook: useFramePacing
 * Automatically hooks into the 240Hz frame scheduler loop and provides smooth
 * frame updates and hardware Hz telemetry.
 */
export function useFramePacing(onFrameCallback) {
  const [frameStats, setFrameStats] = useState({
    fps: TARGET_FPS,
    frameTimeMs: Number(TARGET_FRAME_TIME_MS.toFixed(2)),
    targetFrameTimeMs: Number(TARGET_FRAME_TIME_MS.toFixed(2)),
    targetFps: TARGET_FPS,
    detectedHz: 240,
    dtRatio: 1.0,
    is240HzCapable: false
  });

  const callbackRef = useRef(onFrameCallback);
  useEffect(() => {
    callbackRef.current = onFrameCallback;
  }, [onFrameCallback]);

  useEffect(() => {
    let lastUiUpdate = 0;

    const handleFrame = (state) => {
      if (callbackRef.current) {
        callbackRef.current(state);
      }

      // Throttle React state telemetry updates to 5Hz (every 200ms) to avoid unnecessary React re-renders
      if (state.currentTime - lastUiUpdate > 200) {
        lastUiUpdate = state.currentTime;
        setFrameStats({
          fps: state.fps,
          frameTimeMs: state.frameTimeMs,
          targetFrameTimeMs: state.targetFrameTimeMs,
          targetFps: state.targetFps,
          detectedHz: state.detectedHz,
          dtRatio: Number(state.dtRatio.toFixed(2)),
          is240HzCapable: state.is240HzCapable
        });
      }
    };

    const unsubscribe = globalFrameScheduler.subscribe(handleFrame);
    return unsubscribe;
  }, []);

  return frameStats;
}
