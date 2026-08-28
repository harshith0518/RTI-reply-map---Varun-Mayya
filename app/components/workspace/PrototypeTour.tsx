'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { PROTOTYPE_TOUR_STEPS } from '@/src/tour';

const DISMISSED_KEY = 'rti-reply-map-tour-dismissed-v1';
const subscribeToClient = () => () => undefined;

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function wasDismissedThisSession() {
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberChoice() {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // The tour still works when browser storage is unavailable.
  }
}

function focusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter((element) => !element.hasAttribute('hidden'));
}

export function PrototypeTour() {
  const isClient = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const [active, setActive] = useState(false);
  const [choiceMade, setChoiceMade] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect>();
  const dialogRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const currentStep = PROTOTYPE_TOUR_STEPS[stepIndex];
  const showInvitation = isClient && !active && !choiceMade && !wasDismissedThisSession();
  const showLauncher = isClient && !active && !showInvitation;

  function startTour() {
    rememberChoice();
    setChoiceMade(true);
    setSpotlightRect(undefined);
    setStepIndex(0);
    setActive(true);
  }

  function closeTour() {
    setActive(false);
    setSpotlightRect(undefined);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }

  function dismissInvitation() {
    rememberChoice();
    setChoiceMade(true);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }

  function goBack() {
    if (stepIndex === 0) return;
    setSpotlightRect(undefined);
    setStepIndex((current) => current - 1);
  }

  function goNext() {
    if (stepIndex === PROTOTYPE_TOUR_STEPS.length - 1) {
      closeTour();
      return;
    }
    setSpotlightRect(undefined);
    setStepIndex((current) => current + 1);
  }

  useEffect(() => {
    if (!active) return;
    const shell = document.querySelector<HTMLElement>('.site-shell');
    const wasInert = shell?.inert ?? false;
    if (shell) shell.inert = true;
    return () => {
      if (shell) shell.inert = wasInert;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const target = document.getElementById(currentStep.targetId);
    if (!target) return;
    const targetElement = target;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const topbar = document.querySelector<HTMLElement>('.topbar');
    const stickyOffset = (topbar?.getBoundingClientRect().height ?? 0) + 16;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - stickyOffset;

    window.scrollTo({ top: Math.max(0, targetTop), behavior: reduceMotion ? 'auto' : 'smooth' });

    function measureTarget() {
      const bounds = targetElement.getBoundingClientRect();
      const dialogTop = dialogRef.current?.getBoundingClientRect().top ?? window.innerHeight - 220;
      const padding = 8;
      const top = Math.max(padding, bounds.top - padding);
      const left = Math.max(padding, bounds.left - padding);
      const right = Math.min(window.innerWidth - padding, bounds.right + padding);
      const bottom = Math.min(dialogTop - 12, window.innerHeight - padding, bounds.bottom + padding);
      setSpotlightRect({
        top,
        left,
        width: Math.max(0, right - left),
        height: Math.max(48, bottom - top),
      });
    }

    const frame = window.requestAnimationFrame(measureTarget);
    const observer = new ResizeObserver(measureTarget);
    observer.observe(targetElement);
    if (dialogRef.current) observer.observe(dialogRef.current);
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [active, currentStep.targetId]);

  useEffect(() => {
    if (!active) return;
    const frame = window.requestAnimationFrame(() => headingRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeTour();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = focusableElements(dialogRef.current);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focused = document.activeElement;
      if (event.shiftKey && (focused === first || focused === headingRef.current || !dialogRef.current.contains(focused))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, stepIndex]);

  if (!isClient) return null;

  const tourUi = (
    <>
      {showInvitation ? (
        <aside className="tour-invitation" aria-labelledby="tour-invitation-title">
          <p className="tour-invitation-kicker"><span aria-hidden="true">?</span> Optional judge helper</p>
          <h2 id="tour-invitation-title">See the whole prototype in 60 seconds.</h2>
          <p>Six short stops explain the proof, examples, tree, Reply Map and custom test.</p>
          <div className="tour-invitation-actions">
            <button className="tour-start-button" type="button" onClick={startTour}>Start quick tour</button>
            <button className="tour-dismiss-button" type="button" onClick={dismissInvitation}>Not now</button>
          </div>
          <small>You can reopen it anytime with “Quick tour”.</small>
        </aside>
      ) : null}

      {showLauncher ? (
        <button ref={launcherRef} className="tour-launcher" type="button" onClick={startTour} aria-label="Start the 60-second prototype tour">
          <span aria-hidden="true">?</span> Quick tour
        </button>
      ) : null}

      {active ? (
        <div className={`tour-layer ${spotlightRect ? '' : 'is-locating'}`}>
          {spotlightRect ? (
            <div
              className="tour-spotlight"
              style={{
                '--tour-top': `${spotlightRect.top}px`,
                '--tour-left': `${spotlightRect.left}px`,
                '--tour-width': `${spotlightRect.width}px`,
                '--tour-height': `${spotlightRect.height}px`,
              } as CSSProperties}
              aria-hidden="true"
            >
              <span>{stepIndex + 1}</span>
            </div>
          ) : null}

          <section
            ref={dialogRef}
            className="tour-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-step-title"
            aria-describedby="tour-step-description"
          >
            <header className="tour-card-heading">
              <div>
                <p>{currentStep.eyebrow}</p>
                <span aria-label={`Step ${stepIndex + 1} of ${PROTOTYPE_TOUR_STEPS.length}`}>Step {stepIndex + 1} of {PROTOTYPE_TOUR_STEPS.length}</span>
              </div>
              <button type="button" onClick={closeTour} aria-label="Close the quick tour">Skip</button>
            </header>
            <h2 ref={headingRef} id="tour-step-title" tabIndex={-1}>{currentStep.title}</h2>
            <p id="tour-step-description">{currentStep.body}</p>
            <ol className="tour-progress" aria-hidden="true">
              {PROTOTYPE_TOUR_STEPS.map((step, index) => (
                <li className={index === stepIndex ? 'active' : index < stepIndex ? 'complete' : ''} key={step.targetId} />
              ))}
            </ol>
            <footer className="tour-controls">
              <span>Esc closes the tour</span>
              <div>
                <button className="tour-back-button" type="button" onClick={goBack} disabled={stepIndex === 0}>Back</button>
                <button className="tour-next-button" type="button" onClick={goNext}>{stepIndex === PROTOTYPE_TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</button>
              </div>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );

  return createPortal(tourUi, document.body);
}
