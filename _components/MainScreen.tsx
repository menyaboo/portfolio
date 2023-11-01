'use client'
import {useEffect, useState} from "react"
import picture from "@/public/img/105c3bd55040ac5aa76b67e7b1f65be9.jpg"

interface Props {
  gameMode: boolean
}

export function MainScreen({gameMode}: Props): JSX.Element {
  const [isLoading, setValueLoading] = useState(true);
  const [cubesAmount, setCubesAmount] = useState(0)
  const [cubes, setCubes] =
    useState( typeof document !== 'undefined' ? document.querySelectorAll('.main__cubes-cube') : []);
  const [screenContent, setScreenContent] = useState(true);

  const [isAnimate, setValueAnimate] = useState(true)
  const [cubesAnimateDelay, setCubesAnimateDelay] = useState(0)

  //логика отрисовки кубов в начале рендера страницы
  useEffect(() => {
    const row = getComputedStyle(document.documentElement).getPropertyValue('--cubes-animate-amount-in-row');
    const col = getComputedStyle(document.documentElement).getPropertyValue('--cubes-animate-amount-in-column');
    const delay = getComputedStyle(document.documentElement).getPropertyValue('--cubes-animate-delay-show-new-cube');
    setCubesAmount( +row * +col)

    if (cubesAmount != 0 && cubes.length == 0) {
      setValueLoading(false)
      setCubesAnimateDelay(+delay)
      setCubes(document.querySelectorAll('.main__cubes-cube'))
    }
  })

  //useEffect для анимации кубиков
  useEffect(() => {
    // проверка отрисованны ли кубы
    if (isLoading) return
    if (!isAnimate) return

    //возвращает рандомное число
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    //выборка кубика без анимации
    function getCubeNoAnimateFade() {
      const cubesAnimate = document.querySelectorAll('.main__cubes-cube_fade')
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
    const animateCube = () => cubes[getCubeNoAnimateFade()].classList.add('main__cubes-cube_fade')
    //с определенным интервалом (cubesAnimateDelay / in root) выбираем кубик и анимируем
    const animate = setInterval(() => animateCube(), cubesAnimateDelay)
    return () => clearInterval(animate)
  })

  //логика для змейки (gameMode is true)
  useEffect(() => {
    if (isLoading) return

    function getIndexCube(x: number, y: number) {

    }
  })

  //фунуции интерактива
  const cubeMouseEnter = (e: any) => e.target.classList.add('main__cubes-cube_show')
  function cubeMouseLeave(e: any) {
    e.target.classList.remove('main__cubes-cube_show')
    e.target.classList.add('main__cubes-cube_fade')
  }
  function clearAnimateFade(e: any) {
    e.target.classList.remove('main__cubes-cube_fade')
  }

  return (
    <main>
      {isLoading ?
        <div className={'main'}>
          <div className={'main__content'}>

          </div>
        </div> :
        <div className={'main'}>
          <div className={'main__cubes'}
            onMouseEnter={() => setValueAnimate(false)}
            onMouseLeave={() => setValueAnimate(true)}>

            {Array.from({ length: cubesAmount }, (_, i) => i++).map((key: number) => (
              <span
                data-key={key}
                key={key}
                className={'main__cubes-cube'}
                onMouseEnter={(e) => cubeMouseEnter(e)}
                onMouseLeave={(e) => cubeMouseLeave(e)}
                onAnimationEnd={(e) => clearAnimateFade(e) /*убираем класс анимации когда она отработала*/}
              ></span>
            ))}
          </div>

          {!screenContent ||
            <div className={'main__content'}>
              <div className={'container mx-auto'}>
                <div className={'main__content-title'}>
                  <h1 className="glitch" data-text="menyaeboot">menyaboo</h1>
                  <p><span style={{color: '#52525b'}}>//TODO// </span>{'___'}Расписать чтото ахереть какое важное о себе</p>
                </div>
              </div>
              <div className={'main__picture'}
                   style={{
                     backgroundImage: `url(${picture.src})`,
                   }}
              ></div>
            </div>
          }

          <div onClick={() => setScreenContent(!screenContent)} className={'main__drop-menu'}></div>
        </div>
      }
    </main>
  )
}
