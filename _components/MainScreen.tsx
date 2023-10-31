'use client'
import {useEffect, useState} from "react";

interface Props {
  gameMode: boolean
}

export function MainScreen({gameMode}: Props): JSX.Element {
  const [cubesAmount, setCubesAmount] = useState(0)
  const [cubesAnimateDelay, setCubesAnimateDelay] = useState(0)
  const [isLoading, setValueLoading] = useState(true);
  const [cubes, setCubes] = useState(document?.querySelectorAll('.main__cube'));

  //логика отрисовки кубов в начале рендера страницы
  useEffect(() => {
    const row = getComputedStyle(document?.documentElement).getPropertyValue('--cubes-animate-amount-in-row');
    const col = getComputedStyle(document?.documentElement).getPropertyValue('--cubes-animate-amount-in-column');
    const delay = getComputedStyle(document?.documentElement).getPropertyValue('--cubes-animate-delay-show-new-cube');
    setCubesAmount( +row * +col)

    if (cubesAmount != 0 && cubes.length == 0) {
      setValueLoading(false)
      setCubesAnimateDelay(+delay)
      setCubes(document?.querySelectorAll('.main__cube'))
    }
  })

  //useEffect для анимации кубиков
  useEffect(() => {
    // проверка отрисованны ли кубы
    if (cubes.length == 0) return

    //возвращает рандомное число
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    //выборка кубика без анимации
    function getCubeNoAnimateFade() {
      const cubesAnimate = document?.querySelectorAll('.main__cube-fade')
      let cubesAnimateIndex: Array<number> = []
      //@ts-ignore
      cubesAnimate.forEach(el => cubesAnimateIndex.push(el.dataset.key))

      while (true) {
        const index = getRandomInt(cubes.length)
        if (cubesAnimateIndex.includes(index)) continue
        return index
      }
    }

    //анимация кубика
    const animateCube = () => cubes[getCubeNoAnimateFade()].classList.add('main__cube-fade')
    //с определенным интервалом (cubesAnimateDelay / in root) выбираем кубик и анимируем
    const animate = setInterval(() => animateCube(), cubesAnimateDelay)
    return () => clearInterval(animate)
  })

  const cubeMouseEnter = (e: any) => e.target.classList.add('main__cube-show')
  function cubeMouseLeave(e: any) {
    e.target.classList.remove('main__cube-show')
    e.target.classList.add('main__cube-fade')
  }
  function clearAnimateFade(e: any) {
    e.target.classList.remove('main__cube-fade')
  }

  return (
    <main>
      {isLoading ?
        <div className={'main'}>
          <div className={'main__content'}>
            <h1>Хуета грузит</h1>
          </div>
        </div> :
        <div className={'main'}>
          {Array.from({ length: cubesAmount }, (_, i) => i++).map((key: number) => (
            <span
              data-key={key}
              key={key}
              className={'main__cube'}
              onMouseEnter={(e) => cubeMouseEnter(e)}
              onMouseLeave={(e) => cubeMouseLeave(e)}
              onAnimationEnd={(e) => clearAnimateFade(e) /*убираем класс анимации когда она отработала*/}
            ></span>
          ))}
          <div className={'main__content'}>
            <h1>Законченная сверх неебистовая хуетень</h1>
            {Array.from({ length: 5 }, (_, i) => i++).map((key: number) => (
              <span key={key}>{key}</span>
            ))}
          </div>
        </div>
      }
      <div className={'h-[100vh]'}>

      </div>
    </main>
  )
}
