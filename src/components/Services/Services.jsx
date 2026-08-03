import { useEffect, useRef } from 'react'
import { STAR_PATH } from '../../lib/starPath.js'
import { SERVICES } from './servicesData.js'
import ServiceArt from './ServiceArt.jsx'
import { createServicesScroll } from './servicesAnimation.js'
import './Services.css'

/**
 * Services.
 *
 * Sits before the work, not after it. The work proves capability but cannot
 * state the offer, and twenty projects spanning e-commerce, AI, 3D and Figma
 * proposals read as unfocused until something up front says what the through
 * line is. After the work this would be a recap; before it, it is the claim
 * the work then answers.
 *
 * Rows alternate side to side and are nudged vertically out of lockstep, so
 * the column reads as a composition rather than a table of six things.
 *
 * No React state: every row is static markup, and all motion is GSAP off refs.
 */
export default function Services() {
  const sectionRef = useRef(null)
  const rowRefs = useRef([])
  const artRefs = useRef([])

  useEffect(() => {
    return createServicesScroll(
      sectionRef.current,
      SERVICES.map((_, index) => ({
        row: rowRefs.current[index],
        art: artRefs.current[index],
      })),
    )
  }, [])

  return (
    <section className="services" id="services" ref={sectionRef}>
      <header className="services__head">
        <svg className="services__star" viewBox="0 0 24 24" aria-hidden="true">
          <path d={STAR_PATH} />
        </svg>
        <h2 className="services__eyebrow">What I do</h2>
      </header>

      <ol className="services__list">
        {SERVICES.map((service, index) => (
          <li
            className="service"
            key={service.id}
            data-side={index % 2 === 0 ? 'text-left' : 'text-right'}
            ref={(node) => {
              rowRefs.current[index] = node
            }}
          >
            <div className="service__copy">
              <p className="service__number" data-reveal>
                {service.number}
              </p>
              {/*
                The condensed display face at full width, which is the whole
                look — set as one line and allowed to run wide rather than
                wrapped, so the counters stay tall.
              */}
              <h3 className="service__title" data-reveal>
                {service.title}
              </h3>
              <p className="service__blurb" data-reveal>
                {service.blurb}
              </p>
            </div>

            <div className="service__stage">
              <ServiceArt
                art={service.art}
                artRef={(node) => {
                  artRefs.current[index] = node
                }}
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
